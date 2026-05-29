import { useState, useEffect } from 'react';
import { isUserAdmin } from '../lib/groups';

const USER_KEY = 'eat_user_profile';

export const defaultUser = {
  firstName: 'Alex',
  lastName: 'Kim',
  nickname: '@alexk',
  email: 'alex.kim@example.com',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
  isAdmin: false,
};

export type UserProfile = typeof defaultUser;

function deriveProfile(raw: any): UserProfile {
  return {
    ...raw,
    isAdmin: isUserAdmin(raw.email || ''),
  };
}

export function useUser() {
  const [user, setUserState] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) return deriveProfile(JSON.parse(saved));
    }
    return defaultUser;
  });

  const setUser = (newUser: UserProfile) => {
    const enriched = deriveProfile(newUser);
    setUserState(enriched);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(enriched));
      window.dispatchEvent(new Event('user-updated'));
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) setUserState(deriveProfile(JSON.parse(saved)));
    };
    window.addEventListener('user-updated', handleUpdate);
    return () => window.removeEventListener('user-updated', handleUpdate);
  }, []);

  return { user, setUser };
}
