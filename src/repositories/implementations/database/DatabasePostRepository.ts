import { eq } from "drizzle-orm";
import { getDb } from "../../../db/index.ts";
import { posts } from "../../../db/schema.ts";
import type { IPostRepository } from "../../interfaces/IPostRepository";
import type { Post, ContentBlock } from "../../../types/models";

function rowToPost(row: typeof posts.$inferSelect): Post {
  return {
    id: row.id,
    content: (row.content as ContentBlock[]) ?? [],
    eventId: row.eventId ?? undefined,
    createdAt: row.createdAt.toISOString(),
    authorEmail: row.authorEmail ?? undefined,
  };
}

export class DatabasePostRepository implements IPostRepository {
  async getAll(): Promise<Post[]> {
    const rows = await getDb().select().from(posts);
    return rows.map(rowToPost);
  }

  async getById(id: string): Promise<Post | undefined> {
    const [row] = await getDb().select().from(posts).where(eq(posts.id, id));
    return row ? rowToPost(row) : undefined;
  }

  async create(post: Omit<Post, "id">): Promise<Post> {
    const [row] = await getDb().insert(posts).values({
      content: typeof post.content === "string" ? post.content : post.content,
      eventId: post.eventId ?? null,
      authorEmail: post.authorEmail ?? null,
    }).returning();
    return rowToPost(row);
  }

  async update(id: string, updates: Partial<Post>): Promise<void> {
    const values: Record<string, unknown> = {};
    if (updates.content !== undefined) values.content = updates.content;
    if (updates.eventId !== undefined) values.eventId = updates.eventId ?? null;
    if (updates.authorEmail !== undefined) values.authorEmail = updates.authorEmail ?? null;
    if (Object.keys(values).length > 0) {
      await getDb().update(posts).set(values).where(eq(posts.id, id));
    }
  }

  async delete(id: string): Promise<void> {
    await getDb().delete(posts).where(eq(posts.id, id));
  }
}
