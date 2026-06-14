import { Amplify } from "aws-amplify";

let _configured = false;

function ensureConfigured() {
  if (_configured) return;

  const userPoolId =
    import.meta.env.VITE_COGNITO_USER_POOL_ID ||
    (typeof process !== "undefined" && process.env?.COGNITO_USER_POOL_ID) ||
    "eu-west-3_lVGeXq3XV";
  const clientId =
    import.meta.env.VITE_COGNITO_CLIENT_ID ||
    (typeof process !== "undefined" && process.env?.COGNITO_CLIENT_ID) ||
    "6o96ffav0fggnv1hpaihik38d9";

  if (!userPoolId || !clientId) return;

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId: clientId,
        loginWith: { email: true },
      },
    },
  });
  _configured = true;
}

export function ensureAuth() {
  ensureConfigured();
}

export async function getCurrentIdToken(): Promise<string | null> {
  try {
    ensureConfigured();
    const { fetchAuthSession } = await import("aws-amplify/auth");
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}
