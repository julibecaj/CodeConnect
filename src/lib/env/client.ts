function requirePublicUrl(
  value: string | undefined,
  variableName: string,
): string {
  if (!value) {
    throw new Error(`${variableName} is not configured`);
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid URL`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${variableName} must use http or https`);
  }

  return url.toString().replace(/\/$/, "");
}

function requireBoolean(
  value: string | undefined,
  variableName: string,
): boolean {
  if (value !== "true" && value !== "false") {
    throw new Error(`${variableName} must be either "true" or "false"`);
  }

  return value === "true";
}

export const clientEnv = Object.freeze({
  apiBaseUrl: requirePublicUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "NEXT_PUBLIC_API_BASE_URL",
  ),
  useJwt: requireBoolean(
    process.env.NEXT_PUBLIC_USE_JWT,
    "NEXT_PUBLIC_USE_JWT",
  ),
});