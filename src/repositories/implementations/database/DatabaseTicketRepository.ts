import { eq } from "drizzle-orm";
import { getDb } from "../../../db/index.ts";
import { tickets } from "../../../db/schema.ts";
import type { ITicketRepository } from "../../interfaces/ITicketRepository";
import type { Ticket, Event, UserProfile } from "../../../types/models";

function rowToTicket(row: typeof tickets.$inferSelect): Ticket {
  const event = row.event as Ticket["event"];
  return {
    id: row.id,
    eventId: row.eventId,
    qrDataUrl: row.qrDataUrl,
    type: row.type,
    purchaseDate: row.purchaseDate,
    event,
  };
}

export class DatabaseTicketRepository implements ITicketRepository {
  async getAll(): Promise<Ticket[]> {
    const rows = await getDb().select().from(tickets);
    return rows.map(rowToTicket);
  }

  async getById(id: string): Promise<Ticket | undefined> {
    const [row] = await getDb().select().from(tickets).where(eq(tickets.id, id));
    return row ? rowToTicket(row) : undefined;
  }

  async create(event: Event, profile: UserProfile): Promise<Ticket> {
    const ticketId = generateTicketId();
    let qrDataUrl = "";
    try {
      const QRCode = (await import("qrcode")).default;
      qrDataUrl = await QRCode.toDataURL(ticketId, {
        width: 400,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
    } catch {
      qrDataUrl = "";
    }
    const [row] = await getDb().insert(tickets).values({
      id: ticketId,
      eventId: event.id,
      qrDataUrl,
      type: event.price > 0 ? "General Admission" : "Free Entry",
      purchaseDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      event: {
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        image: event.image,
      },
    }).returning();
    return rowToTicket(row);
  }
}

function generateTicketId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "TICK-";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
