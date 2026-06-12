export interface IImageService {
  upload(file: File, path?: string): Promise<string>;
  delete(url: string): Promise<void>;
}
