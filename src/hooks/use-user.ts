import { useState, useEffect } from 'react';

const USER_KEY = 'eat_user_profile';

export const defaultUser = {
  firstName: 'Alex',
  lastName: 'Kim',
  nickname: '@alexk',
  email: 'alex.kim@example.com',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
};

export type UserProfile = typeof defaultUser;

export function useUser() {
  const [user, setUserState] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) return JSON.parse(saved);
    }
    return defaultUser;
  });

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      window.dispatchEvent(new Event('user-updated'));
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) setUserState(JSON.parse(saved));
    };
    window.addEventListener('user-updated', handleUpdate);
    return () => window.removeEventListener('user-updated', handleUpdate);
  }, []);

  return { user, setUser };
}
