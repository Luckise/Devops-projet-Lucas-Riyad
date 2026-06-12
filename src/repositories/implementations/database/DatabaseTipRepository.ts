import { eq } from "drizzle-orm";
import { getDb } from "../../../db/index.ts";
import { tips } from "../../../db/schema.ts";
import type { ITipRepository } from "../../interfaces/ITipRepository";
import type { Tip, ContentBlock } from "../../../types/models";

function rowToTip(row: typeof tips.$inferSelect): Tip {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image,
    height: row.height ?? undefined,
    cookingTime: row.cookingTime ?? undefined,
    ingredients: (row.ingredients as string[]) ?? undefined,
    address: row.address ?? undefined,
    hidden: row.hidden,
    authorEmail: row.authorEmail ?? undefined,
    content: (row.content as ContentBlock[]) ?? [],
  };
}

export class DatabaseTipRepository implements ITipRepository {
  async getAll(): Promise<Tip[]> {
    const rows = await getDb().select().from(tips);
    return rows.map(rowToTip);
  }

  async getById(id: string): Promise<Tip | undefined> {
    const [row] = await getDb().select().from(tips).where(eq(tips.id, id));
    return row ? rowToTip(row) : undefined;
  }

  async create(tip: Omit<Tip, "id">): Promise<Tip> {
    const [row] = await getDb().insert(tips).values({
      title: tip.title,
      category: tip.category,
      image: tip.image,
      height: tip.height ?? null,
      cookingTime: tip.cookingTime ?? null,
      ingredients: tip.ingredients ?? null,
      address: tip.address ?? null,
      hidden: tip.hidden ?? false,
      authorEmail: tip.authorEmail ?? null,
      content: tip.content,
    }).returning();
    return rowToTip(row);
  }

  async update(id: string, updates: Partial<Tip>): Promise<void> {
    const values: Record<string, unknown> = {};
    if (updates.title !== undefined) values.title = updates.title;
    if (updates.category !== undefined) values.category = updates.category;
    if (updates.image !== undefined) values.image = updates.image;
    if (updates.height !== undefined) values.height = updates.height ?? null;
    if (updates.cookingTime !== undefined) values.cookingTime = updates.cookingTime ?? null;
    if (updates.ingredients !== undefined) values.ingredients = updates.ingredients ?? null;
    if (updates.address !== undefined) values.address = updates.address ?? null;
    if (updates.hidden !== undefined) values.hidden = updates.hidden;
    if (updates.authorEmail !== undefined) values.authorEmail = updates.authorEmail ?? null;
    if (updates.content !== undefined) values.content = updates.content;
    if (Object.keys(values).length > 0) {
      await getDb().update(tips).set(values).where(eq(tips.id, id));
    }
  }

  async delete(id: string): Promise<void> {
    await getDb().delete(tips).where(eq(tips.id, id));
  }

  async hide(id: string): Promise<void> {
    await this.update(id, { hidden: true });
  }

  async unhide(id: string): Promise<void> {
    await this.update(id, { hidden: false });
  }
}
