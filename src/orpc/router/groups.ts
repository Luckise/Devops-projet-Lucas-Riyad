import { os } from "@orpc/server";
import * as z from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "#/db/index.ts";
import { groups as groupsTable } from "#/db/schema.ts";

const ContentBlock = z.object({ type: z.enum(["text", "image"]), value: z.string() });

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

export const listGroups = os.handler(async () => {
  const rows = await getDb().select().from(groupsTable);
  return rows.map(rowToGroup);
});

export const getGroup = os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  const [row] = await getDb().select().from(groupsTable).where(eq(groupsTable.id, input.id));
  return row ? rowToGroup(row) : undefined;
});

export const getUserGroups = os
  .input(z.object({ email: z.string() }))
  .handler(async ({ input }) => {
    const rows = await getDb().select().from(groupsTable);
    return rows
      .map(rowToGroup)
      .filter((g) => g.members.includes(input.email) || g.owner === input.email);
  });

export const createGroup = os
  .input(z.object({ name: z.string(), ownerEmail: z.string() }))
  .handler(async ({ input }) => {
    const [row] = await getDb()
      .insert(groupsTable)
      .values({
        name: input.name,
        owner: input.ownerEmail,
        members: [input.ownerEmail],
      })
      .returning();
    return rowToGroup(row);
  });

export const addMember = os
  .input(z.object({ groupId: z.string(), memberEmail: z.string() }))
  .handler(async ({ input }) => {
    const [row] = await getDb().select().from(groupsTable).where(eq(groupsTable.id, input.groupId));
    if (!row) return false;
    const members = (row.members as string[]) ?? [];
    if (members.includes(input.memberEmail)) return true;
    await getDb()
      .update(groupsTable)
      .set({ members: [...members, input.memberEmail] })
      .where(eq(groupsTable.id, input.groupId));
    return true;
  });

export const removeMember = os
  .input(z.object({ groupId: z.string(), memberEmail: z.string() }))
  .handler(async ({ input }) => {
    const [row] = await getDb().select().from(groupsTable).where(eq(groupsTable.id, input.groupId));
    if (!row) return false;
    const members = (row.members as string[]) ?? [];
    await getDb()
      .update(groupsTable)
      .set({ members: members.filter((m) => m !== input.memberEmail) })
      .where(eq(groupsTable.id, input.groupId));
    return true;
  });

export const renameGroup = os
  .input(z.object({ groupId: z.string(), newName: z.string() }))
  .handler(async ({ input }) => {
    await getDb()
      .update(groupsTable)
      .set({ name: input.newName })
      .where(eq(groupsTable.id, input.groupId));
    return true;
  });

export const transferOwnership = os
  .input(z.object({ groupId: z.string(), newOwnerEmail: z.string() }))
  .handler(async ({ input }) => {
    const [row] = await getDb().select().from(groupsTable).where(eq(groupsTable.id, input.groupId));
    if (!row) return false;
    const members = (row.members as string[]) ?? [];
    await getDb()
      .update(groupsTable)
      .set({ owner: input.newOwnerEmail, members: [...new Set([...members, input.newOwnerEmail])] })
      .where(eq(groupsTable.id, input.groupId));
    return true;
  });

export const saveGroupPage = os
  .input(
    z.object({
      groupId: z.string(),
      image: z.string(),
      content: z.array(ContentBlock).optional(),
    }),
  )
  .handler(async ({ input }) => {
    await getDb()
      .update(groupsTable)
      .set({ image: input.image, content: input.content })
      .where(eq(groupsTable.id, input.groupId));
    return true;
  });
