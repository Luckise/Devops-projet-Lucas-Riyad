import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import type { IUserRepository } from "../../interfaces/IUserRepository";
import type { UserProfile, UserCredentials, SignUpData } from "../../../types/models";
import { getUserPool } from "../../../lib/cognito";

type AuthListener = (event: string) => void;
const listeners = new Set<AuthListener>();

function emit(event: string) {
  listeners.forEach((cb) => cb(event));
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}

function getCognitoUser(email?: string): CognitoUser {
  if (email) {
    return new CognitoUser({ Username: email, Pool: getUserPool() });
  }
  const current = getUserPool().getCurrentUser();
  if (!current) throw new Error("No authenticated user");
  return current;
}

function deriveProfile(
  attrs: Record<string, string>,
  email: string,
  isAdmin: boolean,
): UserProfile {
  return {
    firstName: attrs.given_name || "",
    lastName: attrs.family_name || "",
    nickname: attrs.nickname || "",
    email,
    avatar: attrs.picture || "",
    isAdmin,
  };
}

export class CognitoUserRepository implements IUserRepository {
  async getCurrentUser(): Promise<UserProfile> {
    const cognitoUser = getCognitoUser();

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err: Error | null, session: any) => {
        if (err || !session?.isValid()) {
          reject(err || new Error("Invalid session"));
          return;
        }

        cognitoUser.getUserAttributes((attrErr, attributes) => {
          if (attrErr || !attributes) {
            reject(attrErr || new Error("Cannot fetch attributes"));
            return;
          }

          const attrs: Record<string, string> = {};
          attributes.forEach((a) => {
            attrs[a.getName()] = a.getValue();
          });

          const idToken = session.getIdToken().getJwtToken();
          const payload = decodeJwtPayload(idToken);
          const groups = payload["cognito:groups"] as string[] | undefined;
          const isAdmin = Array.isArray(groups) && groups.includes("Admin");

          const email = attrs.email || cognitoUser.getUsername();
          resolve(deriveProfile(attrs, email, isAdmin));
        });
      });
    });
  }

  async signIn(credentials: UserCredentials): Promise<UserProfile> {
    const authDetails = new AuthenticationDetails({
      Username: credentials.email,
      Password: credentials.password,
    });
    const cognitoUser = getCognitoUser(credentials.email);

    await new Promise<void>((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: () => resolve(),
        onFailure: (err) => reject(err),
      });
    });

    emit("signedIn");
    return this.getCurrentUser();
  }

  async signUp(data: SignUpData): Promise<void> {
    const nickname = `@${data.firstName.toLowerCase()}${data.lastName ? "_" + data.lastName.toLowerCase() : ""}`;
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: data.email }),
      new CognitoUserAttribute({
        Name: "given_name",
        Value: data.firstName,
      }),
      new CognitoUserAttribute({
        Name: "family_name",
        Value: data.lastName || "User",
      }),
      new CognitoUserAttribute({ Name: "nickname", Value: nickname }),
    ];

    await new Promise<void>((resolve, reject) => {
      getUserPool().signUp(data.email, data.password, attributeList, [], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    const cognitoUser = getCognitoUser(email);
    await new Promise<void>((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async resendSignUpCode(email: string): Promise<void> {
    const cognitoUser = getCognitoUser(email);
    await new Promise<void>((resolve, reject) => {
      cognitoUser.resendConfirmationCode((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async signOut(): Promise<void> {
    const cognitoUser = getUserPool().getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    emit("signedOut");
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    const cognitoUser = getCognitoUser();

    await new Promise<void>((resolve, reject) => {
      cognitoUser.getSession((err: Error | null) => {
        if (err) {
          reject(err);
          return;
        }

        const updates: CognitoUserAttribute[] = [];
        if (profile.firstName !== undefined) {
          updates.push(
            new CognitoUserAttribute({
              Name: "given_name",
              Value: profile.firstName,
            }),
          );
        }
        if (profile.lastName !== undefined) {
          updates.push(
            new CognitoUserAttribute({
              Name: "family_name",
              Value: profile.lastName,
            }),
          );
        }
        if (profile.nickname !== undefined) {
          updates.push(
            new CognitoUserAttribute({
              Name: "nickname",
              Value: profile.nickname,
            }),
          );
        }
        if (profile.avatar !== undefined && !profile.avatar.startsWith("data:")) {
          updates.push(
            new CognitoUserAttribute({
              Name: "picture",
              Value: profile.avatar,
            }),
          );
        }

        if (updates.length === 0) {
          resolve();
          return;
        }

        cognitoUser.updateAttributes(updates, (updateErr) => {
          if (updateErr) reject(updateErr);
          else resolve();
        });
      });
    });
  }

  onAuthEvent(callback: (event: string) => void): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }
}
