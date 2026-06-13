import type { IEventRepository } from "../repositories/interfaces/IEventRepository";
import type { IGroupRepository } from "../repositories/interfaces/IGroupRepository";
import type { ITipRepository } from "../repositories/interfaces/ITipRepository";
import type { IPostRepository } from "../repositories/interfaces/IPostRepository";
import type { ITicketRepository } from "../repositories/interfaces/ITicketRepository";
import type { IImageRepository } from "../repositories/interfaces/IImageRepository";

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

import type { Event, Tip, Post, Ticket, Group, ContentBlock } from "../types/models";

import { createIsomorphicFn } from "@tanstack/react-start";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type router from "#/orpc/router";

function createClientServices(): Services {
  const link = new RPCLink({
    url: `${window.location.origin}/api/rpc`,
  });
  const rpc = createORPCClient(link) as RouterClient<typeof router>;

  const eventService: IEventService = {
    getAll: () => rpc.events.listEvents() as Promise<Event[]>,
    getById: (id: string) => rpc.events.getEvent({ id }) as Promise<Event | undefined>,
    findEvent: (id: string) => rpc.events.getEvent({ id }) as Promise<Event | undefined>,
    create: (data: Omit<Event, "id">) => rpc.events.createEvent(data as any) as Promise<Event>,
    update: (id: string, updates: Partial<Event>) =>
      rpc.events.updateEvent({ id, updates: updates as any }) as Promise<void>,
    delete: (id: string) => rpc.events.deleteEvent({ id }) as Promise<void>,
    getSavedEventIds: () => rpc.events.getSavedEventIds() as Promise<string[]>,
    isSaved: (eventId: string) => rpc.events.isSaved({ eventId }) as Promise<boolean>,
    toggleSaved: (eventId: string) => rpc.events.toggleSaved({ eventId }) as Promise<boolean>,
    getMyEventIds: () => rpc.events.getMyEventIds() as Promise<string[]>,
    hide: (id: string) => rpc.events.hideEvent({ id }) as Promise<void>,
    unhide: (id: string) => rpc.events.unhideEvent({ id }) as Promise<void>,
  };

  const tipService: ITipService = {
    getAll: () => rpc.tips.listTips() as Promise<Tip[]>,
    getById: (id: string) => rpc.tips.getTip({ id }) as Promise<Tip | undefined>,
    create: (data: Omit<Tip, "id">) => rpc.tips.createTip(data as any) as Promise<Tip>,
    update: (id: string, updates: Partial<Tip>) =>
      rpc.tips.updateTip({ id, updates: updates as any }) as Promise<void>,
    delete: (id: string) => rpc.tips.deleteTip({ id }) as Promise<void>,
    hide: (id: string) => rpc.tips.hideTip({ id }) as Promise<void>,
    unhide: (id: string) => rpc.tips.unhideTip({ id }) as Promise<void>,
  };

  const postService: IPostService = {
    getAll: () => rpc.posts.listPosts() as Promise<Post[]>,
    getById: (id: string) => rpc.posts.getPost({ id }) as Promise<Post | undefined>,
    create: (data: Omit<Post, "id">) => rpc.posts.createPost(data as any) as Promise<Post>,
    update: (id: string, updates: Partial<Post>) =>
      rpc.posts.updatePost({ id, updates: updates as any }) as Promise<void>,
    delete: (id: string) => rpc.posts.deletePost({ id }) as Promise<void>,
  };

  const ticketService: ITicketService = {
    getAll: () => rpc.tickets.listTickets() as Promise<Ticket[]>,
    getById: (id: string) => rpc.tickets.getTicket({ id }) as Promise<Ticket | undefined>,
    create: (event: any, profile: any) =>
      rpc.tickets.createTicket({
        eventId: event.id,
        qrDataUrl: `data:image/png;base64,${btoa(JSON.stringify({ eventId: event.id, email: profile.email, ts: Date.now() }))}`,
        type: "standard",
        purchaseDate: new Date().toISOString(),
        event: {
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          image: event.image,
        },
      }) as Promise<Ticket>,
  };

  const groupService: IGroupService = {
    getAll: async () => {
      const rows = (await rpc.groups.listGroups()) as Group[];
      const map: Record<string, Group> = {};
      for (const g of rows) map[g.id] = g;
      return map;
    },
    getAllClubs: () => rpc.groups.listGroups() as Promise<Group[]>,
    getById: (id: string) => rpc.groups.getGroup({ id }) as Promise<Group | undefined>,
    getUserGroups: (email: string) => rpc.groups.getUserGroups({ email }) as Promise<Group[]>,
    create: (name: string, ownerEmail: string) =>
      rpc.groups.createGroup({ name, ownerEmail }) as Promise<Group>,
    addMember: (groupId: string, memberEmail: string) =>
      rpc.groups.addMember({ groupId, memberEmail }) as Promise<boolean>,
    removeMember: (groupId: string, memberEmail: string) =>
      rpc.groups.removeMember({ groupId, memberEmail }) as Promise<boolean>,
    rename: (groupId: string, newName: string) =>
      rpc.groups.renameGroup({ groupId, newName }) as Promise<boolean>,
    transferOwnership: (groupId: string, newOwnerEmail: string) =>
      rpc.groups.transferOwnership({ groupId, newOwnerEmail }) as Promise<boolean>,
    savePage: (groupId: string, image: string, content: ContentBlock[] | undefined) =>
      rpc.groups.saveGroupPage({ groupId, image, content }) as Promise<boolean>,
    isUserAdmin: async () => false,
    userRole: (group: Group, email: string) => {
      if (group.owner === email) return "Owner";
      if (group.members.includes(email)) return "Member";
      return null;
    },
  };

  const imageService: IImageService = {
    upload: async (file: File) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    },
    delete: async () => {},
  };

  const userRepo = new CognitoUserRepository();
  const authService: IAuthService = new AuthService(userRepo);

  return {
    eventService,
    groupService,
    tipService,
    postService,
    ticketService,
    authService,
    imageService,
  };
}

