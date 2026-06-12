import {
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signOut,
  updateUserAttribute,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import type { IUserRepository } from "../../interfaces/IUserRepository";
import type { UserProfile, UserCredentials, SignUpData } from "../../../types/models";
import "../../../lib/amplify";

async function getUserIsAdmin(): Promise<boolean> {
  try {
    const session = await fetchAuthSession();
    const groups = session.tokens?.idToken?.payload?.["cognito:groups"] as string[] | undefined;
    return Array.isArray(groups) && groups.includes("Admin");
  } catch {
    return false;
  }
}

function deriveProfile(
  attrs: Record<string, string | undefined>,
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
    const user = await getCurrentUser();
    const attrs = await fetchUserAttributes();
    const email = attrs.email || user.userId;
    const isAdmin = await getUserIsAdmin();
    return deriveProfile(attrs, email, isAdmin);
  }

  async signIn(credentials: UserCredentials): Promise<UserProfile> {
    await signIn({ username: credentials.email, password: credentials.password });
    return this.getCurrentUser();
  }

  async signUp(data: SignUpData): Promise<void> {
    await signUp({
      username: data.email,
      password: data.password,
      options: {
        userAttributes: {
          email: data.email,
          given_name: data.firstName,
          family_name: data.lastName || "User",
          nickname: `@${data.firstName.toLowerCase()}${data.lastName ? "_" + data.lastName.toLowerCase() : ""}`,
        },
      },
    });
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    await confirmSignUp({ username: email, confirmationCode: code });
  }

  async resendSignUpCode(email: string): Promise<void> {
    await resendSignUpCode({ username: email });
  }

  async signOut(): Promise<void> {
    await signOut();
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    const updates: { attributeKey: string; value: string }[] = [];
    if (profile.firstName !== undefined) {
      updates.push({ attributeKey: "given_name", value: profile.firstName });
    }
    if (profile.lastName !== undefined) {
      updates.push({ attributeKey: "family_name", value: profile.lastName });
    }
    if (profile.nickname !== undefined) {
      updates.push({ attributeKey: "nickname", value: profile.nickname });
    }
    if (profile.avatar !== undefined && !profile.avatar.startsWith("data:")) {
      updates.push({ attributeKey: "picture", value: profile.avatar });
    }
    if (updates.length > 0) {
      await Promise.all(updates.map((u) => updateUserAttribute({ userAttribute: u })));
    }
  }

  onAuthEvent(callback: (event: string) => void): () => void {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn" || payload.event === "signedOut") {
        callback(payload.event);
      }
    });
    return unsubscribe;
  }
}
