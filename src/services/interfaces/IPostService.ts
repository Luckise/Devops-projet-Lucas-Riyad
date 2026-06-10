import type { Post } from "../../types/models";

export interface IPostService {
  getAll(): Promise<Post[]>;
  getById(id: string): Promise<Post | undefined>;
  create(data: Omit<Post, "id">): Promise<Post>;
  update(id: string, updates: Partial<Post>): Promise<void>;
  delete(id: string): Promise<void>;
}
