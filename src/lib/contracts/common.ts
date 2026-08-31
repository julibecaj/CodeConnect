export type EntityId = string;

export type IsoDateString = string;

export type CursorPage<T> = {
  items: readonly T[];
  nextCursor: string | null;
};

export type CursorQuery = {
  cursor?: string;
  limit?: number;
};

export type FieldErrors = Record<string, readonly string[]>;

/** Stable machine-readable categories for API failures. */
export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_FAILED"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE";

export type ApiProblem = {
  status: number;
  code: ApiErrorCode;
  message: string;
  requestId?: string;
  fieldErrors?: FieldErrors;
  retryAfterSeconds?: number;
};

export type ResourcePermissions = {
  canEdit: boolean;
  canDelete: boolean;
};
