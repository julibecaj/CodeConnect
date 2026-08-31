import "server-only";

export function getBackendApiUrl(): string {
  const value = process.env.BACKEND_API_URL?.trim();

  if (!value) {
    throw new Error("BACKEND_API_URL is not configured");
  }
  

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("BACKEND_API_URL must be a valid URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("BACKEND_API_URL must use http or https");
  }

  const isLocal =
    url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (
    process.env.NODE_ENV === "production" &&
    url.protocol !== "https:" &&
    !isLocal
  ) {
    throw new Error("BACKEND_API_URL must use HTTPS in production");
  }

  return url.toString().replace(/\/$/, "");
}