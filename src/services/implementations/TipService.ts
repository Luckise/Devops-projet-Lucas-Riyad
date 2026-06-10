import type { ITipService } from "../interfaces/ITipService";
import type { ITipRepository } from "../../repositories/interfaces/ITipRepository";
import type { Tip } from "../../types/models";

export class TipService implements ITipService {
  constructor(private readonly repo: ITipRepository) {}

  async getAll(): Promise<Tip[]> {
    return this.repo.getAll();
  }

  async getById(id: string): Promise<Tip | undefined> {
    return this.repo.getById(id);
  }

  async create(data: Omit<Tip, "id">): Promise<Tip> {
    return this.repo.create(data);
  }

  async update(id: string, updates: Partial<Tip>): Promise<void> {
    return this.repo.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  async hide(id: string): Promise<void> {
    return this.repo.hide(id);
  }

  async unhide(id: string): Promise<void> {
    return this.repo.unhide(id);
  }
}
