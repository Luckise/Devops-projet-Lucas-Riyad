import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
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

async function handle({ request }: { request: Request }) {
  if (request.method === "GET") {
    const rows = await getDb().select().from(postsTable);
    return Response.json(rows.map(rowToPost));
  }

  if (request.method === "POST") {
    const body = await request.json();
    const [row] = await getDb()
      .insert(postsTable)
      .values({
        content: body.content,
        eventId: body.eventId,
        authorEmail: body.authorEmail,
      })
      .returning();
    return Response.json(rowToPost(row), { status: 201 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/posts")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
