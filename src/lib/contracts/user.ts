import type { EntityId, IsoDateString } from "./common";

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

// Public profiles intentionally exclude account and authorization data.
export type PublicUser = {
  id: EntityId;
  name: string;
  avatarUrl?: string | null;
  headline?: string | null;
};

export type CurrentUser = PublicUser & {
  email: string;
  role: UserRole;
  createdAt: IsoDateString;
};
