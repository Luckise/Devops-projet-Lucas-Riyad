import { os } from "@orpc/server";
import * as z from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "#/db/index.ts";
import { posts as postsTable } from "#/db/schema.ts";

const ContentBlock = z.object({ type: z.enum(["text", "image"]), value: z.string() });

function rowToPost(row: typeof postsTable.$inferSelect) {
  return {
    id: row.id,
    content: (row.content as Array<{ type: string; value: string }> | string) ?? [],
    eventId: row.eventId ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? "",
    authorEmail: row.authorEmail ?? undefined,
  };
}

export const listPosts = os.handler(async () => {
  const rows = await getDb().select().from(postsTable);
  return rows.map(rowToPost);
});

export const getPost = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  const [row] = await getDb().select().from(postsTable).where(eq(postsTable.id, input.id));
  return row ? rowToPost(row) : undefined;
});

export const createPost = os
  .input(
    z.object({
      content: z.union([z.array(ContentBlock), z.string()]),
      eventId: z.string().optional(),
      authorEmail: z.string().optional(),
    }),
  )
  .handler(async ({ input }) => {
    const [row] = await getDb()
      .insert(postsTable)
      .values({
        content: input.content,
        eventId: input.eventId,
        authorEmail: input.authorEmail,
      })
      .returning();
    return rowToPost(row);
  });

export const updatePost = os
  .input(
    z.object({
      id: z.string(),
      updates: z.object({
        content: z.union([z.array(ContentBlock), z.string()]).optional(),
        eventId: z.string().optional(),
      }),
    }),
  )
  .handler(async ({ input }) => {
    const values: Record<string, unknown> = {};
    if (input.updates.content !== undefined) values.content = input.updates.content;
    if (input.updates.eventId !== undefined) values.eventId = input.updates.eventId;
    if (Object.keys(values).length > 0) {
      await getDb().update(postsTable).set(values).where(eq(postsTable.id, input.id));
    }
  });

export const deletePost = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  await getDb().delete(postsTable).where(eq(postsTable.id, input.id));
});
