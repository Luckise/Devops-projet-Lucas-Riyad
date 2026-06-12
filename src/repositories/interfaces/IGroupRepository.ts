import type { Group } from "../../types/models";

export interface IGroupRepository {
  getAll(): Promise<Record<string, Group>>;
  getAllClubs(): Promise<Group[]>;
  getById(id: string): Promise<Group | undefined>;
  getUserGroups(email: string): Promise<Group[]>;
  create(name: string, ownerEmail: string): Promise<Group>;
  save(groups: Record<string, Group>): Promise<void>;
  addMember(groupId: string, memberEmail: string): Promise<boolean>;
  removeMember(groupId: string, memberEmail: string): Promise<boolean>;
  rename(groupId: string, newName: string): Promise<boolean>;
  transferOwnership(groupId: string, newOwnerEmail: string): Promise<boolean>;
  savePage(groupId: string, image: string, content: Group["content"]): Promise<boolean>;
  isUserAdmin(email: string): Promise<boolean>;
  userRole(group: Group, email: string): "Owner" | "Member" | null;
}
