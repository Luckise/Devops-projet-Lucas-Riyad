import type { Event } from "../../types/models";

export interface IEventService {
  getAll(): Promise<Event[]>;
  getById(id: string): Promise<Event | undefined>;
  create(data: Omit<Event, "id">): Promise<Event>;
  update(id: string, updates: Partial<Event>): Promise<void>;
  delete(id: string): Promise<void>;
  getSavedEventIds(email: string): Promise<string[]>;
  isSaved(eventId: string, email: string): Promise<boolean>;
  toggleSaved(eventId: string, email: string): Promise<boolean>;
  getMyEventIds(email: string): Promise<string[]>;
  hide(id: string): Promise<void>;
  unhide(id: string): Promise<void>;
  findEvent(id: string): Promise<Event | undefined>;
}

export type { IEventService as default };
