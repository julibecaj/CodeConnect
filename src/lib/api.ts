import { authHeaders, clearAuthTokens, credentialsMode, persistAuthTokens, USE_JWT } from "./auth";
import type { APIError, AuthResponse, Paginated, Post, Project, User } from "./types";
import { clientEnv } from "./env/client";

const API_BASE = clientEnv.apiBaseUrl;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown> | FormData;
  signal?: AbortSignal;
  authenticated?: boolean;
};

class ApiRequestError extends Error implements APIError {
  status?: number;
  details?: Record<string, string[]>;

  constructor(message: string, status?: number, details?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function resolveUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return text ? { message: text } : null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal, authenticated = true } = options;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  let payload: BodyInit | undefined;

  if (body instanceof FormData) {
    payload = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (authenticated) {
    Object.assign(headers, authHeaders());
  }

  const res = await fetch(resolveUrl(path), {
    method,
    headers,
    body: payload,
    signal,
    credentials: credentialsMode(),
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthTokens();
      if (typeof window !== "undefined") {
        const qs = new URLSearchParams({ from: "protected" });
        window.location.assign(`/login?${qs.toString()}`);
      }
    }

    const message = (data as APIError)?.message || "Request failed";
    const details = (data as APIError)?.details;
    throw new ApiRequestError(message, res.status, details);
  }

  return data as T;
}

export const api = {
  async signup(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await request<AuthResponse>("/auth/signup", { method: "POST", body: input, authenticated: false });
    if (USE_JWT) persistAuthTokens(res);
    return res;
  },

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    const res = await request<AuthResponse>("/auth/login", { method: "POST", body: input, authenticated: false });
    if (USE_JWT) persistAuthTokens(res);
    return res;
  },

  async logout(): Promise<void> {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      clearAuthTokens();
    }
  },

  me(): Promise<User> {
    return request<User>("/auth/me");
  },

  forgotPassword(input: { email: string }): Promise<{ message?: string }> {
    return request("/auth/forgot-password", { method: "POST", body: input, authenticated: false });
  },

  resetPassword(input: { token: string; newPassword: string }): Promise<{ message?: string }> {
    return request("/auth/reset-password", { method: "POST", body: input, authenticated: false });
  },

  getPosts(params?: { author?: string }): Promise<Post[] | Paginated<Post>> {
    const query = params?.author ? `?author=${encodeURIComponent(params.author)}` : "";
    return request(`/posts${query}`);
  },

  createPost(input: { title: string; content: string; tags?: string[] }): Promise<Post> {
    return request<Post>("/posts", { method: "POST", body: input });
  },

  updatePost(id: string, input: Partial<{ title: string; content: string; tags: string[] }>): Promise<Post> {
    return request<Post>(`/posts/${id}`, { method: "PUT", body: input });
  },

  deletePost(id: string): Promise<void> {
    return request<void>(`/posts/${id}`, { method: "DELETE" });
  },

  likePost(id: string): Promise<{ liked: boolean }> {
    return request(`/posts/${id}/like`, { method: "POST" });
  },

  savePost(id: string): Promise<{ saved: boolean }> {
    return request(`/posts/${id}/save`, { method: "POST" });
  },

  getProjects(params?: { owner?: string }): Promise<Project[] | Paginated<Project>> {
    const query = params?.owner ? `?owner=${encodeURIComponent(params.owner)}` : "";
    return request(`/projects${query}`);
  },

  createProject(input: { title: string; stack?: string; status?: string; tags?: string[]; description?: string }): Promise<Project> {
    return request<Project>("/projects", { method: "POST", body: input });
  },

  updateProject(id: string, input: Partial<{ title: string; stack: string; status: string; tags: string[]; description: string }>): Promise<Project> {
    return request<Project>(`/projects/${id}`, { method: "PUT", body: input });
  },

  deleteProject(id: string): Promise<void> {
    return request<void>(`/projects/${id}`, { method: "DELETE" });
  },

  likeProject(id: string): Promise<{ liked: boolean }> {
    return request(`/projects/${id}/like`, { method: "POST" });
  },

  saveProject(id: string): Promise<{ saved: boolean }> {
    return request(`/projects/${id}/save`, { method: "POST" });
  },
};

export type { ApiRequestError };
