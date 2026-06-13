import type { IEventService } from "../interfaces/IEventService";
import type { IEventRepository } from "../../repositories/interfaces/IEventRepository";
import type { Event } from "../../types/models";

export class EventService implements IEventService {
  constructor(private readonly repo: IEventRepository) {}

  async getAll(): Promise<Event[]> {
    return this.repo.getAll();
  }

  async getById(id: string): Promise<Event | undefined> {
    return this.repo.getById(id);
  }

  async create(data: Omit<Event, "id">): Promise<Event> {
    return this.repo.create(data);
  }

  async update(id: string, updates: Partial<Event>): Promise<void> {
    return this.repo.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  async getSavedEventIds(): Promise<string[]> {
    return this.repo.getSavedEventIds();
  }

  async isSaved(eventId: string): Promise<boolean> {
    return this.repo.isSaved(eventId);
  }

  async toggleSaved(eventId: string): Promise<boolean> {
    return this.repo.toggleSaved(eventId);
  }

  async getMyEventIds(email: string): Promise<string[]> {
    return this.repo.getMyEventIds(email);
  }

  async hide(id: string): Promise<void> {
    return this.repo.hide(id);
  }

  async unhide(id: string): Promise<void> {
    return this.repo.unhide(id);
  }

  async findEvent(id: string): Promise<Event | undefined> {
    return this.repo.getById(id);
  }
}
