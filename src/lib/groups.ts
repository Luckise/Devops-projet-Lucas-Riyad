const GROUPS_KEY = "eat_groups";

export interface Group {
  id: string;
  name: string;
  owner: string;
  members: string[];
}

export function getGroups(): Record<string, Group> {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem(GROUPS_KEY) || "{}");
}

export function saveGroups(groups: Record<string, Group>): void {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

export function getUserGroups(email: string): Group[] {
  return Object.values(getGroups()).filter((g) => g.members.includes(email));
}

export function getGroup(id: string): Group | undefined {
  return getGroups()[id];
}

export function createGroup(name: string, ownerEmail: string): Group {
  const groups = getGroups();
  const id = `g${Date.now()}`;
  const group: Group = { id, name, owner: ownerEmail, members: [ownerEmail] };
  groups[id] = group;
  saveGroups(groups);
  return group;
}

export function addMember(groupId: string, memberEmail: string): boolean {
  const groups = getGroups();
  const group = groups[groupId];
  if (!group || group.members.includes(memberEmail)) return false;
  group.members.push(memberEmail);
  saveGroups(groups);
  return true;
}

export function removeMember(groupId: string, memberEmail: string): boolean {
  const groups = getGroups();
  const group = groups[groupId];
  if (!group || group.owner === memberEmail) return false;
  group.members = group.members.filter((m) => m !== memberEmail);
  saveGroups(groups);
  return true;
}

export function renameGroup(groupId: string, newName: string): boolean {
  const groups = getGroups();
  const group = groups[groupId];
  if (!group || !newName.trim()) return false;
  group.name = newName.trim();
  saveGroups(groups);
  return true;
}

export function transferOwnership(groupId: string, newOwnerEmail: string): boolean {
  const groups = getGroups();
  const group = groups[groupId];
  if (!group || !group.members.includes(newOwnerEmail)) return false;
  group.owner = newOwnerEmail;
  saveGroups(groups);
  return true;
}

export function userRole(group: Group, email: string): "Owner" | "Member" | null {
  if (group.owner === email) return "Owner";
  if (group.members.includes(email)) return "Member";
  return null;
}

export function isUserAdmin(email: string): boolean {
  if (!email || typeof window === "undefined") return false;
  return getUserGroups(email).length > 0;
}