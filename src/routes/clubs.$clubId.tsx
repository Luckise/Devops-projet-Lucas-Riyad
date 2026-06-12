import { createFileRoute } from "@tanstack/react-router";
import { getGroup } from "../lib/groups";
import { ArrowLeft, Users } from "lucide-react";

export const Route = createFileRoute("/clubs/$clubId")({
  component: ClubDetailRoute,
  loader: ({ params }) => {
    const club = getGroup(params.clubId);
    if (!club) throw new Error("Club not found");
    return { club };
  },
});

function ClubDetailRoute() {
  const { club } = Route.useLoaderData();

  return (
    <main className="min-h-screen pb-24 bg-white dark:bg-zinc-950">
      <div className="relative h-[45vh] w-full bg-zinc-900">
        <img
          src={club.image}
          alt={club.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-zinc-950" />

        <div className="absolute top-0 left-0 w-full p-4 pt-[4.5rem] flex justify-between items-center z-10">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 -mt-16 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-serif font-medium leading-[1.1] text-zinc-900 dark:text-white tracking-tight">
            {club.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-zinc-500 dark:text-zinc-400 mb-8">
          <Users className="w-4 h-4" />
          <span>
            {club.members.length} {club.members.length === 1 ? "member" : "members"}
          </span>
        </div>

        {club.content && club.content.length > 0 && (
          <div className="mb-12 space-y-6">
            {club.content.map((block, idx) => {
              if (block.type === "text") {
                return (
                  <p
                    key={idx}
                    className="text-[16px] leading-relaxed text-zinc-700 dark:text-zinc-300"
                  >
                    {block.value}
                  </p>
                );
              } else if (block.type === "image") {
                return (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm"
                  >
                    <img
                      src={block.value}
                      alt=""
                      className="w-full h-auto object-cover max-h-[500px]"
                      loading="lazy"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </main>
  );
}
