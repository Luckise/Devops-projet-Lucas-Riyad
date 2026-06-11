import type { Post } from "../../types/models";

export interface IPostRepository {
  getAll(): Promise<Post[]>;
  getById(id: string): Promise<Post | undefined>;
  create(post: Omit<Post, "id">): Promise<Post>;
  update(id: string, updates: Partial<Post>): Promise<void>;
  delete(id: string): Promise<void>;
}
