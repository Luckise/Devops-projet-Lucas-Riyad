import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { getDb } from "#/db/index.ts";
import { events as eventsTable } from "#/db/schema.ts";

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

async function handle({ request, params }: { request: Request; params: { eventId: string } }) {
  const { eventId } = params;

  if (request.method === "GET") {
    const [row] = await getDb().select().from(eventsTable).where(eq(eventsTable.id, eventId));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(rowToEvent(row));
  }

  if (request.method === "PUT") {
    const body = await request.json();
    const values: Record<string, unknown> = {};
    if (body.title !== undefined) values.title = body.title;
    if (body.date !== undefined) values.date = body.date;
    if (body.time !== undefined) values.time = body.time;
    if (body.location !== undefined) values.location = body.location;
    if (body.price !== undefined) values.price = String(body.price);
    if (body.joined !== undefined) values.joined = String(body.joined);
    if (body.maxParticipants !== undefined) values.maxParticipants = String(body.maxParticipants);
    if (body.isPast !== undefined) values.isPast = body.isPast;
    if (body.hidden !== undefined) values.hidden = body.hidden;
    if (body.attendees !== undefined) values.attendees = body.attendees;
    if (body.image !== undefined) values.image = body.image;
    if (body.tags !== undefined) values.tags = body.tags;
    if (body.groupId !== undefined) values.groupId = body.groupId;
    if (body.description !== undefined) values.description = body.description;
    if (Object.keys(values).length > 0) {
      await getDb().update(eventsTable).set(values).where(eq(eventsTable.id, eventId));
    }
    const [updated] = await getDb().select().from(eventsTable).where(eq(eventsTable.id, eventId));
    return Response.json(rowToEvent(updated!));
  }

  if (request.method === "DELETE") {
    await getDb().delete(eventsTable).where(eq(eventsTable.id, eventId));
    return Response.json({ success: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/events/$eventId")({
  server: {
    handlers: {
      GET: handle,
      PUT: handle,
      DELETE: handle,
    },
  },
});
