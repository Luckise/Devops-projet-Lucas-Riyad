import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getAllClubs } from "../lib/groups";
import { Search, X, Users } from "lucide-react";
import type { Group } from "../lib/groups";

export const Route = createFileRoute("/clubs/")({
  component: ClubsRoute,
});

function ClubsRoute() {
  const [searchQuery, setSearchQuery] = useState("");

  const clubs: Group[] = getAllClubs().filter((c) => c.image);

  const filtered = searchQuery
    ? clubs.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : clubs;

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <header className="mb-6">
          <h1
            className="text-[2.5rem] font-serif font-medium tracking-tight leading-none"
            style={{ color: "var(--ember)" }}
          >
            Clubs
          </h1>
        </header>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clubs..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              {searchQuery ? "No clubs match your search" : "No clubs yet"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-sm text-[var(--ember)] font-medium hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((club) => (
              <Link
                key={club.id}
                to="/clubs/$clubId"
                params={{ clubId: club.id }}
                className="group block rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] active:scale-[0.98]"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h2 className="font-bold text-[17px] text-zinc-900 dark:text-white group-hover:text-[var(--ember)] transition-colors">
                    {club.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[13px]">
                    <Users className="w-4 h-4" />
                    <span>{club.members.length}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
