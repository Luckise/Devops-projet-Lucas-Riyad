export interface IImageRepository {
  upload(file: File, path?: string): Promise<string>;
  delete(url: string): Promise<void>;
}
