import { os } from "@orpc/server";
import * as z from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "#/db/index.ts";
import { tips as tipsTable } from "#/db/schema.ts";

const ContentBlock = z.object({ type: z.enum(["text", "image"]), value: z.string() });

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

export const listTips = os.handler(async () => {
  const rows = await getDb().select().from(tipsTable);
  return rows.map(rowToTip);
});

export const getTip = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  const [row] = await getDb().select().from(tipsTable).where(eq(tipsTable.id, input.id));
  return row ? rowToTip(row) : undefined;
});

export const createTip = os
  .input(
    z.object({
      title: z.string(),
      category: z.string(),
      image: z.string(),
      height: z.string().optional(),
      cookingTime: z.string().optional(),
      ingredients: z.array(z.string()).optional(),
      address: z.string().optional(),
      hidden: z.boolean().optional(),
      authorEmail: z.string().optional(),
      content: z.array(ContentBlock),
    }),
  )
  .handler(async ({ input }) => {
    const [row] = await getDb()
      .insert(tipsTable)
      .values({
        title: input.title,
        category: input.category,
        image: input.image,
        height: input.height,
        cookingTime: input.cookingTime,
        ingredients: input.ingredients,
        address: input.address,
        hidden: input.hidden ?? false,
        authorEmail: input.authorEmail,
        content: input.content,
      })
      .returning();
    return rowToTip(row);
  });

export const updateTip = os
  .input(
    z.object({
      id: z.string(),
      updates: z.object({
        title: z.string().optional(),
        category: z.string().optional(),
        image: z.string().optional(),
        height: z.string().optional(),
        cookingTime: z.string().optional(),
        ingredients: z.array(z.string()).optional(),
        address: z.string().optional(),
        hidden: z.boolean().optional(),
        content: z.array(ContentBlock).optional(),
      }),
    }),
  )
  .handler(async ({ input }) => {
    const values: Record<string, unknown> = {};
    const u = input.updates;
    if (u.title !== undefined) values.title = u.title;
    if (u.category !== undefined) values.category = u.category;
    if (u.image !== undefined) values.image = u.image;
    if (u.height !== undefined) values.height = u.height;
    if (u.cookingTime !== undefined) values.cookingTime = u.cookingTime;
    if (u.ingredients !== undefined) values.ingredients = u.ingredients;
    if (u.address !== undefined) values.address = u.address;
    if (u.hidden !== undefined) values.hidden = u.hidden;
    if (u.content !== undefined) values.content = u.content;
    if (Object.keys(values).length > 0) {
      await getDb().update(tipsTable).set(values).where(eq(tipsTable.id, input.id));
    }
  });

export const deleteTip = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  await getDb().delete(tipsTable).where(eq(tipsTable.id, input.id));
});

export const hideTip = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  await getDb().update(tipsTable).set({ hidden: true }).where(eq(tipsTable.id, input.id));
});

export const unhideTip = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  await getDb().update(tipsTable).set({ hidden: false }).where(eq(tipsTable.id, input.id));
});
