import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
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

async function handle({ request }: { request: Request }) {
  if (request.method === "GET") {
    const rows = await getDb().select().from(eventsTable);
    return Response.json(rows.map(rowToEvent));
  }

  if (request.method === "POST") {
    const body = await request.json();
    const [row] = await getDb()
      .insert(eventsTable)
      .values({
        title: body.title,
        date: body.date,
        time: body.time,
        location: body.location,
        price: String(body.price ?? 0),
        joined: String(body.joined ?? 0),
        maxParticipants: String(body.maxParticipants ?? 0),
        isPast: body.isPast ?? false,
        hidden: body.hidden ?? false,
        attendees: body.attendees ?? [],
        image: body.image ?? "",
        tags: body.tags ?? [],
        groupId: body.groupId ?? "",
        description: body.description ?? "",
      })
      .returning();
    return Response.json(rowToEvent(row), { status: 201 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/events")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
