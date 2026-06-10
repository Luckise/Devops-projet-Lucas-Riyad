import type { Ticket } from "../../types/models";
import type { Event, UserProfile } from "../../types/models";

export interface ITicketRepository {
  getAll(): Promise<Ticket[]>;
  getById(id: string): Promise<Ticket | undefined>;
  create(event: Event, profile: UserProfile): Promise<Ticket>;
}
