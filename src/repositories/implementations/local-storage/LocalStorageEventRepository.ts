import type { IEventRepository } from "../../interfaces/IEventRepository";
import type { Event } from "../../../types/models";

export class LocalStorageEventRepository implements IEventRepository {
  private readonly eventsKey = "user_events";
  private readonly savedKey = "saved_events";
  private readonly ticketsKey = "purchased_tickets";

  async getAll(): Promise<Event[]> {
    return this.getItems<Event>(this.eventsKey);
  }

  async getById(id: string): Promise<Event | undefined> {
    const all = await this.getAll();
    return all.find((e) => e.id === id);
  }

  async create(event: Omit<Event, "id">): Promise<Event> {
    const id = `e${Date.now()}`;
    const newEvent: Event = { ...event, id };
    this.saveItem(this.eventsKey, newEvent);
    return newEvent;
  }

  async update(id: string, updates: Partial<Event>): Promise<void> {
    const items = this.getItems<Event>(this.eventsKey);
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
      this.setItems(this.eventsKey, items);
    }
  }

  async delete(id: string): Promise<void> {
    const items = this.getItems<Event>(this.eventsKey);
    this.setItems(
      this.eventsKey,
      items.filter((i) => i.id !== id),
    );
  }

  async getSavedEventIds(): Promise<string[]> {
    return this.getItems<string>(this.savedKey);
  }

  async isSaved(eventId: string): Promise<boolean> {
    const saved = await this.getSavedEventIds();
    return saved.includes(eventId);
  }

  async toggleSaved(eventId: string): Promise<boolean> {
    const saved = await this.getSavedEventIds();
    const idx = saved.indexOf(eventId);
    if (idx === -1) {
      saved.unshift(eventId);
      this.setItems(this.savedKey, saved);
      return true;
    }
    saved.splice(idx, 1);
    this.setItems(this.savedKey, saved);
    return false;
  }

  async getPurchasedEventIds(): Promise<string[]> {
    const stored = this.getItems<{ eventId: string }>(this.ticketsKey);
    return [...new Set(stored.map((t) => t.eventId))];
  }

  async getMyEventIds(): Promise<string[]> {
    const saved = await this.getSavedEventIds();
    const purchased = await this.getPurchasedEventIds();
    return [...new Set([...saved, ...purchased])];
  }

  async hide(id: string): Promise<void> {
    await this.update(id, { hidden: true } as Partial<Event>);
  }

  async unhide(id: string): Promise<void> {
    await this.update(id, { hidden: false } as Partial<Event>);
  }

  private getItems<T>(key: string): T[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  private setItems(key: string, items: unknown[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  private saveItem<T>(key: string, item: T): void {
    const existing = this.getItems<T>(key);
    existing.unshift(item);
    this.setItems(key, existing);
  }
}
