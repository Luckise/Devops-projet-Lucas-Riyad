import { createFileRoute } from "@tanstack/react-router";
import { getServices } from "../di/container";
import { ArrowLeft, Clock, ChefHat, MapPin } from "lucide-react";

export const Route = createFileRoute("/tips/$tipId")({
  component: TipDetailsRoute,
  loader: async ({ params }) => {
    const tip = await (await getServices()).tipService.getById(params.tipId);
    if (!tip) throw new Error("Tip not found");
    return { tip };
  },
});

function TipDetailsRoute() {
  const { tip } = Route.useLoaderData();

  return (
    <main className="min-h-screen pb-24 bg-white dark:bg-zinc-950">
      <div className="relative h-[55vh] w-full bg-zinc-900">
        <img
          src={tip.image}
          alt={tip.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent h-full w-full" />

        <div className="absolute top-0 left-0 w-full p-4 pt-[4.5rem] flex justify-between items-center z-10">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-11 h-11 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/30 dark:hover:bg-black/40 transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 -mt-10 relative z-10">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-[11px] font-bold tracking-wide uppercase text-[var(--ember)] border border-[var(--ember)]/20">
            {tip.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1] text-zinc-900 dark:text-white mb-6 tracking-tight">
          {tip.title}
        </h1>

        {tip.category === "Recipes" && (
          <div className="mb-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
                <Clock className="w-5 h-5 text-[var(--ember)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Cooking Time
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{tip.cookingTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
                <ChefHat className="w-5 h-5 text-[var(--ember)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Ingredients
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {tip.ingredients?.length} items
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
              <ul className="space-y-3">
                {tip.ingredients?.map((ingredient, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[15px] text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--ember)]/50 mt-2 shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tip.category === "Addresses" && tip.address && (
          <div className="mb-8">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
              <MapPin className="w-5 h-5 text-[var(--ember)] mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Location
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{tip.address}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-12 space-y-6">
          {tip.content?.map((block, idx) => {
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
      </div>
    </main>
  );
}
