import type { ITicketRepository } from "../../interfaces/ITicketRepository";
import type { Ticket, Event, UserProfile } from "../../../types/models";

function generateTicketId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "TICK-";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export class LocalStorageTicketRepository implements ITicketRepository {
  private readonly ticketsKey = "purchased_tickets";

  async getAll(): Promise<Ticket[]> {
    return this.getItems<Ticket>(this.ticketsKey);
  }

  async getById(id: string): Promise<Ticket | undefined> {
    const all = await this.getAll();
    return all.find((t) => t.id === id);
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
    const ticket: Ticket = {
      id: ticketId,
      eventId: event.id,
      qrDataUrl,
      type: event.price > 0 ? "General Admission" : "Free Entry",
      purchaseDate: new Date().toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
      event: {
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        image: event.image,
      },
    };
    this.saveItem(this.ticketsKey, ticket);
    return ticket;
  }

  private getItems<T>(key: string): T[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  private saveItem<T>(key: string, item: T): void {
    const existing = this.getItems<T>(key);
    existing.unshift(item);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}
