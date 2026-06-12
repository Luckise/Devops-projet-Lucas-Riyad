import { createFileRoute } from "@tanstack/react-router";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-west-3" });

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}

async function handle({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { idToken, email } = (await request.json()) as { idToken?: string; email?: string };

    if (!idToken || !email) {
      return new Response(JSON.stringify({ error: "Missing idToken or email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = decodeJwtPayload(idToken);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groups = payload["cognito:groups"] as string[] | undefined;
    if (!Array.isArray(groups) || !groups.includes("Admin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userPoolId = process.env.VITE_COGNITO_USER_POOL_ID;
    if (!userPoolId) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    await client.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: userPoolId,
        Username: email,
        GroupName: "Admin",
      }),
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const Route = createFileRoute("/api/cognito/group")({
  server: {
    handlers: {
      POST: handle,
    },
  },
});
