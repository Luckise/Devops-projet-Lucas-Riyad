import "#/polyfill";

import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
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

async function handle({ request, params }: { request: Request; params: { tipId: string } }) {
  const { tipId } = params;

  if (request.method === "GET") {
    const [row] = await getDb().select().from(tipsTable).where(eq(tipsTable.id, tipId));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(rowToTip(row));
  }

  if (request.method === "PUT") {
    const body = await request.json();
    const values: Record<string, unknown> = {};
    if (body.title !== undefined) values.title = body.title;
    if (body.category !== undefined) values.category = body.category;
    if (body.image !== undefined) values.image = body.image;
    if (body.height !== undefined) values.height = body.height;
    if (body.cookingTime !== undefined) values.cookingTime = body.cookingTime;
    if (body.ingredients !== undefined) values.ingredients = body.ingredients;
    if (body.address !== undefined) values.address = body.address;
    if (body.hidden !== undefined) values.hidden = body.hidden;
    if (body.content !== undefined) values.content = body.content;
    if (Object.keys(values).length > 0) {
      await getDb().update(tipsTable).set(values).where(eq(tipsTable.id, tipId));
    }
    const [updated] = await getDb().select().from(tipsTable).where(eq(tipsTable.id, tipId));
    return Response.json(rowToTip(updated!));
  }

  if (request.method === "DELETE") {
    await getDb().delete(tipsTable).where(eq(tipsTable.id, tipId));
    return Response.json({ success: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export const Route = createFileRoute("/api/tips/$tipId")({
  server: {
    handlers: {
      GET: handle,
      PUT: handle,
      DELETE: handle,
    },
  },
});
