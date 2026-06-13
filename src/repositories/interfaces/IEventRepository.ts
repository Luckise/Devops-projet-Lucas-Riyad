import type { Event } from "../../types/models";

export interface IEventRepository {
  getAll(): Promise<Event[]>;
  getById(id: string): Promise<Event | undefined>;
  create(event: Omit<Event, "id">): Promise<Event>;
  update(id: string, updates: Partial<Event>): Promise<void>;
  delete(id: string): Promise<void>;
  getSavedEventIds(): Promise<string[]>;
  isSaved(eventId: string): Promise<boolean>;
  toggleSaved(eventId: string): Promise<boolean>;
  getPurchasedEventIds(): Promise<string[]>;
  getMyEventIds(email: string): Promise<string[]>;
  hide(id: string): Promise<void>;
  unhide(id: string): Promise<void>;
}
