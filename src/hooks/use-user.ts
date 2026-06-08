import { useState, useEffect, useCallback } from "react";
import { getCurrentUser, fetchUserAttributes, signOut, updateUserAttribute } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { isUserAdmin } from "../lib/groups";
import { defaultUser } from "../lib/user-defaults";
import type { UserProfile } from "../lib/user-defaults";
import "../lib/amplify";

function deriveProfile(attrs: Record<string, any>, email: string): UserProfile {
  const avatar = attrs.picture || defaultUser.avatar;
  return {
    firstName: attrs.given_name || "",
    lastName: attrs.family_name || "",
    nickname: attrs.nickname || "",
    email,
    avatar,
    isAdmin: isUserAdmin(email),
  };
}

async function fetchProfile(): Promise<UserProfile> {
  try {
    const user = await getCurrentUser();
    const attrs = await fetchUserAttributes();
    const email = attrs.email || user.userId;
    return deriveProfile(attrs, email);
  } catch {
    const saved = typeof window !== "undefined" ? localStorage.getItem("eat_user_profile") : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, isAdmin: isUserAdmin(parsed.email || "") };
    }
    return defaultUser;
  }
}

export function useUser() {
  const [user, setUserState] = useState<UserProfile>(defaultUser);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const profile = await fetchProfile();
    setUserState(profile);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn" || payload.event === "signedOut") {
        refresh();
      }
    });
    return () => unsubscribe();
  }, [refresh]);

  const setUser = async (updated: UserProfile) => {
    const updates: { attributeKey: string; value: string }[] = [];
    if (updated.firstName) updates.push({ attributeKey: "given_name", value: updated.firstName });
    if (updated.lastName) updates.push({ attributeKey: "family_name", value: updated.lastName });
    if (updated.nickname) updates.push({ attributeKey: "nickname", value: updated.nickname });
    if (updated.avatar && !updated.avatar.startsWith("data:")) {
      updates.push({ attributeKey: "picture", value: updated.avatar });
    }
    try {
      await Promise.all(updates.map((u) => updateUserAttribute({ userAttribute: u })));
    } catch {
      // If Cognito isn't configured, fall back to localStorage
    }
    if (updated.avatar && updated.avatar.startsWith("data:")) {
      localStorage.setItem("eat_avatar_data", updated.avatar);
    }
    localStorage.setItem("eat_user_profile", JSON.stringify(updated));
    setUserState({ ...updated, isAdmin: isUserAdmin(updated.email) });
  };

  const logout = async () => {
    try {
      await signOut();
    } catch {
      // If Cognito isn't configured, fall back
    }
    localStorage.removeItem("eat_user_profile");
    setUserState(defaultUser);
  };

  return { user, setUser, logout, loading };
}
