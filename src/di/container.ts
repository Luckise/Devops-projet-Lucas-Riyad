import type { IEventRepository } from "../repositories/interfaces/IEventRepository";
import type { IGroupRepository } from "../repositories/interfaces/IGroupRepository";
import type { ITipRepository } from "../repositories/interfaces/ITipRepository";
import type { IPostRepository } from "../repositories/interfaces/IPostRepository";
import type { ITicketRepository } from "../repositories/interfaces/ITicketRepository";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import type { IImageRepository } from "../repositories/interfaces/IImageRepository";

import { LocalStorageEventRepository } from "../repositories/implementations/local-storage/LocalStorageEventRepository";
import { LocalStorageGroupRepository } from "../repositories/implementations/local-storage/LocalStorageGroupRepository";
import { LocalStorageTipRepository } from "../repositories/implementations/local-storage/LocalStorageTipRepository";
import { LocalStoragePostRepository } from "../repositories/implementations/local-storage/LocalStoragePostRepository";
import { LocalStorageTicketRepository } from "../repositories/implementations/local-storage/LocalStorageTicketRepository";
import { CognitoUserRepository } from "../repositories/implementations/cognito/CognitoUserRepository";
import { S3ImageRepository } from "../repositories/implementations/s3/S3ImageRepository";

import { EventService } from "../services/implementations/EventService";
import { GroupService } from "../services/implementations/GroupService";
import { AuthService } from "../services/implementations/AuthService";
import { ImageService } from "../services/implementations/ImageService";
import { TipService } from "../services/implementations/TipService";
import { PostService } from "../services/implementations/PostService";
import { TicketService } from "../services/implementations/TicketService";

import type {
  IEventService, IGroupService, IAuthService,
  IImageService, ITipService, IPostService, ITicketService,
} from "../services/interfaces";

function hasAwsCredentials(): boolean {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return !!(
      import.meta.env.VITE_COGNITO_USER_POOL_ID ||
      import.meta.env.VITE_AWS_ACCESS_KEY_ID
    );
  }
  return false;
}

function createEventRepo(): IEventRepository {
  return new LocalStorageEventRepository();
}

function createGroupRepo(): IGroupRepository {
  return new LocalStorageGroupRepository();
}

function createTipRepo(): ITipRepository {
  return new LocalStorageTipRepository();
}

function createPostRepo(): IPostRepository {
  return new LocalStoragePostRepository();
}

function createTicketRepo(): ITicketRepository {
  return new LocalStorageTicketRepository();
}

function createUserRepo(): IUserRepository {
  if (hasAwsCredentials()) {
    return new CognitoUserRepository();
  }
  return {
    getCurrentUser: async () => {
      if (typeof window === "undefined") {
        return { firstName: "", lastName: "", nickname: "", email: "", avatar: "", isAdmin: false };
      }
      const saved = localStorage.getItem("eat_user_profile");
      if (saved) return JSON.parse(saved);
      const { defaultUser } = await import("../lib/user-defaults");
      return defaultUser;
    },
    signIn: async (credentials) => {
      const profile = {
        firstName: "", lastName: "", nickname: "", email: credentials.email, avatar: "", isAdmin: false,
      };
      localStorage.setItem("eat_user_profile", JSON.stringify(profile));
      window.dispatchEvent(new Event("user-updated"));
      return profile;
    },
    signUp: async () => {},
    confirmSignUp: async () => {},
    resendSignUpCode: async () => {},
    signOut: async () => {
      localStorage.removeItem("eat_user_profile");
      window.dispatchEvent(new Event("user-updated"));
    },
    updateProfile: async (profile) => {
      const current = localStorage.getItem("eat_user_profile");
      if (current) {
        const merged = { ...JSON.parse(current), ...profile };
        localStorage.setItem("eat_user_profile", JSON.stringify(merged));
      }
    },
  } as IUserRepository;
}

function createImageRepo(): IImageRepository {
  if (hasAwsCredentials()) {
    return new S3ImageRepository();
  }
  return {
    upload: async (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    },
    delete: async () => {},
  } as IImageRepository;
}

interface Services {
  eventService: IEventService;
  groupService: IGroupService;
  tipService: ITipService;
  postService: IPostService;
  ticketService: ITicketService;
  authService: IAuthService;
  imageService: IImageService;
}

let instance: Services | null = null;

export function getServices(): Services {
  if (instance) return instance;

  const eventRepo = createEventRepo();
  const groupRepo = createGroupRepo();
  const tipRepo = createTipRepo();
  const postRepo = createPostRepo();
  const ticketRepo = createTicketRepo();
  const userRepo = createUserRepo();
  const imageRepo = createImageRepo();

  instance = {
    eventService: new EventService(eventRepo),
    groupService: new GroupService(groupRepo),
    tipService: new TipService(tipRepo),
    postService: new PostService(postRepo),
    ticketService: new TicketService(ticketRepo),
    authService: new AuthService(userRepo),
    imageService: new ImageService(imageRepo),
  };

  return instance;
}
