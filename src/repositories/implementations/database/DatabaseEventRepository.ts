import { eq } from "drizzle-orm";
import { getDb } from "../../../db/index.ts";
import { events } from "../../../db/schema.ts";
import type { IEventRepository } from "../../interfaces/IEventRepository";
import type { Event } from "../../../types/models";

function rowToEvent(row: typeof events.$inferSelect): Event {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time,
    location: row.location,
    price: Number(row.price),
    joined: Number(row.joined),
    maxParticipants: Number(row.maxParticipants),
    isPast: row.isPast,
    hidden: row.hidden,
    attendees: (row.attendees as string[]) ?? [],
    image: row.image,
    tags: (row.tags as string[]) ?? [],
    groupId: row.groupId ?? "",
    description: row.description,
  };
}

export class DatabaseEventRepository implements IEventRepository {
  async getAll(): Promise<Event[]> {
    const rows = await getDb().select().from(events);
    return rows.map(rowToEvent);
  }

  async getById(id: string): Promise<Event | undefined> {
    const [row] = await getDb().select().from(events).where(eq(events.id, id));
    return row ? rowToEvent(row) : undefined;
  }

  async create(event: Omit<Event, "id">): Promise<Event> {
    const [row] = await getDb()
      .insert(events)
      .values({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        price: String(event.price),
        joined: String(event.joined),
        maxParticipants: String(event.maxParticipants),
        isPast: event.isPast,
        hidden: event.hidden ?? false,
        attendees: event.attendees,
        image: event.image,
        tags: event.tags,
        groupId: event.groupId,
        description: event.description,
      })
      .returning();
    return rowToEvent(row);
  }

  async update(id: string, updates: Partial<Event>): Promise<void> {
    const values: Record<string, unknown> = {};
    if (updates.title !== undefined) values.title = updates.title;
    if (updates.date !== undefined) values.date = updates.date;
    if (updates.time !== undefined) values.time = updates.time;
    if (updates.location !== undefined) values.location = updates.location;
    if (updates.price !== undefined) values.price = String(updates.price);
    if (updates.joined !== undefined) values.joined = String(updates.joined);
    if (updates.maxParticipants !== undefined)
      values.maxParticipants = String(updates.maxParticipants);
    if (updates.isPast !== undefined) values.isPast = updates.isPast;
    if (updates.hidden !== undefined) values.hidden = updates.hidden;
    if (updates.attendees !== undefined) values.attendees = updates.attendees;
    if (updates.image !== undefined) values.image = updates.image;
    if (updates.tags !== undefined) values.tags = updates.tags;
    if (updates.groupId !== undefined) values.groupId = updates.groupId;
    if (updates.description !== undefined) values.description = updates.description;
    if (Object.keys(values).length > 0) {
      await getDb().update(events).set(values).where(eq(events.id, id));
    }
  }

  async delete(id: string): Promise<void> {
    await getDb().delete(events).where(eq(events.id, id));
  }

  async getSavedEventIds(email: string): Promise<string[]> {
    if (!email) return [];
    const rows = await getDb().select().from(events);
    return rows
      .filter((row) => {
        const attendees = (row.attendees as string[]) ?? [];
        return attendees.includes(email);
      })
      .map((row) => row.id);
  }

  async isSaved(eventId: string, email: string): Promise<boolean> {
    if (!email) return false;
    const [row] = await getDb().select().from(events).where(eq(events.id, eventId));
    if (!row) return false;
    const attendees = (row.attendees as string[]) ?? [];
    return attendees.includes(email);
  }

  async toggleSaved(eventId: string, email: string): Promise<boolean> {
    if (!email) return false;
    const [row] = await getDb().select().from(events).where(eq(events.id, eventId));
    if (!row) return false;
    const attendees = (row.attendees as string[]) ?? [];
    const isFollowed = attendees.includes(email);
    const next = isFollowed ? attendees.filter((e) => e !== email) : [...attendees, email];
    await getDb().update(events).set({ attendees: next }).where(eq(events.id, eventId));
    return !isFollowed;
  }

  async getPurchasedEventIds(): Promise<string[]> {
    return [];
  }

  async getMyEventIds(email: string): Promise<string[]> {
    if (!email) return [];
    const rows = await getDb().select().from(events);
    return rows
      .filter((row) => {
        const attendees = (row.attendees as string[]) ?? [];
        return attendees.includes(email);
      })
      .map((row) => row.id);
  }

  async hide(id: string): Promise<void> {
    await this.update(id, { hidden: true });
  }

  async unhide(id: string): Promise<void> {
    await this.update(id, { hidden: false });
  }
}
