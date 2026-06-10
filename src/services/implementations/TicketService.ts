import type { ITicketService } from "../interfaces/ITicketService";
import type { ITicketRepository } from "../../repositories/interfaces/ITicketRepository";
import type { Ticket, Event, UserProfile } from "../../types/models";

export class TicketService implements ITicketService {
  constructor(private readonly repo: ITicketRepository) {}

  async getAll(): Promise<Ticket[]> {
    return this.repo.getAll();
  }

  async getById(id: string): Promise<Ticket | undefined> {
    return this.repo.getById(id);
  }

  async create(event: Event, profile: UserProfile): Promise<Ticket> {
    return this.repo.create(event, profile);
  }
}
