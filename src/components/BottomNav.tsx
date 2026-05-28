import { Link } from "@tanstack/react-router";
import { Calendar, Ticket, Lightbulb, MessageSquareText, User } from "lucide-react";
import { useUser } from "../hooks/use-user";

export default function BottomNav() {
  const { user } = useUser();

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-black/10 dark:border-white/10 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-[4.5rem] px-2">
        <Link
          to="/"
          className="flex items-center justify-center p-3 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 [&.active]:text-black dark:[&.active]:text-white transition-colors"
          activeProps={{ className: "active" }}
        >
          <Calendar className="w-6 h-6" />
        </Link>
        <Link
          to="/tickets"
          className="flex items-center justify-center p-3 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 [&.active]:text-black dark:[&.active]:text-white transition-colors"
          activeProps={{ className: "active" }}
        >
          <Ticket className="w-6 h-6" />
        </Link>
        <Link
          to="/tips"
          className="flex items-center justify-center p-3 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 [&.active]:text-black dark:[&.active]:text-white transition-colors"
          activeProps={{ className: "active" }}
        >
          <Lightbulb className="w-6 h-6" />
        </Link>
        <Link
          to="/feed"
          className="flex items-center justify-center p-3 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 [&.active]:text-black dark:[&.active]:text-white transition-colors"
          activeProps={{ className: "active" }}
        >
          <MessageSquareText className="w-6 h-6" />
        </Link>
        <Link
          to="/profile"
          className="flex items-center justify-center p-3 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 [&.active]:text-black dark:[&.active]:text-white transition-colors group"
          activeProps={{ className: "active" }}
        >
          {user.avatar ? (
            <div className="w-6 h-6 rounded-full overflow-hidden transition-all">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-[.active]:opacity-100 transition-opacity" />
            </div>
          ) : (
            <User className="w-6 h-6" />
          )}
        </Link>
      </div>
    </nav>
  );
}
