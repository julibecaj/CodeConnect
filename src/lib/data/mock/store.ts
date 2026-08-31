import type { EntityId, ProjectStatus, UserRole } from "../../contracts";
import {
  mockPostFixtures,
  mockProjectFixtures,
  mockUserFixtures,
} from "./fixtures";

export type MockUserRecord = {
  id: EntityId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatarUrl?: string | null;
  headline?: string | null;
  createdAt: string;
};

export type MockPostRecord = {
  id: EntityId;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  authorId: EntityId;
  likedBy: Set<EntityId>;
  savedBy: Set<EntityId>;
  createdAt: string;
  updatedAt: string;
};

export type MockProjectRecord = {
  id: EntityId;
  title: string;
  description: string;
  stack: string[];
  tags: string[];
  status: ProjectStatus;
  ownerId: EntityId;
  likedBy: Set<EntityId>;
  savedBy: Set<EntityId>;
  createdAt: string;
  updatedAt: string;
};

export type MockStore = {
  users: MockUserRecord[];
  posts: MockPostRecord[];
  projects: MockProjectRecord[];
  currentUserId: EntityId | null;
  nextUserNumber: number;
  nextPostNumber: number;
  nextProjectNumber: number;
};

export function createMockStore(initialUserId: EntityId | null): MockStore {
  return {
    users: mockUserFixtures.map((user) => ({ ...user })),
    posts: mockPostFixtures.map((post) => ({
      ...post,
      tags: [...post.tags],
      likedBy: new Set(post.likedBy),
      savedBy: new Set(post.savedBy),
    })),
    projects: mockProjectFixtures.map((project) => ({
      ...project,
      stack: [...project.stack],
      tags: [...project.tags],
      likedBy: new Set(project.likedBy),
      savedBy: new Set(project.savedBy),
    })),
    currentUserId: initialUserId,
    nextUserNumber: mockUserFixtures.length + 1,
    nextPostNumber: mockPostFixtures.length + 1,
    nextProjectNumber: mockProjectFixtures.length + 1,
  };
}
