import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { getDb } from "#/db/index.ts";
import { posts as postsTable } from "#/db/schema.ts";

function rowToPost(row: typeof postsTable.$inferSelect) {
  return {
    id: row.id,
    content: (row.content as Array<{ type: string; value: string }> | string) ?? [],
    eventId: row.eventId ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? "",
    authorEmail: row.authorEmail ?? undefined,
  };
}

async function handle({ request, params }: { request: Request; params: { postId: string } }) {
  const { postId } = params;

  if (request.method === "GET") {
    const [row] = await getDb().select().from(postsTable).where(eq(postsTable.id, postId));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(rowToPost(row));
  }

  if (request.method === "PUT") {
    const body = await request.json();
    const values: Record<string, unknown> = {};
    if (body.content !== undefined) values.content = body.content;
    if (body.eventId !== undefined) values.eventId = body.eventId;
    if (Object.keys(values).length > 0) {
      await getDb().update(postsTable).set(values).where(eq(postsTable.id, postId));
    }
    const [updated] = await getDb().select().from(postsTable).where(eq(postsTable.id, postId));
    return Response.json(rowToPost(updated!));
  }

  if (request.method === "DELETE") {
    await getDb().delete(postsTable).where(eq(postsTable.id, postId));
    return Response.json({ success: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/posts/$postId")({
  server: {
    handlers: {
      GET: handle,
      PUT: handle,
      DELETE: handle,
    },
  },
});
