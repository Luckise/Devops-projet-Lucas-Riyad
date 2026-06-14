import type { IGroupService } from "../interfaces/IGroupService";
import type { IGroupRepository } from "../../repositories/interfaces/IGroupRepository";
import type { Group, ContentBlock } from "../../types/models";

export class GroupService implements IGroupService {
  constructor(private readonly repo: IGroupRepository) {}

  async getAll(): Promise<Record<string, Group>> {
    return this.repo.getAll();
  }

  async getAllClubs(): Promise<Group[]> {
    return this.repo.getAllClubs();
  }

  async getById(id: string): Promise<Group | undefined> {
    return this.repo.getById(id);
  }

  async getUserGroups(email: string): Promise<Group[]> {
    return this.repo.getUserGroups(email);
  }

  async create(name: string, ownerEmail: string): Promise<Group> {
    return this.repo.create(name, ownerEmail);
  }

  async addMember(groupId: string, memberEmail: string): Promise<boolean> {
    return this.repo.addMember(groupId, memberEmail);
  }

  async removeMember(groupId: string, memberEmail: string): Promise<boolean> {
    return this.repo.removeMember(groupId, memberEmail);
  }

  async rename(groupId: string, newName: string): Promise<boolean> {
    return this.repo.rename(groupId, newName);
  }

  async transferOwnership(groupId: string, newOwnerEmail: string): Promise<boolean> {
    return this.repo.transferOwnership(groupId, newOwnerEmail);
  }

  async savePage(
    groupId: string,
    image: string,
    content: ContentBlock[] | undefined,
  ): Promise<boolean> {
    return this.repo.savePage(groupId, image, content);
  }

  async delete(groupId: string): Promise<boolean> {
    return this.repo.delete(groupId);
  }

  async isUserAdmin(email: string): Promise<boolean> {
    return this.repo.isUserAdmin(email);
  }

  userRole(group: Group, email: string): "Owner" | "Member" | null {
    return this.repo.userRole(group, email);
  }
}
