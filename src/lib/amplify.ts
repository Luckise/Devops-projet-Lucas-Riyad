import { Amplify } from "aws-amplify";

const userPoolId =
  import.meta.env.VITE_COGNITO_USER_POOL_ID ||
  (typeof process !== "undefined" && process.env?.COGNITO_USER_POOL_ID);
const userPoolClientId =
  import.meta.env.VITE_COGNITO_CLIENT_ID ||
  (typeof process !== "undefined" && process.env?.COGNITO_CLIENT_ID);

if (!userPoolId || !userPoolClientId) {
  throw new Error(
    "Cognito is not configured. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID " +
      "environment variables. Example: VITE_COGNITO_USER_POOL_ID=eu-west-3_XXXXXXXXX " +
      "VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx",
  );
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
    },
  },
});
