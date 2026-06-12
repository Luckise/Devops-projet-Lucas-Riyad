import { Buffer } from "buffer";
if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer;
}

import { CognitoUserPool } from "amazon-cognito-identity-js";

const userPoolId =
  import.meta.env.VITE_COGNITO_USER_POOL_ID ||
  (typeof process !== "undefined" && process.env?.COGNITO_USER_POOL_ID);
const clientId =
  import.meta.env.VITE_COGNITO_CLIENT_ID ||
  (typeof process !== "undefined" && process.env?.COGNITO_CLIENT_ID);

if (!userPoolId || !clientId) {
  throw new Error(
    "Cognito is not configured. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID " +
      "environment variables.",
  );
}

export const userPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
});

export function getCurrentIdToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      resolve(null);
      return;
    }
    cognitoUser.getSession((err: Error | null, session: any) => {
      if (err || !session?.isValid()) {
        resolve(null);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}
