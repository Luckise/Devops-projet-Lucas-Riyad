import { useState, useEffect, useCallback } from "react";
import { getServices } from "../di/container";
import type { UserProfile } from "../types/models";

const emptyUser: UserProfile = {
  firstName: "",
  lastName: "",
  nickname: "",
  email: "",
  avatar: "",
  isAdmin: false,
};

export function useUser() {
  const [user, setUserState] = useState<UserProfile>(emptyUser);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const profile = await getServices().authService.getCurrentUser();
      setUserState(profile);
    } catch {
      const saved = typeof window !== "undefined" ? localStorage.getItem("eat_user_profile") : null;
      if (saved) {
        setUserState(JSON.parse(saved));
      } else {
        setUserState(emptyUser);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("user-updated", onUpdate);
    return () => window.removeEventListener("user-updated", onUpdate);
  }, [refresh]);

  const setUser = async (updated: UserProfile) => {
    try {
      await getServices().authService.updateProfile(updated);
    } catch {
      // fall back to localStorage
    }
    if (updated.avatar && updated.avatar.startsWith("data:")) {
      localStorage.setItem("eat_avatar_data", updated.avatar);
    }
    localStorage.setItem("eat_user_profile", JSON.stringify(updated));
    setUserState(updated);
  };

  const logout = async () => {
    try {
      await getServices().authService.signOut();
    } catch {
      // fall back
    }
    localStorage.removeItem("eat_user_profile");
    setUserState(emptyUser);
  };

  return { user, setUser, logout, loading };
}
