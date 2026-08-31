import type {
  CurrentUser,
  EntityId,
  IsoDateString,
  ProjectStatus,
} from "../../contracts";

export type MockUserFixture = CurrentUser & {
  readonly password: string;
};

export type MockPostFixture = {
  readonly id: EntityId;
  readonly title: string;
  readonly excerpt: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly authorId: EntityId;
  readonly likedBy: readonly EntityId[];
  readonly savedBy: readonly EntityId[];
  readonly createdAt: IsoDateString;
  readonly updatedAt: IsoDateString;
};

export type MockProjectFixture = {
  readonly id: EntityId;
  readonly title: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly tags: readonly string[];
  readonly status: ProjectStatus;
  readonly ownerId: EntityId;
  readonly likedBy: readonly EntityId[];
  readonly savedBy: readonly EntityId[];
  readonly createdAt: IsoDateString;
  readonly updatedAt: IsoDateString;
};

export const DEMO_USER_ID = "user-demo";

export const mockUserFixtures: readonly MockUserFixture[] = Object.freeze([
  {
    id: DEMO_USER_ID,
    name: "Demo Builder",
    email: "demo@codeconnect.test",
    password: "DemoPass123!",
    role: "USER",
    avatarUrl: null,
    headline: "Building thoughtful developer tools",
    createdAt: "2025-01-10T09:00:00.000Z",
  },
  {
    id: "user-river",
    name: "River Chen",
    email: "river@codeconnect.test",
    password: "RiverPass123!",
    role: "USER",
    avatarUrl: null,
    headline: "Frontend systems enthusiast",
    createdAt: "2025-01-12T10:00:00.000Z",
  },
  {
    id: "user-sage",
    name: "Sage Morgan",
    email: "sage@codeconnect.test",
    password: "SagePass123!",
    role: "ADMIN",
    avatarUrl: null,
    headline: "APIs, reliability, and documentation",
    createdAt: "2025-01-14T11:00:00.000Z",
  },
]);

export const mockPostFixtures: readonly MockPostFixture[] = Object.freeze([
  {
    id: "post-001",
    title: "A practical guide to typed API boundaries",
    excerpt: "A small contract layer can keep UI and transport concerns separate.",
    content: "Define stable types first, then adapt transport responses at the edge.",
    tags: ["typescript", "api"],
    authorId: DEMO_USER_ID,
    likedBy: ["user-river"],
    savedBy: ["user-sage"],
    createdAt: "2025-03-06T09:00:00.000Z",
    updatedAt: "2025-03-06T09:00:00.000Z",
  },
  {
    id: "post-002",
    title: "Accessible loading states",
    excerpt: "Loading feedback should be calm, concise, and announced politely.",
    content: "Use semantic status regions and avoid unnecessary timing logic.",
    tags: ["accessibility", "frontend"],
    authorId: "user-river",
    likedBy: [DEMO_USER_ID, "user-sage"],
    savedBy: [DEMO_USER_ID],
    createdAt: "2025-03-05T09:00:00.000Z",
    updatedAt: "2025-03-05T12:00:00.000Z",
  },
  {
    id: "post-003",
    title: "Cursor pagination without surprises",
    excerpt: "Stable ordering makes cursor pagination predictable.",
    content: "Sort deterministically and validate every cursor before slicing results.",
    tags: ["api", "pagination"],
    authorId: "user-sage",
    likedBy: [DEMO_USER_ID],
    savedBy: [],
    createdAt: "2025-03-04T09:00:00.000Z",
    updatedAt: "2025-03-04T09:00:00.000Z",
  },
  {
    id: "post-004",
    title: "Designing optimistic interactions",
    excerpt: "Return authoritative mutation results so clients never guess.",
    content: "Updated counts and viewer state should arrive together after a mutation.",
    tags: ["ux", "api"],
    authorId: DEMO_USER_ID,
    likedBy: [],
    savedBy: ["user-river"],
    createdAt: "2025-03-03T09:00:00.000Z",
    updatedAt: "2025-03-03T09:00:00.000Z",
  },
  {
    id: "post-005",
    title: "Small components, clear ownership",
    excerpt: "Explicit ownership makes authorization easier to reason about.",
    content: "Keep permission derivation near the data boundary and return it explicitly.",
    tags: ["architecture", "security"],
    authorId: "user-river",
    likedBy: ["user-sage"],
    savedBy: [],
    createdAt: "2025-03-02T09:00:00.000Z",
    updatedAt: "2025-03-02T09:00:00.000Z",
  },
  {
    id: "post-006",
    title: "Mock data that stays deterministic",
    excerpt: "Synthetic fixtures are most useful when IDs and dates remain stable.",
    content: "Clone immutable fixtures for every adapter instance to isolate test state.",
    tags: ["testing", "development"],
    authorId: "user-sage",
    likedBy: [DEMO_USER_ID, "user-river"],
    savedBy: [DEMO_USER_ID, "user-river"],
    createdAt: "2025-03-01T09:00:00.000Z",
    updatedAt: "2025-03-01T09:00:00.000Z",
  },
]);

export const mockProjectFixtures: readonly MockProjectFixture[] = Object.freeze([
  {
    id: "project-001",
    title: "Contract Explorer",
    description: "A visual catalog for frontend API contracts.",
    stack: ["Next.js", "TypeScript"],
    tags: ["developer-tools", "api"],
    status: "PUBLISHED",
    ownerId: DEMO_USER_ID,
    likedBy: ["user-river", "user-sage"],
    savedBy: ["user-river"],
    createdAt: "2025-02-20T09:00:00.000Z",
    updatedAt: "2025-03-05T09:00:00.000Z",
  },
  {
    id: "project-002",
    title: "Focus Board",
    description: "A distraction-light planning board for small teams.",
    stack: ["React", "PostgreSQL"],
    tags: ["productivity", "collaboration"],
    status: "IN_REVIEW",
    ownerId: "user-river",
    likedBy: [DEMO_USER_ID],
    savedBy: [DEMO_USER_ID],
    createdAt: "2025-02-18T09:00:00.000Z",
    updatedAt: "2025-03-04T09:00:00.000Z",
  },
  {
    id: "project-003",
    title: "Reliable Queue Lab",
    description: "Interactive examples for retry and delivery semantics.",
    stack: ["TypeScript", "Redis"],
    tags: ["systems", "education"],
    status: "PUBLISHED",
    ownerId: "user-sage",
    likedBy: [DEMO_USER_ID, "user-river"],
    savedBy: [],
    createdAt: "2025-02-16T09:00:00.000Z",
    updatedAt: "2025-03-03T09:00:00.000Z",
  },
  {
    id: "project-004",
    title: "Palette Notes",
    description: "A compact workspace for accessible color decisions.",
    stack: ["Next.js", "CSS"],
    tags: ["design", "accessibility"],
    status: "DRAFT",
    ownerId: DEMO_USER_ID,
    likedBy: [],
    savedBy: ["user-sage"],
    createdAt: "2025-02-14T09:00:00.000Z",
    updatedAt: "2025-03-02T09:00:00.000Z",
  },
]);
