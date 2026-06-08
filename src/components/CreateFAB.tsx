import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Calendar, Lightbulb, Feather } from "lucide-react";
import { isUserAdmin } from "../lib/groups";

const OPTIONS_ALL = [
  { label: "Event", icon: Calendar, to: "/events/new" as const },
  { label: "Tip", icon: Lightbulb, to: "/tips/new" as const },
  { label: "Post", icon: Feather, to: "/posts/new" as const },
];

export default function CreateFAB() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const stored = typeof window !== "undefined" ? localStorage.getItem("eat_user_profile") : null;
  const profile = stored ? JSON.parse(stored) : null;
  const isAdmin = isUserAdmin(profile?.email || "");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!stored) return null;

  const path = window.location.pathname;
  const isEventPage = path === "/events" || path.startsWith("/events/");
  if (!isAdmin && isEventPage) return null;

  const OPTIONS = OPTIONS_ALL.filter((opt) =>
    opt.label === "Event" ? isAdmin : true
  );

  return (
    <div ref={ref} className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3">
      {OPTIONS.map((opt, i) => (
        <button
          key={opt.label}
          onClick={() => {
            setOpen(false);
            navigate({ to: opt.to });
          }}
          className="flex items-center gap-2.5 pl-4 pr-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(8px)",
            pointerEvents: open ? "auto" : "none",
            transition: `opacity 200ms ease-out, transform 200ms ease-out`,
            transitionDelay: open ? `${(OPTIONS.length - 1 - i) * 40}ms` : `${i * 40}ms`,
          }}
        >
          <opt.icon className="w-4 h-4 text-[var(--ember)]" />
          <span>{opt.label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close create menu" : "Open create menu"}
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-[var(--ember)] text-white shadow-lg hover:shadow-xl hover:brightness-110 active:brightness-95 transition-all flex items-center justify-center"
      >
        <Plus
          className={`w-6 h-6 transition-transform duration-200 ease-out ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
    </div>
  );
}
