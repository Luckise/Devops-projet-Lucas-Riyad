import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { IImageRepository } from "../../interfaces/IImageRepository";

export class S3ImageRepository implements IImageRepository {
  private client: S3Client;
  private bucket: string;
  private region: string;
  private cloudfrontDomain?: string;

  constructor() {
    this.region = import.meta.env.VITE_AWS_REGION || "eu-west-3";
    this.bucket = import.meta.env.VITE_S3_BUCKET || "devops-projet-lucas-riyad-dev-assets-e5f3e56b";
    this.cloudfrontDomain = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

    const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
    const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

    const clientConfig: ConstructorParameters<typeof S3Client>[0] = {
      region: this.region,
    };

    if (accessKeyId && secretAccessKey) {
      clientConfig.credentials = { accessKeyId, secretAccessKey };
    }

    this.client = new S3Client(clientConfig);
  }

  async upload(file: File, path?: string): Promise<string> {
    const key = path || `uploads/${Date.now()}-${file.name}`;
    const buffer = await file.arrayBuffer();

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: new Uint8Array(buffer),
        ContentType: file.type,
      })
    );

    if (this.cloudfrontDomain) {
      return `https://${this.cloudfrontDomain}/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async delete(url: string): Promise<void> {
    const key = this.extractKey(url);
    if (!key) return;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  private extractKey(url: string): string | null {
    try {
      const parsed = new URL(url);
      const key = parsed.pathname.replace(/^\//, "");
      return key || null;
    } catch {
      return null;
    }
  }
}
