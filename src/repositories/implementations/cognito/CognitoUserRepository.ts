import type { IUserRepository } from "../../interfaces/IUserRepository";
import type { UserProfile, UserCredentials, SignUpData } from "../../../types/models";
import { ensureAuth } from "../../../lib/cognito";

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
    ensureAuth();
    const { getCurrentUser, fetchAuthSession, fetchUserAttributes } =
      await import("aws-amplify/auth");

    const user = await getCurrentUser();
    if (!user) throw new Error("No authenticated user");

    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (!idToken) throw new Error("No ID token");

    const attributes = await fetchUserAttributes();
    const payload = decodeJwtPayload(idToken);
    const groups = payload["cognito:groups"] as string[] | undefined;
    const isAdmin = Array.isArray(groups) && groups.includes("Admin");

    return deriveProfile(
      attributes as Record<string, string>,
      attributes.email || user.username,
      isAdmin,
    );
  }

  async signIn(credentials: UserCredentials): Promise<UserProfile> {
    ensureAuth();
    const { signIn } = await import("aws-amplify/auth");

    await signIn({ username: credentials.email, password: credentials.password });
    emit("signedIn");
    return this.getCurrentUser();
  }

  async signUp(data: SignUpData): Promise<void> {
    ensureAuth();
    const { signUp } = await import("aws-amplify/auth");

    await signUp({
      username: data.email,
      password: data.password,
      options: {
        userAttributes: {
          given_name: data.firstName,
          family_name: data.lastName || "User",
          nickname: `@${data.firstName.toLowerCase()}${data.lastName ? "_" + data.lastName.toLowerCase() : ""}`,
        },
      },
    });
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    ensureAuth();
    const { confirmSignUp } = await import("aws-amplify/auth");
    await confirmSignUp({ username: email, confirmationCode: code });
  }

  async resendSignUpCode(email: string): Promise<void> {
    ensureAuth();
    const { resendSignUpCode } = await import("aws-amplify/auth");
    await resendSignUpCode({ username: email });
  }

  async signOut(): Promise<void> {
    ensureAuth();
    const { signOut } = await import("aws-amplify/auth");
    await signOut();
    emit("signedOut");
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    ensureAuth();
    const { updateUserAttributes } = await import("aws-amplify/auth");

    const updates: Record<string, string> = {};
    if (profile.firstName !== undefined) updates.given_name = profile.firstName;
    if (profile.lastName !== undefined) updates.family_name = profile.lastName;
    if (profile.nickname !== undefined) updates.nickname = profile.nickname;
    if (profile.avatar !== undefined && !profile.avatar.startsWith("data:"))
      updates.picture = profile.avatar;

    if (Object.keys(updates).length === 0) return;
    await updateUserAttributes({ userAttributes: updates });
  }

  onAuthEvent(callback: (event: string) => void): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }
}
