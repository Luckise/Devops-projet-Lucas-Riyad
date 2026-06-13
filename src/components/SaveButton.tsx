import { useState, useEffect } from "react";
import { toast } from "../lib/toast";

const STORAGE_KEY = "eat_followed_events";

function getFollowed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function toggleFollow(eventId: string): boolean {
  const followed = getFollowed();
  const idx = followed.indexOf(eventId);
  if (idx === -1) {
    followed.push(eventId);
  } else {
    followed.splice(idx, 1);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(followed));
  return idx === -1;
}

export default function SaveButton({ eventId, compact }: { eventId: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getFollowed().includes(eventId));
  }, [eventId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowFollowed = toggleFollow(eventId);
    setSaved(isNowFollowed);
    toast(isNowFollowed ? "Followed" : "Unfollowed");
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? "Unfollow" : "Follow"}
        className={`min-w-[44px] h-11 rounded-full flex items-center justify-center transition-all duration-200 ease-out border px-3 ${
          saved
            ? "bg-[var(--ember)] text-white border-[var(--ember)] shadow-[0_0_12px_var(--ember)/0.4]"
            : "bg-black/40 backdrop-blur-md text-white border-white/20 hover:bg-black/60 hover:border-white/40"
        }`}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
          {saved ? "Followed" : "Follow"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Unfollow" : "Follow"}
      className={`min-w-[48px] h-12 rounded-full flex items-center justify-center transition-all duration-200 ease-out shrink-0 border-2 px-4 ${
        saved
          ? "bg-[var(--ember)] text-white border-[var(--ember)] shadow-[0_0_12px_var(--ember)/0.4]"
          : "bg-transparent text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600 hover:border-[var(--ember)]/50 hover:text-[var(--ember)]"
      }`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
        {saved ? "Followed" : "Follow"}
      </span>
    </button>
  );
}
