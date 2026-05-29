import { useState } from "react";
import { isEventSaved, toggleSavedEvent } from "../lib/mock-data";
import { toast } from "../lib/toast";

export default function SaveButton({ eventId, compact }: { eventId: string; compact?: boolean }) {
  const [saved, setSaved] = useState(() => isEventSaved(eventId));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleSavedEvent(eventId);
    setSaved(next);
    toast(next ? "Added to watchlist" : "Removed from watchlist");
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
        className={`min-w-[40px] h-10 rounded-full flex items-center justify-center transition-all duration-200 ease-out border px-3 ${
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
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
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
