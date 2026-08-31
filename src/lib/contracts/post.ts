import type {
  EntityId,
  IsoDateString,
  ResourcePermissions,
} from "./common";
import type { PublicUser } from "./user";

export type ViewerEngagement = ResourcePermissions & {
  liked: boolean;
  saved: boolean;
};

export type PostSummary = {
  id: EntityId;
  title: string;
  excerpt: string;
  tags: readonly string[];
  author: PublicUser;
  likeCount: number;
  saveCount: number;
  viewer: ViewerEngagement;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};

export type PostDetail = PostSummary & {
  content: string;
};

export type CreatePostInput = {
  title: string;
  content: string;
  tags: readonly string[];
};

export type UpdatePostInput = {
  title: string;
  content: string;
  tags: readonly string[];
};
