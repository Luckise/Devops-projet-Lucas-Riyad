import { CognitoUserPool } from "amazon-cognito-identity-js";

function getConfig() {
  const userPoolId =
    import.meta.env.VITE_COGNITO_USER_POOL_ID ||
    (typeof process !== "undefined" && process.env?.COGNITO_USER_POOL_ID);
  const clientId =
    import.meta.env.VITE_COGNITO_CLIENT_ID ||
    (typeof process !== "undefined" && process.env?.COGNITO_CLIENT_ID);
  return { userPoolId, clientId };
}

let _userPool: CognitoUserPool | null = null;

export function getUserPool(): CognitoUserPool {
  if (!_userPool) {
    const { userPoolId, clientId } = getConfig();
    if (!userPoolId || !clientId) {
      throw new Error(
        "Cognito is not configured. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID " +
          "environment variables.",
      );
    }
    _userPool = new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });
  }
  return _userPool;
}

export function getCurrentIdToken(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const cognitoUser = getUserPool().getCurrentUser();
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
    } catch {
      resolve(null);
    }
  });
}
