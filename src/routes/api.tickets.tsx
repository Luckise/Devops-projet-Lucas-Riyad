import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "#/db/index.ts";
import { tickets as ticketsTable } from "#/db/schema.ts";

function rowToTicket(row: typeof ticketsTable.$inferSelect) {
  return {
    id: row.id,
    eventId: row.eventId,
    qrDataUrl: row.qrDataUrl,
    type: row.type,
    purchaseDate: row.purchaseDate,
    event: row.event as {
      title: string;
      date: string;
      time: string;
      location: string;
      image: string;
    },
  };
}

async function handle({ request }: { request: Request }) {
  if (request.method === "GET") {
    const rows = await getDb().select().from(ticketsTable);
    return Response.json(rows.map(rowToTicket));
  }

  if (request.method === "POST") {
    const body = await request.json();
    const [row] = await getDb()
      .insert(ticketsTable)
      .values({
        eventId: body.eventId,
        qrDataUrl: body.qrDataUrl,
        type: body.type,
        purchaseDate: body.purchaseDate,
        event: body.event,
      })
      .returning();
    return Response.json(rowToTicket(row), { status: 201 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/tickets")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
