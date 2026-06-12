import { Buffer } from "buffer";
if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer;
}

import { Amplify } from "aws-amplify";

const userPoolId =
  import.meta.env.VITE_COGNITO_USER_POOL_ID ||
  (typeof process !== "undefined" && process.env?.COGNITO_USER_POOL_ID) ||
  "eu-west-3_lVGeXq3XV";
const userPoolClientId =
  import.meta.env.VITE_COGNITO_CLIENT_ID ||
  (typeof process !== "undefined" && process.env?.COGNITO_CLIENT_ID) ||
  "1plgjn41284i5v3gf0nlei58ou";
const region =
  import.meta.env.VITE_AWS_REGION ||
  (typeof process !== "undefined" && process.env?.VITE_AWS_REGION) ||
  "eu-west-3";

if (userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        region,
      },
    },
  });
}
