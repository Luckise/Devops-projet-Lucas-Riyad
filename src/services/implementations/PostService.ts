import type { IPostService } from "../interfaces/IPostService";
import type { IPostRepository } from "../../repositories/interfaces/IPostRepository";
import type { Post } from "../../types/models";

export class PostService implements IPostService {
  constructor(private readonly repo: IPostRepository) {}

  async getAll(): Promise<Post[]> {
    return this.repo.getAll();
  }

  async getById(id: string): Promise<Post | undefined> {
    return this.repo.getById(id);
  }

  async create(data: Omit<Post, "id">): Promise<Post> {
    return this.repo.create(data);
  }

  async update(id: string, updates: Partial<Post>): Promise<void> {
    return this.repo.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
