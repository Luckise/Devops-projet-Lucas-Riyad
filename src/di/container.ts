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

function hasS3Credentials(): boolean {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return !!import.meta.env.VITE_AWS_ACCESS_KEY_ID;
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
  return new CognitoUserRepository();
}

function createImageRepo(): IImageRepository {
  if (hasS3Credentials()) {
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
