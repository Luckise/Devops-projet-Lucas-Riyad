import type { IGroupRepository } from "../../interfaces/IGroupRepository";
import type { Group, ContentBlock } from "../../../types/models";

export class LocalStorageGroupRepository implements IGroupRepository {
  private readonly groupsKey = "eat_groups";

  async getAll(): Promise<Record<string, Group>> {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem(this.groupsKey);
    return raw ? JSON.parse(raw) : {};
  }

  async getAllClubs(): Promise<Group[]> {
    const groups = await this.getAll();
    return Object.values(groups).filter((g) => g.image);
  }

  async getById(id: string): Promise<Group | undefined> {
    const groups = await this.getAll();
    return groups[id];
  }

  async getUserGroups(email: string): Promise<Group[]> {
    const groups = await this.getAll();
    return Object.values(groups).filter((g) => g.members.includes(email));
  }

  async create(name: string, ownerEmail: string): Promise<Group> {
    const groups = await this.getAll();
    const id = `g${Date.now()}`;
    const group: Group = { id, name, owner: ownerEmail, members: [ownerEmail] };
    groups[id] = group;
    await this.save(groups);
    return group;
  }

  async save(groups: Record<string, Group>): Promise<void> {
    localStorage.setItem(this.groupsKey, JSON.stringify(groups));
  }

  async addMember(groupId: string, memberEmail: string): Promise<boolean> {
    const groups = await this.getAll();
    const group = groups[groupId];
    if (!group || group.members.includes(memberEmail)) return false;
    group.members.push(memberEmail);
    await this.save(groups);
    return true;
  }

  async removeMember(groupId: string, memberEmail: string): Promise<boolean> {
    const groups = await this.getAll();
    const group = groups[groupId];
    if (!group || group.owner === memberEmail) return false;
    group.members = group.members.filter((m) => m !== memberEmail);
    await this.save(groups);
    return true;
  }

  async rename(groupId: string, newName: string): Promise<boolean> {
    const groups = await this.getAll();
    const group = groups[groupId];
    if (!group || !newName.trim()) return false;
    group.name = newName.trim();
    await this.save(groups);
    return true;
  }

  async transferOwnership(groupId: string, newOwnerEmail: string): Promise<boolean> {
    const groups = await this.getAll();
    const group = groups[groupId];
    if (!group || !group.members.includes(newOwnerEmail)) return false;
    group.owner = newOwnerEmail;
    await this.save(groups);
    return true;
  }

  async savePage(groupId: string, image: string, content: ContentBlock[] | undefined): Promise<boolean> {
    const groups = await this.getAll();
    const group = groups[groupId];
    if (!group) return false;
    group.image = image;
    group.content = content;
    await this.save(groups);
    return true;
  }

  async isUserAdmin(email: string): Promise<boolean> {
    if (!email || typeof window === "undefined") return false;
    const groups = await this.getUserGroups(email);
    return groups.length > 0;
  }

  userRole(group: Group, email: string): "Owner" | "Member" | null {
    if (group.owner === email) return "Owner";
    if (group.members.includes(email)) return "Member";
    return null;
  }
}
