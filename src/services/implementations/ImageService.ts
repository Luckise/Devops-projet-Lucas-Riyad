import type { IImageService } from "../interfaces/IImageService";
import type { IImageRepository } from "../../repositories/interfaces/IImageRepository";

export class ImageService implements IImageService {
  constructor(private readonly repo: IImageRepository) {}

  async upload(file: File, path?: string): Promise<string> {
    return this.repo.upload(file, path);
  }

  async delete(url: string): Promise<void> {
    return this.repo.delete(url);
  }
}
