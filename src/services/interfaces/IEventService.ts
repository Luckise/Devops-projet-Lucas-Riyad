import type { Event } from "../../types/models";

export interface IEventService {
  getAll(): Promise<Event[]>;
  getById(id: string): Promise<Event | undefined>;
  create(data: Omit<Event, "id">): Promise<Event>;
  update(id: string, updates: Partial<Event>): Promise<void>;
  delete(id: string): Promise<void>;
  getSavedEventIds(): Promise<string[]>;
  isSaved(eventId: string): Promise<boolean>;
  toggleSaved(eventId: string): Promise<boolean>;
  getMyEventIds(): Promise<string[]>;
  hide(id: string): Promise<void>;
  unhide(id: string): Promise<void>;
  findEvent(id: string): Promise<Event | undefined>;
}

export type { IEventService as default };
