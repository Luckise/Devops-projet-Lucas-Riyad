import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar, Ticket, Lightbulb, MessageSquareText, User, Users } from "lucide-react";
import { useUser } from "../hooks/use-user";

const BottomNav = memo(function BottomNav() {
  const { user } = useUser();

  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe"
      style={{ backgroundColor: "var(--header-bg)", borderTop: "1px solid var(--line)" }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-[4.5rem] px-2">
        <Link
          to="/"
          aria-label="Events"
          className="flex items-center justify-center p-3 transition-colors"
          style={{ color: "var(--charcoal-soft)" }}
          activeProps={{ style: { color: "var(--charcoal)" } }}
        >
          <Calendar className="w-6 h-6" />
        </Link>
        <Link
          to="/tickets"
          aria-label="Tickets"
          className="flex items-center justify-center p-3 transition-colors"
          style={{ color: "var(--charcoal-soft)" }}
          activeProps={{ style: { color: "var(--charcoal)" } }}
        >
          <Ticket className="w-6 h-6" />
        </Link>
        <Link
          to="/tips"
          aria-label="Tips"
          className="flex items-center justify-center p-3 transition-colors"
          style={{ color: "var(--charcoal-soft)" }}
          activeProps={{ style: { color: "var(--charcoal)" } }}
        >
          <Lightbulb className="w-6 h-6" />
        </Link>
        <Link
          to="/clubs"
          aria-label="Clubs"
          className="flex items-center justify-center p-3 transition-colors"
          style={{ color: "var(--charcoal-soft)" }}
          activeProps={{ style: { color: "var(--charcoal)" } }}
        >
          <Users className="w-6 h-6" />
        </Link>
        <Link
          to="/feed"
          aria-label="Feed"
          className="flex items-center justify-center p-3 transition-colors"
          style={{ color: "var(--charcoal-soft)" }}
          activeProps={{ style: { color: "var(--charcoal)" } }}
        >
          <MessageSquareText className="w-6 h-6" />
        </Link>
        <Link
          to="/profile"
          aria-label="Profile"
          className="flex items-center justify-center p-3 transition-colors group"
          style={{ color: "var(--charcoal-soft)" }}
          activeProps={{ style: { color: "var(--charcoal)" } }}
        >
          {user.avatar ? (
            <div className="w-6 h-6 rounded-full overflow-hidden transition-all">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-[.active]:opacity-100 transition-opacity"
              />
            </div>
          ) : (
            <User className="w-6 h-6" />
          )}
        </Link>
      </div>
    </nav>
  );
});

export default BottomNav;
