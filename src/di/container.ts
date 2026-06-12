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

import { EventService } from "../services/implementations/EventService";
import { GroupService } from "../services/implementations/GroupService";
import { AuthService } from "../services/implementations/AuthService";
import { ImageService } from "../services/implementations/ImageService";
import { TipService } from "../services/implementations/TipService";
import { PostService } from "../services/implementations/PostService";
import { TicketService } from "../services/implementations/TicketService";

import type {
  IEventService,
  IGroupService,
  IAuthService,
  IImageService,
  ITipService,
  IPostService,
  ITicketService,
} from "../services/interfaces";

function hasS3Credentials(): boolean {
  if (typeof process !== "undefined" && process.env?.AWS_ACCESS_KEY_ID) {
    return true;
  }
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return !!import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  }
  return false;
}

function hasDatabaseUrl(): boolean {
  if (typeof process !== "undefined" && process.env?.DATABASE_URL) {
    return true;
  }
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return !!import.meta.env.VITE_DATABASE_URL;
  }
  return false;
}

let _dbEventRepo: IEventRepository | null = null;
let _dbGroupRepo: IGroupRepository | null = null;
let _dbTipRepo: ITipRepository | null = null;
let _dbPostRepo: IPostRepository | null = null;
let _dbTicketRepo: ITicketRepository | null = null;
let _s3ImageRepo: IImageRepository | null = null;

async function createEventRepo(): Promise<IEventRepository> {
  if (hasDatabaseUrl()) {
    if (!_dbEventRepo) {
      const { DatabaseEventRepository } =
        await import("../repositories/implementations/database/DatabaseEventRepository");
      _dbEventRepo = new DatabaseEventRepository();
    }
    return _dbEventRepo;
  }
  return new LocalStorageEventRepository();
}

async function createGroupRepo(): Promise<IGroupRepository> {
  if (hasDatabaseUrl()) {
    if (!_dbGroupRepo) {
      const { DatabaseGroupRepository } =
        await import("../repositories/implementations/database/DatabaseGroupRepository");
      _dbGroupRepo = new DatabaseGroupRepository();
    }
    return _dbGroupRepo;
  }
  return new LocalStorageGroupRepository();
}

async function createTipRepo(): Promise<ITipRepository> {
  if (hasDatabaseUrl()) {
    if (!_dbTipRepo) {
      const { DatabaseTipRepository } =
        await import("../repositories/implementations/database/DatabaseTipRepository");
      _dbTipRepo = new DatabaseTipRepository();
    }
    return _dbTipRepo;
  }
  return new LocalStorageTipRepository();
}

async function createPostRepo(): Promise<IPostRepository> {
  if (hasDatabaseUrl()) {
    if (!_dbPostRepo) {
      const { DatabasePostRepository } =
        await import("../repositories/implementations/database/DatabasePostRepository");
      _dbPostRepo = new DatabasePostRepository();
    }
    return _dbPostRepo;
  }
  return new LocalStoragePostRepository();
}

async function createTicketRepo(): Promise<ITicketRepository> {
  if (hasDatabaseUrl()) {
    if (!_dbTicketRepo) {
      const { DatabaseTicketRepository } =
        await import("../repositories/implementations/database/DatabaseTicketRepository");
      _dbTicketRepo = new DatabaseTicketRepository();
    }
    return _dbTicketRepo;
  }
  return new LocalStorageTicketRepository();
}

function createUserRepo(): IUserRepository {
  return new CognitoUserRepository();
}

async function createImageRepo(): Promise<IImageRepository> {
  if (hasS3Credentials()) {
    if (!_s3ImageRepo) {
      const { S3ImageRepository } =
        await import("../repositories/implementations/s3/S3ImageRepository");
      _s3ImageRepo = new S3ImageRepository();
    }
    return _s3ImageRepo;
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

export async function getServices(): Promise<Services> {
  if (instance) return instance;

  const [eventRepo, groupRepo, tipRepo, postRepo, ticketRepo, imageRepo] = await Promise.all([
    createEventRepo(),
    createGroupRepo(),
    createTipRepo(),
    createPostRepo(),
    createTicketRepo(),
    createImageRepo(),
  ]);
  const userRepo = createUserRepo();

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
