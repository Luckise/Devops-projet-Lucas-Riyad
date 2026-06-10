import type { Tip } from "../../types/models";

export interface ITipService {
  getAll(): Promise<Tip[]>;
  getById(id: string): Promise<Tip | undefined>;
  create(data: Omit<Tip, "id">): Promise<Tip>;
  update(id: string, updates: Partial<Tip>): Promise<void>;
  delete(id: string): Promise<void>;
  hide(id: string): Promise<void>;
  unhide(id: string): Promise<void>;
}