async function createServerServices(): Promise<Services> {
  const { DatabaseEventRepository } =
    await import("../repositories/implementations/database/DatabaseEventRepository");
  const { DatabaseGroupRepository } =
    await import("../repositories/implementations/database/DatabaseGroupRepository");
  const { DatabaseTipRepository } =
    await import("../repositories/implementations/database/DatabaseTipRepository");
  const { DatabasePostRepository } =
    await import("../repositories/implementations/database/DatabasePostRepository");
  const { DatabaseTicketRepository } =
    await import("../repositories/implementations/database/DatabaseTicketRepository");
  const { S3ImageRepository } =
    await import("../repositories/implementations/s3/S3ImageRepository");

  const eventRepo: IEventRepository = new DatabaseEventRepository();
  const groupRepo: IGroupRepository = new DatabaseGroupRepository();
  const tipRepo: ITipRepository = new DatabaseTipRepository();
  const postRepo: IPostRepository = new DatabasePostRepository();
  const ticketRepo: ITicketRepository = new DatabaseTicketRepository();
  const imageRepo: IImageRepository = new S3ImageRepository();
  const userRepo = new CognitoUserRepository();

  return {
    eventService: new EventService(eventRepo),
    groupService: new GroupService(groupRepo),
    tipService: new TipService(tipRepo),
    postService: new PostService(postRepo),
    ticketService: new TicketService(ticketRepo),
    authService: new AuthService(userRepo),
    imageService: new ImageService(imageRepo),
  };
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

const getServicesFn = createIsomorphicFn()
  .server(() => {
    return async (): Promise<Services> => {
      if (instance) return instance;
      instance = await createServerServices();
      return instance;
    };
  })
  .client(() => {
    return async (): Promise<Services> => {
      if (instance) return instance;
      instance = createClientServices();
      return instance;
    };
  });

export async function getServices(): Promise<Services> {
  const getter = getServicesFn();
  return getter();
}
