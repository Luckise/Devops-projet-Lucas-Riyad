import type { Ticket, Event, UserProfile } from "../../types/models";

export interface ITicketService {
  getAll(): Promise<Ticket[]>;
  getById(id: string): Promise<Ticket | undefined>;
  create(event: Event, profile: UserProfile): Promise<Ticket>;
}
