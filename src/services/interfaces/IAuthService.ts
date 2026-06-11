import type { UserProfile, UserCredentials, SignUpData } from "../../types/models";

export interface IAuthService {
  getCurrentUser(): Promise<UserProfile>;
  signIn(credentials: UserCredentials): Promise<UserProfile>;
  signUp(data: SignUpData): Promise<void>;
  confirmSignUp(email: string, code: string): Promise<void>;
  resendSignUpCode(email: string): Promise<void>;
  signOut(): Promise<void>;
  updateProfile(profile: Partial<UserProfile>): Promise<void>;
}
