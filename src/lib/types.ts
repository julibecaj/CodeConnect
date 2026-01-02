export type APIError = {
  message: string;
  status?: number;
  details?: Record<string, string[]>;
};

export type UserLink = {
  label: string;
  href: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  tags?: string[];
  followers?: number;
  posts?: number;
  projects?: number;
  status?: string;
  links?: UserLink[];
};

export type ContentSummary = {
  id: string;
  title: string;
  excerpt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Post = ContentSummary & {
  likes: number;
  saves: number;
  tags: string[];
  author?: Pick<User, "id" | "name" | "avatarUrl">;
  content?: string;
  isLiked?: boolean;
  isSaved?: boolean;
};

export type ProjectStatus = "Draft" | "Published" | "In review" | string;

export type Project = ContentSummary & {
  stack?: string;
  status: ProjectStatus;
  likes: number;
  saves: number;
  tags: string[];
  owner?: Pick<User, "id" | "name" | "avatarUrl">;
  isLiked?: boolean;
  isSaved?: boolean;
};

export type AuthResponse = {
  user: User;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
};

export type Paginated<T> = {
  items: T[];
  total?: number;
  page?: number;
  pageSize?: number;
};
