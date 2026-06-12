import type { IPostRepository } from "../../interfaces/IPostRepository";
import type { Post } from "../../../types/models";

export class LocalStoragePostRepository implements IPostRepository {
  private readonly postsKey = "user_posts";

  async getAll(): Promise<Post[]> {
    return this.getItems<Post>(this.postsKey);
  }

  async getById(id: string): Promise<Post | undefined> {
    const all = await this.getAll();
    return all.find((p) => p.id === id);
  }

  async create(post: Omit<Post, "id">): Promise<Post> {
    const id = `p${Date.now()}`;
    const newPost: Post = { ...post, id };
    this.saveItem(this.postsKey, newPost);
    return newPost;
  }

  async update(id: string, updates: Partial<Post>): Promise<void> {
    const items = this.getItems<Post>(this.postsKey);
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
      this.setItems(this.postsKey, items);
    }
  }

  async delete(id: string): Promise<void> {
    const items = this.getItems<Post>(this.postsKey);
    this.setItems(this.postsKey, items.filter((i) => i.id !== id));
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
