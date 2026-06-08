export const defaultUser = {
  firstName: "Alex",
  lastName: "Kim",
  nickname: "@alexk",
  email: "alex.kim@example.com",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
  isAdmin: false,
};

export type UserProfile = typeof defaultUser;
