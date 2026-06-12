import type { IAuthService } from "../interfaces/IAuthService";
import type { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import type { UserProfile, UserCredentials, SignUpData } from "../../types/models";

export class AuthService implements IAuthService {
  constructor(private readonly repo: IUserRepository) {}

  async getCurrentUser(): Promise<UserProfile> {
    return this.repo.getCurrentUser();
  }

  async signIn(credentials: UserCredentials): Promise<UserProfile> {
    return this.repo.signIn(credentials);
  }

  async signUp(data: SignUpData): Promise<void> {
    return this.repo.signUp(data);
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    return this.repo.confirmSignUp(email, code);
  }

  async resendSignUpCode(email: string): Promise<void> {
    return this.repo.resendSignUpCode(email);
  }

  async signOut(): Promise<void> {
    return this.repo.signOut();
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    return this.repo.updateProfile(profile);
  }
}
