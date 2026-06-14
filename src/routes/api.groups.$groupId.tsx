import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { getDb } from "#/db/index.ts";
import { groups as groupsTable } from "#/db/schema.ts";

function rowToGroup(row: typeof groupsTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    owner: row.owner,
    members: (row.members as string[]) ?? [],
    image: row.image ?? undefined,
    content: (row.content as Array<{ type: string; value: string }> | null) ?? undefined,
  };
}

async function handle({ request, params }: { request: Request; params: { groupId: string } }) {
  const { groupId } = params;

  if (request.method === "GET") {
    const [row] = await getDb().select().from(groupsTable).where(eq(groupsTable.id, groupId));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(rowToGroup(row));
  }

  if (request.method === "PUT") {
    const body = await request.json();
    const values: Record<string, unknown> = {};
    if (body.name !== undefined) values.name = body.name;
    if (body.owner !== undefined) values.owner = body.owner;
    if (body.members !== undefined) values.members = body.members;
    if (body.image !== undefined) values.image = body.image;
    if (body.content !== undefined) values.content = body.content;
    if (Object.keys(values).length > 0) {
      await getDb().update(groupsTable).set(values).where(eq(groupsTable.id, groupId));
    }
    const [updated] = await getDb().select().from(groupsTable).where(eq(groupsTable.id, groupId));
    return Response.json(rowToGroup(updated!));
  }

  if (request.method === "DELETE") {
    await getDb().delete(groupsTable).where(eq(groupsTable.id, groupId));
    return Response.json({ success: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/groups/$groupId")({
  server: {
    handlers: {
      GET: handle,
      PUT: handle,
      DELETE: handle,
    },
  },
});
