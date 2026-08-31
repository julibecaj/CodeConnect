import { getBackendApiUrl } from "@/lib/env/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NotifyRequest = {
  email?: unknown;
};

export async function POST(request: Request) {
  let body: NotifyRequest;

  try {
    body = (await request.json()) as NotifyRequest;
  } catch {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  if (!email || email.length > 254 || !emailPattern.test(email)) {
    return Response.json(
      { error: "Enter a valid email address" },
      { status: 400 },
    );
  }

    let backendUrl: string;

    try {
        backendUrl = getBackendApiUrl();
    } catch (error) {
        console.error("Invalid server environment configuration", {
            cause: error instanceof Error ? error.message : "Unknown error",
        });

        return Response.json(
            { error: "Notification service is unavailable" },
            { status: 503 },
        );  
    }

  try {
    const response = await fetch(
      `${backendUrl}/public/notify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (response.status === 429) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    if (!response.ok) {
      console.error("Notification backend failed", {
        status: response.status,
      });

      return Response.json(
        { error: "Notification service is unavailable" },
        { status: 502 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Notification backend request failed", {
      cause: error instanceof Error ? error.message : "Unknown error",
    });

    return Response.json(
      { error: "Notification service is unavailable" },
      { status: 502 },
    );
  }
}