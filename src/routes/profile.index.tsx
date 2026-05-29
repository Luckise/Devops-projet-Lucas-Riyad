import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { Settings, Bell, ChevronRight, Edit3, User, Shield, Calendar, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useUser } from "../hooks/use-user";

export const Route = createFileRoute("/profile/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !localStorage.getItem("eat_user_profile")) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProfileRoute,
});

function ProfileRoute() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("eat_user_profile");
    window.dispatchEvent(new Event("user-updated"));
    navigate({ to: "/login" });
  };

  return (
    <main className="min-h-screen pb-24 pt-[80px] bg-[#fdfdfc] dark:bg-zinc-950">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <header className="mb-8">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-1.5 ml-0.5">
            Account
          </p>
          <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white">
            Profile
          </h1>
        </header>

        <div className="flex items-center gap-5 mb-10 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-black/40 dark:text-white/40" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white truncate">{user.firstName} {user.lastName}</h2>
            <p className="text-[var(--ember)] font-medium text-sm mt-0.5 truncate">{user.nickname}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5 truncate">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Modify Information */}
          <Link
            to="/profile/edit"
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-white/10 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--ember)]/10 flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-[var(--ember)]" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-white">Modify my Information</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </Link>

          {/* My Tips */}
          <Link
            to="/profile/tips"
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-white/10 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-white">My Tips</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </Link>

          {/* My Events */}
          {user.isAdmin && (
            <Link
              to="/profile/events"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">My Events</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </Link>
          )}

          {/* My Groups */}
          {user.isAdmin && (
            <Link
              to="/profile/groups"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">My Groups</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </Link>
          )}

          {/* Notifications Toggle */}
          <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm cursor-pointer" onClick={() => setNotifications(!notifications)}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Bell className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-white">Notifications</span>
            </div>
            {/* Custom Switch */}
            <button 
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex ${notifications ? 'bg-[var(--ember)]' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${notifications ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Settings */}
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <span className="font-medium text-zinc-900 dark:text-white">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/10">
          <button onClick={handleLogout} className="w-full text-center text-red-500 font-medium hover:text-red-600 transition-colors py-2">
            Log Out
          </button>
        </div>
      </div>
    </main>
  );
}
