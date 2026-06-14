import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "#/db/index.ts";
import { tips as tipsTable } from "#/db/schema.ts";

function rowToTip(row: typeof tipsTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image,
    height: row.height ?? undefined,
    cookingTime: row.cookingTime ?? undefined,
    ingredients: (row.ingredients as string[] | null) ?? undefined,
    address: row.address ?? undefined,
    hidden: row.hidden,
    authorEmail: row.authorEmail ?? undefined,
    content: (row.content as Array<{ type: string; value: string }>) ?? [],
  };
}

async function handle({ request }: { request: Request }) {
  if (request.method === "GET") {
    const rows = await getDb().select().from(tipsTable);
    return Response.json(rows.map(rowToTip));
  }

  if (request.method === "POST") {
    const body = await request.json();
    const [row] = await getDb()
      .insert(tipsTable)
      .values({
        title: body.title,
        category: body.category,
        image: body.image ?? "",
        height: body.height,
        cookingTime: body.cookingTime,
        ingredients: body.ingredients,
        address: body.address,
        hidden: body.hidden ?? false,
        authorEmail: body.authorEmail,
        content: body.content ?? [],
      })
      .returning();
    return Response.json(rowToTip(row), { status: 201 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/tips")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
