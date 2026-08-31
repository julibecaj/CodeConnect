import type {
  AuthResult,
  CreatePostInput,
  CreateProjectInput,
  CurrentUser,
  CursorPage,
  CursorQuery,
  EntityId,
  ForgotPasswordInput,
  LoginInput,
  PostDetail,
  PostSummary,
  ProjectDetail,
  ProjectSummary,
  PublicUser,
  ResetPasswordInput,
  SignupInput,
  UpdatePostInput,
  UpdateProjectInput,
} from "../contracts";

export type RequestOptions = {
  signal?: AbortSignal;
};

export type PostQuery = CursorQuery & {
  search?: string;
  tag?: string;
  authorId?: EntityId;
};

export type ProjectQuery = CursorQuery & {
  search?: string;
  tag?: string;
  ownerId?: EntityId;
};

export interface CodeConnectApi {
  login(input: LoginInput, options?: RequestOptions): Promise<AuthResult>;
  signup(input: SignupInput, options?: RequestOptions): Promise<AuthResult>;
  logout(options?: RequestOptions): Promise<void>;
  me(options?: RequestOptions): Promise<CurrentUser>;
  forgotPassword(
    input: ForgotPasswordInput,
    options?: RequestOptions,
  ): Promise<void>;
  resetPassword(
    input: ResetPasswordInput,
    options?: RequestOptions,
  ): Promise<void>;
  getUser(id: EntityId, options?: RequestOptions): Promise<PublicUser>;
  listPosts(
    query?: PostQuery,
    options?: RequestOptions,
  ): Promise<CursorPage<PostSummary>>;
  getPost(id: EntityId, options?: RequestOptions): Promise<PostDetail>;
  createPost(
    input: CreatePostInput,
    options?: RequestOptions,
  ): Promise<PostDetail>;
  updatePost(
    id: EntityId,
    input: UpdatePostInput,
    options?: RequestOptions,
  ): Promise<PostDetail>;
  deletePost(id: EntityId, options?: RequestOptions): Promise<void>;
  togglePostLike(
    id: EntityId,
    options?: RequestOptions,
  ): Promise<PostDetail>;
  togglePostSave(
    id: EntityId,
    options?: RequestOptions,
  ): Promise<PostDetail>;
  listProjects(
    query?: ProjectQuery,
    options?: RequestOptions,
  ): Promise<CursorPage<ProjectSummary>>;
  getProject(id: EntityId, options?: RequestOptions): Promise<ProjectDetail>;
  createProject(
    input: CreateProjectInput,
    options?: RequestOptions,
  ): Promise<ProjectDetail>;
  updateProject(
    id: EntityId,
    input: UpdateProjectInput,
    options?: RequestOptions,
  ): Promise<ProjectDetail>;
  deleteProject(id: EntityId, options?: RequestOptions): Promise<void>;
  toggleProjectLike(
    id: EntityId,
    options?: RequestOptions,
  ): Promise<ProjectDetail>;
  toggleProjectSave(
    id: EntityId,
    options?: RequestOptions,
  ): Promise<ProjectDetail>;
}
