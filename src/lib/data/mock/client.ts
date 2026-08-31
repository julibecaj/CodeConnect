import type {
  ApiErrorCode,
  ApiProblem,
  AuthResult,
  CurrentUser,
  CursorPage,
  EntityId,
  FieldErrors,
  PostDetail,
  PostSummary,
  ProjectDetail,
  PublicUser,
} from "../../contracts";
import type {
  CodeConnectApi,
  PostQuery,
  ProjectQuery,
  RequestOptions,
} from "../api-client";
import { ApiClientError } from "../api-error";
import { DEMO_USER_ID } from "./fixtures";
import {
  createMockStore,
  type MockPostRecord,
  type MockProjectRecord,
  type MockStore,
  type MockUserRecord,
} from "./store";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export type MockApiClientOptions = {
  delayMs?: number;
  initialUserId?: EntityId | null;
};

function fail(
  status: number,
  code: ApiErrorCode,
  message: string,
  fieldErrors?: FieldErrors,
): never {
  const problem: ApiProblem = { status, code, message };
  if (fieldErrors) problem.fieldErrors = fieldErrors;
  throw new ApiClientError(problem);
}

function publicUser(user: MockUserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
    headline: user.headline ?? null,
  };
}

function currentUser(user: MockUserRecord): CurrentUser {
  return {
    ...publicUser(user),
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function findUser(store: MockStore, id: EntityId): MockUserRecord {
  const user = store.users.find((candidate) => candidate.id === id);
  if (!user) fail(404, "NOT_FOUND", "User not found.");
  return user;
}

function sessionUser(store: MockStore): MockUserRecord {
  if (!store.currentUserId) {
    fail(401, "UNAUTHENTICATED", "Authentication is required.");
  }
  return findUser(store, store.currentUserId);
}

function postDetail(store: MockStore, post: MockPostRecord): PostDetail {
  const viewerId = store.currentUserId;
  const ownsPost = viewerId === post.authorId;
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    tags: [...post.tags],
    author: publicUser(findUser(store, post.authorId)),
    likeCount: post.likedBy.size,
    saveCount: post.savedBy.size,
    viewer: {
      liked: viewerId ? post.likedBy.has(viewerId) : false,
      saved: viewerId ? post.savedBy.has(viewerId) : false,
      canEdit: ownsPost,
      canDelete: ownsPost,
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function postSummary(store: MockStore, post: MockPostRecord): PostSummary {
  const detail = postDetail(store, post);
  return {
    id: detail.id,
    title: detail.title,
    excerpt: detail.excerpt,
    tags: detail.tags,
    author: detail.author,
    likeCount: detail.likeCount,
    saveCount: detail.saveCount,
    viewer: detail.viewer,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  };
}

function projectDetail(
  store: MockStore,
  project: MockProjectRecord,
): ProjectDetail {
  const viewerId = store.currentUserId;
  const ownsProject = viewerId === project.ownerId;
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    stack: [...project.stack],
    tags: [...project.tags],
    status: project.status,
    owner: publicUser(findUser(store, project.ownerId)),
    likeCount: project.likedBy.size,
    saveCount: project.savedBy.size,
    viewer: {
      liked: viewerId ? project.likedBy.has(viewerId) : false,
      saved: viewerId ? project.savedBy.has(viewerId) : false,
      canEdit: ownsProject,
      canDelete: ownsProject,
    },
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

function validLimit(limit?: number): number {
  const resolved = limit ?? DEFAULT_LIMIT;
  if (!Number.isInteger(resolved) || resolved < 1 || resolved > MAX_LIMIT) {
    fail(400, "BAD_REQUEST", `Limit must be between 1 and ${MAX_LIMIT}.`);
  }
  return resolved;
}

function cursorOffset(cursor?: string): number {
  if (!cursor) return 0;
  const match = /^offset:(\d+)$/.exec(cursor);
  if (!match) fail(400, "BAD_REQUEST", "Cursor is invalid.");
  const offset = Number(match[1]);
  if (!Number.isSafeInteger(offset)) {
    fail(400, "BAD_REQUEST", "Cursor is invalid.");
  }
  return offset;
}

function page<T>(items: readonly T[], cursor?: string, limit?: number): CursorPage<T> {
  const offset = cursorOffset(cursor);
  const pageLimit = validLimit(limit);
  if (offset > items.length) {
    fail(400, "BAD_REQUEST", "Cursor is outside the result set.");
  }
  const result = items.slice(offset, offset + pageLimit);
  const nextOffset = offset + result.length;
  return {
    items: result,
    nextCursor: nextOffset < items.length ? `offset:${nextOffset}` : null,
  };
}

function requiredText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) {
    fail(422, "VALIDATION_FAILED", "Input validation failed.", {
      [field]: [`${field} is required.`],
    });
  }
  return normalized;
}

function normalizedEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail(422, "VALIDATION_FAILED", "Input validation failed.", {
      email: ["Enter a valid email address."],
    });
  }
  return email;
}

function validatePassword(password: string, field = "password"): void {
  if (password.length < 8) {
    fail(422, "VALIDATION_FAILED", "Input validation failed.", {
      [field]: ["Password must contain at least 8 characters."],
    });
  }
}

function findPost(store: MockStore, id: EntityId): MockPostRecord {
  const post = store.posts.find((candidate) => candidate.id === id);
  if (!post) fail(404, "NOT_FOUND", "Post not found.");
  return post;
}

function findProject(store: MockStore, id: EntityId): MockProjectRecord {
  const project = store.projects.find((candidate) => candidate.id === id);
  if (!project) fail(404, "NOT_FOUND", "Project not found.");
  return project;
}

function assertOwner(ownerId: EntityId, viewerId: EntityId): void {
  if (ownerId !== viewerId) {
    fail(403, "FORBIDDEN", "You do not have permission for this resource.");
  }
}

function nextTimestamp(): string {
  return new Date().toISOString();
}

function excerpt(content: string): string {
  return content.length > 140 ? `${content.slice(0, 137)}...` : content;
}

function abortError(): Error {
  const error = new Error("The operation was aborted.");
  error.name = "AbortError";
  return error;
}

async function wait(delayMs: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) throw abortError();
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delayMs);
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(abortError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export function createMockApiClient(
  options: MockApiClientOptions = {},
): CodeConnectApi {
  const delayMs = Math.max(0, options.delayMs ?? 80);
  const store = createMockStore(
    options.initialUserId === undefined ? DEMO_USER_ID : options.initialUserId,
  );

  const delayed = async <T>(
    action: () => T | Promise<T>,
    requestOptions?: RequestOptions,
  ): Promise<T> => {
    await wait(delayMs, requestOptions?.signal);
    if (requestOptions?.signal?.aborted) throw abortError();
    return action();
  };

  return {
    login(input, requestOptions) {
      return delayed(() => {
        const email = normalizedEmail(input.email);
        requiredText(input.password, "password");
        const user = store.users.find(
          (candidate) => candidate.email.toLowerCase() === email,
        );
        if (!user || user.password !== input.password) {
          fail(401, "UNAUTHENTICATED", "Email or password is incorrect.");
        }
        store.currentUserId = user.id;
        return { user: currentUser(user) } satisfies AuthResult;
      }, requestOptions);
    },

    signup(input, requestOptions) {
      return delayed(() => {
        const name = requiredText(input.name, "name");
        const email = normalizedEmail(input.email);
        validatePassword(input.password);
        if (
          store.users.some(
            (candidate) => candidate.email.toLowerCase() === email,
          )
        ) {
          fail(409, "CONFLICT", "An account with this email already exists.");
        }
        const user: MockUserRecord = {
          id: `user-${String(store.nextUserNumber++).padStart(3, "0")}`,
          name,
          email,
          password: input.password,
          role: "USER",
          avatarUrl: null,
          headline: null,
          createdAt: nextTimestamp(),
        };
        store.users.push(user);
        store.currentUserId = user.id;
        return { user: currentUser(user) } satisfies AuthResult;
      }, requestOptions);
    },

    logout(requestOptions) {
      return delayed(() => {
        store.currentUserId = null;
      }, requestOptions);
    },

    me(requestOptions) {
      return delayed(() => currentUser(sessionUser(store)), requestOptions);
    },

    forgotPassword(input, requestOptions) {
      return delayed(() => {
        normalizedEmail(input.email);
      }, requestOptions);
    },

    resetPassword(input, requestOptions) {
      return delayed(() => {
        requiredText(input.token, "token");
        validatePassword(input.newPassword, "newPassword");
        if (input.token !== "mock-reset-token") {
          fail(400, "BAD_REQUEST", "Reset token is invalid or expired.");
        }
      }, requestOptions);
    },

    getUser(id, requestOptions) {
      return delayed(() => publicUser(findUser(store, id)), requestOptions);
    },

    listPosts(query: PostQuery = {}, requestOptions) {
      return delayed(() => {
        const search = query.search?.trim().toLowerCase();
        const tag = query.tag?.trim().toLowerCase();
        const posts = store.posts
          .filter((post) => !query.authorId || post.authorId === query.authorId)
          .filter(
            (post) =>
              !tag || post.tags.some((candidate) => candidate.toLowerCase() === tag),
          )
          .filter(
            (post) =>
              !search ||
              `${post.title} ${post.excerpt} ${post.content}`
                .toLowerCase()
                .includes(search),
          )
          .sort(
            (left, right) =>
              right.createdAt.localeCompare(left.createdAt) ||
              left.id.localeCompare(right.id),
          )
          .map((post) => postSummary(store, post));
        return page(posts, query.cursor, query.limit);
      }, requestOptions);
    },

    getPost(id, requestOptions) {
      return delayed(() => postDetail(store, findPost(store, id)), requestOptions);
    },

    createPost(input, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const title = requiredText(input.title, "title");
        const content = requiredText(input.content, "content");
        const timestamp = nextTimestamp();
        const post: MockPostRecord = {
          id: `post-${String(store.nextPostNumber++).padStart(3, "0")}`,
          title,
          excerpt: excerpt(content),
          content,
          tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
          authorId: user.id,
          likedBy: new Set(),
          savedBy: new Set(),
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        store.posts.push(post);
        return postDetail(store, post);
      }, requestOptions);
    },

    updatePost(id, input, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const post = findPost(store, id);
        assertOwner(post.authorId, user.id);
        post.title = requiredText(input.title, "title");
        post.content = requiredText(input.content, "content");
        post.excerpt = excerpt(post.content);
        post.tags = input.tags.map((tag) => tag.trim()).filter(Boolean);
        post.updatedAt = nextTimestamp();
        return postDetail(store, post);
      }, requestOptions);
    },

    deletePost(id, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const post = findPost(store, id);
        assertOwner(post.authorId, user.id);
        store.posts.splice(store.posts.indexOf(post), 1);
      }, requestOptions);
    },

    togglePostLike(id, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const post = findPost(store, id);
        if (post.likedBy.has(user.id)) post.likedBy.delete(user.id);
        else post.likedBy.add(user.id);
        return postDetail(store, post);
      }, requestOptions);
    },

    togglePostSave(id, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const post = findPost(store, id);
        if (post.savedBy.has(user.id)) post.savedBy.delete(user.id);
        else post.savedBy.add(user.id);
        return postDetail(store, post);
      }, requestOptions);
    },

    listProjects(query: ProjectQuery = {}, requestOptions) {
      return delayed(() => {
        const search = query.search?.trim().toLowerCase();
        const tag = query.tag?.trim().toLowerCase();
        const projects = store.projects
          .filter((project) => !query.ownerId || project.ownerId === query.ownerId)
          .filter(
            (project) =>
              !tag ||
              project.tags.some((candidate) => candidate.toLowerCase() === tag),
          )
          .filter(
            (project) =>
              !search ||
              `${project.title} ${project.description} ${project.stack.join(" ")}`
                .toLowerCase()
                .includes(search),
          )
          .sort(
            (left, right) =>
              right.createdAt.localeCompare(left.createdAt) ||
              left.id.localeCompare(right.id),
          )
          .map((project) => projectDetail(store, project));
        return page(projects, query.cursor, query.limit);
      }, requestOptions);
    },

    getProject(id, requestOptions) {
      return delayed(
        () => projectDetail(store, findProject(store, id)),
        requestOptions,
      );
    },

    createProject(input, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const timestamp = nextTimestamp();
        const project: MockProjectRecord = {
          id: `project-${String(store.nextProjectNumber++).padStart(3, "0")}`,
          title: requiredText(input.title, "title"),
          description: requiredText(input.description, "description"),
          stack: input.stack.map((item) => item.trim()).filter(Boolean),
          tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
          status: input.status,
          ownerId: user.id,
          likedBy: new Set(),
          savedBy: new Set(),
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        store.projects.push(project);
        return projectDetail(store, project);
      }, requestOptions);
    },

    updateProject(id, input, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const project = findProject(store, id);
        assertOwner(project.ownerId, user.id);
        project.title = requiredText(input.title, "title");
        project.description = requiredText(input.description, "description");
        project.stack = input.stack.map((item) => item.trim()).filter(Boolean);
        project.tags = input.tags.map((tag) => tag.trim()).filter(Boolean);
        project.status = input.status;
        project.updatedAt = nextTimestamp();
        return projectDetail(store, project);
      }, requestOptions);
    },

    deleteProject(id, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const project = findProject(store, id);
        assertOwner(project.ownerId, user.id);
        store.projects.splice(store.projects.indexOf(project), 1);
      }, requestOptions);
    },

    toggleProjectLike(id, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const project = findProject(store, id);
        if (project.likedBy.has(user.id)) project.likedBy.delete(user.id);
        else project.likedBy.add(user.id);
        return projectDetail(store, project);
      }, requestOptions);
    },

    toggleProjectSave(id, requestOptions) {
      return delayed(() => {
        const user = sessionUser(store);
        const project = findProject(store, id);
        if (project.savedBy.has(user.id)) project.savedBy.delete(user.id);
        else project.savedBy.add(user.id);
        return projectDetail(store, project);
      }, requestOptions);
    },
  };
}
