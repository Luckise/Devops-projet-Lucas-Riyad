const GROUPS_KEY = "eat_groups";

export interface ContentBlock {
  type: "text" | "image";
  value: string;
}

export interface Group {
  id: string;
  name: string;
  owner: string;
  members: string[];
  image?: string;
  content?: ContentBlock[];
}

export const MOCK_CLUBS: Group[] = [
  {
    id: "seed_efrei_esports",
    name: "EFREI Esports",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "lucas.guillemin@efrei.net", "ryiad.larbaoui@efrei.net"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "EFREI Esports is the official competitive gaming club of EFREI Paris. We compete in League of Legends, Valorant, CS2, and more across French university tournaments." },
      { type: "image", value: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "We host weekly practice sessions, LAN parties, and viewing parties for major tournaments. New members of all skill levels are welcome — whether you're grinding for top rank or just love the game." },
      { type: "text", value: "Practices run every Tuesday and Thursday evening at the EFREI campus gaming lab. Join our Discord to find teammates and stay updated on upcoming events." },
    ],
  },
  {
    id: "seed_photo_club",
    name: "EFREI Photography",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "lucas.guillemin@efrei.net"],
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "The EFREI Photography Club brings together students passionate about capturing moments. From portrait shoots to urban exploration, we explore Paris through the lens." },
      { type: "image", value: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "We organise monthly group walks to iconic Parisian locations, studio workshops with professional photographers, and an annual exhibition showcasing student work." },
    ],
  },
  {
    id: "seed_hiking",
    name: "EFREI Outdoor",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "ryiad.larbaoui@efrei.net"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "EFREI Outdoor is for students who love nature, hiking, and adventure. We organise weekend trips to forests, cliffs, and national parks around France." },
      { type: "image", value: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "Previous trips include Fontainebleau bouldering, Normandy coastal hikes, and a week-long camping trip in the Alps. Gear sharing and carpooling are always arranged." },
    ],
  },
  {
    id: "seed_a_table",
    name: "EFREI A TABLE",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "lucas.guillemin@efrei.net"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "EFREI A TABLE is the campus culinary club where students gather to cook, taste, and share. Each month we explore a different cuisine, from Italian classics to Southeast Asian street food, with workshops led by student chefs and local restaurateurs." },
      { type: "image", value: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "No experience needed, just an appetite. We meet every other Wednesday in the student kitchen lab. Ingredients are covered by the club fee, and you leave with recipes and a full stomach." },
    ],
  },
  {
    id: "seed_cine_club",
    name: "EFREI Ciné Club",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "ryiad.larbaoui@efrei.net"],
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "EFREI Ciné Club screens films every Friday night in the campus amphitheatre. Our programme runs the gamut from cult classics and indie darlings to international cinema and student-made shorts." },
      { type: "image", value: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "Each screening is followed by an open discussion. Membership is free, and we provide popcorn. Propose a film for the next cycle and your pick might make the cut." },
    ],
  },
];

export function getGroups(): Record<string, Group> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(GROUPS_KEY);
  const stored: Record<string, Group> = raw ? JSON.parse(raw) : {};

  const seed: Record<string, Group> = {};
  for (const club of MOCK_CLUBS) {
    seed[club.id] = { ...stored[club.id], ...club };
  }

  const merged = { ...seed, ...stored };
  const needsSave = Object.keys(merged).length !== Object.keys(stored).length;
  if (!raw || needsSave) {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(merged));
  }

  return merged;
}

export function getAllClubs(): Group[] {
  return Object.values(getGroups()).filter((g) => g.image);
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

export function saveClubPage(groupId: string, image: string, content: ContentBlock[]): boolean {
  const groups = getGroups();
  const group = groups[groupId];
  if (!group) return false;
  group.image = image;
  group.content = content;
  saveGroups(groups);
  return true;
}