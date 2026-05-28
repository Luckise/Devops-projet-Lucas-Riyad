import { Link } from "@tanstack/react-router";
import { Home, Calendar, Lightbulb, User } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-[4.5rem] px-2">
        <Link
          to="/"
          className="flex flex-col items-center gap-1.5 p-2 text-white/40 hover:text-white/70 [&.active]:text-white transition-colors"
          activeProps={{ className: "active" }}
        >
          <Home className="w-[1.375rem] h-[1.375rem]" />
          <span className="text-[10px] font-bold tracking-wide uppercase">Home</span>
        </Link>
        <Link
          to="/events"
          className="flex flex-col items-center gap-1.5 p-2 text-white/40 hover:text-white/70 [&.active]:text-white transition-colors"
          activeProps={{ className: "active" }}
        >
          <Calendar className="w-[1.375rem] h-[1.375rem]" />
          <span className="text-[10px] font-bold tracking-wide uppercase">Events</span>
        </Link>
        <Link
          to="/tips"
          className="flex flex-col items-center gap-1.5 p-2 text-white/40 hover:text-white/70 [&.active]:text-white transition-colors"
          activeProps={{ className: "active" }}
        >
          <Lightbulb className="w-[1.375rem] h-[1.375rem]" />
          <span className="text-[10px] font-bold tracking-wide uppercase">Tips</span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center gap-1.5 p-2 text-white/40 hover:text-white/70 [&.active]:text-white transition-colors"
          activeProps={{ className: "active" }}
        >
          <User className="w-[1.375rem] h-[1.375rem]" />
          <span className="text-[10px] font-bold tracking-wide uppercase">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
