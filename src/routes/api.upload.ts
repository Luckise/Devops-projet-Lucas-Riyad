import "#/polyfill";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createFileRoute } from "@tanstack/react-router";

const bucket = process.env.ASSET_BUCKET_NAME || "devops-projet-lucas-riyad-dev-assets-e5f3e56b";
const region = process.env.AWS_REGION || "eu-west-3";

const client = new S3Client({
  region,
});

async function handle({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { file, filename, contentType } = body as {
      file: string;
      filename: string;
      contentType: string;
    };

    if (!file || !filename) {
      return new Response(JSON.stringify({ error: "Missing file or filename" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const buffer = Buffer.from(file, "base64");
    const key = `uploads/${Date.now()}-${filename}`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType || "image/jpeg",
      }),
    );

    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[/api/upload] Error:", error?.message || error);
    if (error?.$metadata) {
      console.error("[/api/upload] SDK Error:", JSON.stringify(error.$metadata));
    }
    return new Response(
      JSON.stringify({ error: "Upload failed", detail: error?.message || String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: handle,
    },
  },
});
