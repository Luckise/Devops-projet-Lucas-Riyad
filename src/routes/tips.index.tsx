import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getServices } from "../di/container";
import type { Tip } from "../types/models";

export const Route = createFileRoute("/tips/")({
  beforeLoad: async () => {
    try {
      await (await getServices()).authService.getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: TipsRoute,
});

const CATEGORIES = ["All", "Recipes", "Promotions", "Addresses", "Guides"];

function TipsRoute() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [allTips, setAllTips] = useState<Tip[]>([]);

  useEffect(() => {
    getServices().then((svc) => svc.tipService.getAll().then(setAllTips));
  }, []);

  const filteredTips = allTips.filter(
    (tip) => (activeCategory === "All" || tip.category === activeCategory) && !tip.hidden,
  );

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 md:pt-4">
        <header className="mb-4">
          <h1
            className="text-[2.5rem] font-serif font-medium tracking-tight leading-none"
            style={{ color: "var(--ember)" }}
          >
            Tips
          </h1>
        </header>

        <div className="sticky top-[4rem] z-30 -mx-4 px-4 mb-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
          <div
            className="flex gap-2 overflow-x-auto py-3 scrollbar-none snap-x"
            style={{ scrollbarWidth: "none" }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-[var(--ember)] text-white border-[var(--ember)] shadow-[0_0_15px_var(--ember)/0.3]"
                    : "bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10 hover:bg-[var(--ember)]/10 hover:text-[var(--ember)] hover:border-[var(--ember)]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-2 gap-3 space-y-3">
          {filteredTips.map((tip) => (
            <Link
              to="/tips/$tipId"
              params={{ tipId: tip.id }}
              key={tip.id}
              className="block break-inside-avoid group cursor-pointer"
            >
              <article>
                <div className="relative rounded-[1.5rem] overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 transform transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] active:scale-[0.98]">
                  <div className={`w-full ${tip.height}`}>
                    <img
                      src={tip.image}
                      alt={tip.title}
                      className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold tracking-wide uppercase text-white border border-white/20 shadow-sm">
                      {tip.category}
                    </span>
                  </div>
                </div>
                <div className="mt-2 px-1">
                  <h3 className="text-[14px] font-medium leading-snug text-black/90 dark:text-white/90 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {tip.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-16 px-6 mt-8 rounded-[2rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            <p className="text-black/60 dark:text-white/60 text-lg font-serif font-medium">
              No tips found.
            </p>
            <p className="text-black/40 dark:text-white/40 text-sm mt-2 font-medium">
              We're still gathering recommendations for this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
