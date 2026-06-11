import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, Lightbulb, EyeOff } from "lucide-react";
import { getServices } from "../di/container";
import { getCurrentUser } from "aws-amplify/auth";

export const Route = createFileRoute("/profile/tips")({
  beforeLoad: async () => {
    try {
      await getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: ProfileTipsRoute,
});

function ProfileTipsRoute() {
  const matches = useRouterState({ select: (s) => s.matches });
  const hasChild = matches.some(
    (m) => m.routeId !== "__root__" && m.routeId !== "/profile/tips"
  );
  const stored = typeof window !== "undefined" ? localStorage.getItem("eat_user_profile") : null;
  const profile = stored ? JSON.parse(stored) : null;
  const email = profile?.email || "";

  const [tips, setTips] = useState<any[]>([]);

  useEffect(() => {
    if (hasChild) return;
    getServices().tipService.getAll().then((all) => {
      const mine = all.filter((t) => t.authorEmail === email);
      setTips(mine);
    });
  }, [hasChild, email]);

  if (hasChild) return <Outlet />;

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-white/10 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white">My Tips</h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ember)] mt-0.5">
              {tips.length} tip{tips.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {tips.length === 0 ? (
          <div className="text-center py-16">
            <Lightbulb className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">You haven't written any tips yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tips.map((tip) => (
              <Link
                key={tip.id}
                to="/profile/tips/$tipId/modify"
                params={{ tipId: tip.id }}
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-white/10 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {tip.hidden ? (
                    <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <EyeOff className="w-4 h-4 text-zinc-400" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-white truncate">{tip.title}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {tip.category}
                      {tip.hidden && <span className="text-red-400 ml-2">Hidden</span>}
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 ml-3">
                  <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
