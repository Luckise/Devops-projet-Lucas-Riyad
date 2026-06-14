import { useState, useEffect } from "react";
import { getServices } from "../di/container";
import { toast } from "../lib/toast";

function getEmail(): string {
  try {
    const saved = localStorage.getItem("eat_user_profile");
    return saved ? JSON.parse(saved).email : "";
  } catch {
    return "";
  }
}

export default function SaveButton({ eventId, compact }: { eventId: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const email = getEmail();
    if (email) {
      getServices().then((svc) => svc.eventService.isSaved(eventId, email).then(setSaved));
    }
  }, [eventId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const email = getEmail();
    if (!email) {
      toast("Please log in to follow events");
      return;
    }
    const next = await (await getServices()).eventService.toggleSaved(eventId, email);
    setSaved(next);
    toast(next ? "Followed" : "Unfollowed");
    window.dispatchEvent(new Event("data-changed"));
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
