import type { EntityId, IsoDateString } from "./common";
import type { ViewerEngagement } from "./post";
import type { PublicUser } from "./user";

export type ProjectStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED";

export type ProjectSummary = {
  id: EntityId;
  title: string;
  description: string;
  stack: readonly string[];
  tags: readonly string[];
  status: ProjectStatus;
  owner: PublicUser;
  likeCount: number;
  saveCount: number;
  viewer: ViewerEngagement;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};

export type ProjectDetail = ProjectSummary;

export type CreateProjectInput = {
  title: string;
  description: string;
  stack: readonly string[];
  tags: readonly string[];
  status: ProjectStatus;
};

export type UpdateProjectInput = {
  title: string;
  description: string;
  stack: readonly string[];
  tags: readonly string[];
  status: ProjectStatus;
};
