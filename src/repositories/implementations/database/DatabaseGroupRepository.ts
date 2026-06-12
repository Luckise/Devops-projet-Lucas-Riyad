import { eq } from "drizzle-orm";
import { getDb } from "../../../db/index.ts";
import { groups } from "../../../db/schema.ts";
import type { IGroupRepository } from "../../interfaces/IGroupRepository";
import type { Group, ContentBlock } from "../../../types/models";

function rowToGroup(row: typeof groups.$inferSelect): Group {
  return {
    id: row.id,
    name: row.name,
    owner: row.owner,
    members: (row.members as string[]) ?? [],
    image: row.image ?? undefined,
    content: (row.content as ContentBlock[]) ?? undefined,
  };
}

export class DatabaseGroupRepository implements IGroupRepository {
  async getAll(): Promise<Record<string, Group>> {
    const rows = await getDb().select().from(groups);
    const result: Record<string, Group> = {};
    for (const row of rows) {
      result[row.id] = rowToGroup(row);
    }
    return result;
  }

  async getAllClubs(): Promise<Group[]> {
    const rows = await getDb().select().from(groups);
    return rows.filter((r) => r.image).map(rowToGroup);
  }

  async getById(id: string): Promise<Group | undefined> {
    const [row] = await getDb().select().from(groups).where(eq(groups.id, id));
    return row ? rowToGroup(row) : undefined;
  }

  async getUserGroups(email: string): Promise<Group[]> {
    const rows = await getDb().select().from(groups);
    return rows
      .map(rowToGroup)
      .filter((g) => g.members.includes(email));
  }

  async create(name: string, ownerEmail: string): Promise<Group> {
    const [row] = await getDb().insert(groups).values({
      name,
      owner: ownerEmail,
      members: [ownerEmail],
    }).returning();
    return rowToGroup(row);
  }

  async save(allGroups: Record<string, Group>): Promise<void> {
    for (const group of Object.values(allGroups)) {
      const existing = await this.getById(group.id);
      if (existing) {
        await getDb().update(groups).set({
          name: group.name,
          owner: group.owner,
          members: group.members,
          image: group.image ?? null,
          content: group.content ?? null,
        }).where(eq(groups.id, group.id));
      } else {
        await getDb().insert(groups).values({
          id: group.id,
          name: group.name,
          owner: group.owner,
          members: group.members,
          image: group.image ?? null,
          content: group.content ?? null,
        });
      }
    }
  }

  async addMember(groupId: string, memberEmail: string): Promise<boolean> {
    const group = await this.getById(groupId);
    if (!group || group.members.includes(memberEmail)) return false;
    group.members.push(memberEmail);
    await getDb().update(groups).set({ members: group.members }).where(eq(groups.id, groupId));
    return true;
  }

  async removeMember(groupId: string, memberEmail: string): Promise<boolean> {
    const group = await this.getById(groupId);
    if (!group || group.owner === memberEmail) return false;
    group.members = group.members.filter((m) => m !== memberEmail);
    await getDb().update(groups).set({ members: group.members }).where(eq(groups.id, groupId));
    return true;
  }

  async rename(groupId: string, newName: string): Promise<boolean> {
    if (!newName.trim()) return false;
    const group = await this.getById(groupId);
    if (!group) return false;
    await getDb().update(groups).set({ name: newName.trim() }).where(eq(groups.id, groupId));
    return true;
  }

  async transferOwnership(groupId: string, newOwnerEmail: string): Promise<boolean> {
    const group = await this.getById(groupId);
    if (!group || !group.members.includes(newOwnerEmail)) return false;
    await getDb().update(groups).set({ owner: newOwnerEmail }).where(eq(groups.id, groupId));
    return true;
  }

  async savePage(groupId: string, image: string, content: ContentBlock[] | undefined): Promise<boolean> {
    const group = await this.getById(groupId);
    if (!group) return false;
    await getDb().update(groups).set({ image, content: content ?? null }).where(eq(groups.id, groupId));
    return true;
  }

  async isUserAdmin(email: string): Promise<boolean> {
    if (!email) return false;
    const userGroups = await this.getUserGroups(email);
    return userGroups.length > 0;
  }

  userRole(group: Group, email: string): "Owner" | "Member" | null {
    if (group.owner === email) return "Owner";
    if (group.members.includes(email)) return "Member";
    return null;
  }
}
