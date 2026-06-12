import type { ITipRepository } from "../../interfaces/ITipRepository";
import type { Tip } from "../../../types/models";

export class LocalStorageTipRepository implements ITipRepository {
  private readonly tipsKey = "user_tips";

  async getAll(): Promise<Tip[]> {
    return this.getItems<Tip>(this.tipsKey);
  }

  async getById(id: string): Promise<Tip | undefined> {
    const all = await this.getAll();
    return all.find((t) => t.id === id);
  }

  async create(tip: Omit<Tip, "id">): Promise<Tip> {
    const id = `t${Date.now()}`;
    const newTip: Tip = { ...tip, id };
    this.saveItem(this.tipsKey, newTip);
    return newTip;
  }

  async update(id: string, updates: Partial<Tip>): Promise<void> {
    const items = this.getItems<Tip>(this.tipsKey);
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
      this.setItems(this.tipsKey, items);
    }
  }

  async delete(id: string): Promise<void> {
    const items = this.getItems<Tip>(this.tipsKey);
    this.setItems(this.tipsKey, items.filter((i) => i.id !== id));
  }

  async hide(id: string): Promise<void> {
    await this.update(id, { hidden: true } as Partial<Tip>);
  }

  async unhide(id: string): Promise<void> {
    await this.update(id, { hidden: false } as Partial<Tip>);
  }

  private getItems<T>(key: string): T[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  private setItems(key: string, items: unknown[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  private saveItem<T>(key: string, item: T): void {
    const existing = this.getItems<T>(key);
    existing.unshift(item);
    this.setItems(key, existing);
  }
}
