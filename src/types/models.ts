export interface ContentBlock {
  type: "text" | "image";
  value: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  joined: number;
  maxParticipants: number;
  isPast: boolean;
  hidden?: boolean;
  attendees: string[];
  image: string;
  tags: string[];
  groupId: string;
  description: string;
}

export interface Group {
  id: string;
  name: string;
  owner: string;
  members: string[];
  image?: string;
  content?: ContentBlock[];
}

export interface Tip {
  id: string;
  title: string;
  category: string;
  image: string;
  height?: string;
  cookingTime?: string;
  ingredients?: string[];
  address?: string;
  hidden?: boolean;
  authorEmail?: string;
  content: ContentBlock[];
}

export interface Post {
  id: string;
  content: ContentBlock[] | string;
  eventId?: string;
  createdAt: string;
  authorEmail?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  qrDataUrl: string;
  type: string;
  purchaseDate: string;
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
  };
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
