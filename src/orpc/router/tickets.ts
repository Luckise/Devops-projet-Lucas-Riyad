import { os } from "@orpc/server";
import * as z from "zod";
import { eq } from "drizzle-orm";
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

export const listTickets = os.handler(async () => {
  const rows = await getDb().select().from(ticketsTable);
  return rows.map(rowToTicket);
});

export const getTicket = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  const [row] = await getDb().select().from(ticketsTable).where(eq(ticketsTable.id, input.id));
  return row ? rowToTicket(row) : undefined;
});

export const createTicket = os
  .input(
    z.object({
      eventId: z.string(),
      qrDataUrl: z.string(),
      type: z.string(),
      purchaseDate: z.string(),
      event: z.object({
        title: z.string(),
        date: z.string(),
        time: z.string(),
        location: z.string(),
        image: z.string(),
      }),
    }),
  )
  .handler(async ({ input }) => {
    const [row] = await getDb()
      .insert(ticketsTable)
      .values({
        eventId: input.eventId,
        qrDataUrl: input.qrDataUrl,
        type: input.type,
        purchaseDate: input.purchaseDate,
        event: input.event,
      })
      .returning();
    return rowToTicket(row);
  });
