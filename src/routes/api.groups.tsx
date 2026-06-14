import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
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

async function handle({ request }: { request: Request }) {
  const url = new URL(request.url);

  if (request.method === "GET") {
    const email = url.searchParams.get("email");
    const rows = await getDb().select().from(groupsTable);
    const groups = rows.map(rowToGroup);

    if (email) {
      return Response.json(groups.filter((g) => g.members.includes(email) || g.owner === email));
    }
    return Response.json(groups);
  }

  if (request.method === "POST") {
    const body = await request.json();
    const [row] = await getDb()
      .insert(groupsTable)
      .values({
        name: body.name,
        owner: body.ownerEmail,
        members: [body.ownerEmail],
      })
      .returning();
    return Response.json(rowToGroup(row), { status: 201 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/groups")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
