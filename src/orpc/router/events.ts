import { os } from "@orpc/server";
import * as z from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "#/db/index.ts";
import { events as eventsTable } from "#/db/schema.ts";

const EventInput = z.object({
  title: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  price: z.number(),
  joined: z.number(),
  maxParticipants: z.number(),
  isPast: z.boolean(),
  hidden: z.boolean().optional(),
  attendees: z.array(z.string()),
  image: z.string(),
  tags: z.array(z.string()),
  groupId: z.string(),
  description: z.string(),
});

function rowToEvent(row: typeof eventsTable.$inferSelect) {
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

export const listEvents = os.handler(async () => {
  const rows = await getDb().select().from(eventsTable);
  return rows.map(rowToEvent);
});

export const getEvent = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  const [row] = await getDb().select().from(eventsTable).where(eq(eventsTable.id, input.id));
  return row ? rowToEvent(row) : undefined;
});

export const createEvent = os.input(EventInput).handler(async ({ input }) => {
  const [row] = await getDb()
    .insert(eventsTable)
    .values({
      title: input.title,
      date: input.date,
      time: input.time,
      location: input.location,
      price: String(input.price),
      joined: String(input.joined),
      maxParticipants: String(input.maxParticipants),
      isPast: input.isPast,
      hidden: input.hidden ?? false,
      attendees: input.attendees,
      image: input.image,
      tags: input.tags,
      groupId: input.groupId,
      description: input.description,
    })
    .returning();
  return rowToEvent(row);
});

export const updateEvent = os
  .input(z.object({ id: z.string(), updates: EventInput.partial() }))
  .handler(async ({ input }) => {
    const values: Record<string, unknown> = {};
    const u = input.updates;
    if (u.title !== undefined) values.title = u.title;
    if (u.date !== undefined) values.date = u.date;
    if (u.time !== undefined) values.time = u.time;
    if (u.location !== undefined) values.location = u.location;
    if (u.price !== undefined) values.price = String(u.price);
    if (u.joined !== undefined) values.joined = String(u.joined);
    if (u.maxParticipants !== undefined) values.maxParticipants = String(u.maxParticipants);
    if (u.isPast !== undefined) values.isPast = u.isPast;
    if (u.hidden !== undefined) values.hidden = u.hidden;
    if (u.attendees !== undefined) values.attendees = u.attendees;
    if (u.image !== undefined) values.image = u.image;
    if (u.tags !== undefined) values.tags = u.tags;
    if (u.groupId !== undefined) values.groupId = u.groupId;
    if (u.description !== undefined) values.description = u.description;
    if (Object.keys(values).length > 0) {
      await getDb().update(eventsTable).set(values).where(eq(eventsTable.id, input.id));
    }
  });

export const deleteEvent = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  await getDb().delete(eventsTable).where(eq(eventsTable.id, input.id));
});

export const hideEvent = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  await getDb().update(eventsTable).set({ hidden: true }).where(eq(eventsTable.id, input.id));
});

export const unhideEvent = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  await getDb().update(eventsTable).set({ hidden: false }).where(eq(eventsTable.id, input.id));
});

export const getMyEventIds = os
  .input(z.object({ email: z.string() }))
  .handler(async ({ input }) => {
    if (!input.email) return [];
    const rows = await getDb().select().from(eventsTable);
    return rows
      .filter((row) => {
        const attendees = (row.attendees as string[]) ?? [];
        return attendees.includes(input.email);
      })
      .map((row) => row.id);
  });

export const getSavedEventIds = os
  .input(z.object({ email: z.string() }))
  .handler(async ({ input }) => {
    if (!input.email) return [];
    const rows = await getDb().select().from(eventsTable);
    return rows
      .filter((row) => {
        const attendees = (row.attendees as string[]) ?? [];
        return attendees.includes(input.email);
      })
      .map((row) => row.id);
  });

export const isSaved = os
  .input(z.object({ eventId: z.string(), email: z.string() }))
  .handler(async ({ input }) => {
    if (!input.email) return false;
    const [row] = await getDb().select().from(eventsTable).where(eq(eventsTable.id, input.eventId));
    if (!row) return false;
    const attendees = (row.attendees as string[]) ?? [];
    return attendees.includes(input.email);
  });

export const toggleSaved = os
  .input(z.object({ eventId: z.string(), email: z.string() }))
  .handler(async ({ input }) => {
    if (!input.email) return false;
    const [row] = await getDb().select().from(eventsTable).where(eq(eventsTable.id, input.eventId));
    if (!row) return false;
    const attendees = (row.attendees as string[]) ?? [];
    const isFollowed = attendees.includes(input.email);
    const next = isFollowed
      ? attendees.filter((e) => e !== input.email)
      : [...attendees, input.email];
    await getDb()
      .update(eventsTable)
      .set({ attendees: next })
      .where(eq(eventsTable.id, input.eventId));
    return !isFollowed;
  });
