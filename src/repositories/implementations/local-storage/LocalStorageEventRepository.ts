import type { IEventRepository } from "../../interfaces/IEventRepository";
import type { Event } from "../../../types/models";

const MOCK_EVENTS: Event[] = [
  {
    id: "1", title: "Neon Nights: Underground Techno",
    date: "2025-10-28", time: "23:00", location: "Warehouse 42, District 9",
    price: 15, joined: 342, maxParticipants: 500, isPast: true, hidden: false,
    attendees: ["lucas.guillemin@efrei.net", "ryiad.larbaoui@efrei.net"],
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    tags: ["Techno", "Underground"], groupId: "seed_efrei_esports",
    description: "Experience the pulse of the underground. Neon Nights returns to Warehouse 42 for a 12-hour marathon set featuring international and local techno artists.",
  },
  {
    id: "2", title: "Sunrise Yoga & Soundbath",
    date: "2025-10-29", time: "06:30", location: "The Glasshouse",
    price: 25, joined: 45, maxParticipants: 100, isPast: true, hidden: false,
    attendees: [],
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
    tags: ["Wellness", "Morning"], groupId: "seed_hiking",
    description: "Start your morning with intention. Join us as the sun rises over The Glasshouse for a 90-minute vinyasa flow followed by a deeply restorative crystal bowl soundbath.",
  },
  {
    id: "3", title: "Street Food Festival: Autumn Edition",
    date: "2026-11-02", time: "12:00", location: "Central Plaza",
    price: 0, joined: 1250, maxParticipants: 2000, isPast: false, hidden: false,
    attendees: [],
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
    tags: ["Food", "Community"], groupId: "seed_a_table",
    description: "The city's best food trucks converge for our seasonal street food festival.",
  },
  {
    id: "4", title: "Indie Film Showcase",
    date: "2026-11-05", time: "20:00", location: "Lumina Theater",
    price: 12, joined: 112, maxParticipants: 200, isPast: false, hidden: false,
    attendees: [],
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
    tags: ["Cinema", "Art"], groupId: "seed_cine_club",
    description: "A curated evening of independent short films from emerging local directors.",
  },
  {
    id: "5", title: "SOLD OUT: DJ Snake Live",
    date: "2026-11-10", time: "22:00", location: "Megaclub Arena",
    price: 35, joined: 2500, maxParticipants: 2500, isPast: false, hidden: false,
    attendees: [],
    image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d01?q=80&w=800&auto=format&fit=crop",
    tags: ["Concert", "Electronic"], groupId: "seed_efrei_esports",
    description: "The biggest electronic show of the year is completely sold out.",
  },
];

export class LocalStorageEventRepository implements IEventRepository {
  private readonly eventsKey = "user_events";
  private readonly savedKey = "saved_events";
  private readonly ticketsKey = "purchased_tickets";

  async getAll(): Promise<Event[]> {
    const userEvents = this.getItems<Event>(this.eventsKey);
    return [...userEvents, ...MOCK_EVENTS];
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
    const mockIdx = MOCK_EVENTS.findIndex((e) => e.id === id);
    if (mockIdx !== -1) {
      MOCK_EVENTS[mockIdx] = { ...MOCK_EVENTS[mockIdx], ...updates } as Event;
    }
  }

  async delete(id: string): Promise<void> {
    const items = this.getItems<Event>(this.eventsKey);
    this.setItems(this.eventsKey, items.filter((i) => i.id !== id));
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
    const demoIds = ["1", "3"];
    const ids = stored.map((t) => t.eventId);
    return [...new Set([...demoIds, ...ids])];
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
