import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, X, Plus, Trash2, EyeOff } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { getServices } from "../di/container";
import { toast } from "../lib/toast";
import { getCurrentUser } from "aws-amplify/auth";

type ContentBlock = { type: "text" | "image"; value: string };

export const Route = createFileRoute("/profile/tips/$tipId/modify")({
  beforeLoad: async () => {
    try {
      await getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: ProfileTipEditRoute,
  loader: async ({ params }) => {
    const tip = await getServices().tipService.getById(params.tipId);
    if (!tip) throw new Error("Tip not found");
    return { tip };
  },
});

const CATEGORIES = ["Recipes", "Promotions", "Addresses", "Guides"] as const;

function ProfileTipEditRoute() {
  const { tip } = Route.useLoaderData();
  const navigate = useNavigate();

  const [title, setTitle] = useState(tip.title || "");
  const [image, setImage] = useState(tip.image || "");
  const [category] = useState<string>(tip.category || "");
  const parseCookingTime = (val: string) => {
    const match = val.match(/^(\d+)\s*(min|hour)$/);
    return match ? { value: match[1], unit: match[2] as "min" | "hour" } : { value: "", unit: "min" as const };
  };
  const parsed = parseCookingTime(tip.cookingTime || "");
  const [cookingTimeValue, setCookingTimeValue] = useState(parsed.value);
  const [cookingTimeUnit, setCookingTimeUnit] = useState<"min" | "hour">(parsed.unit);
  const [ingredients, setIngredients] = useState<string[]>(tip.ingredients?.length ? [...tip.ingredients] : [""]);
  const [address, setAddress] = useState(tip.address || "");
  const [content, setContent] = useState<ContentBlock[]>(tip.content?.length ? tip.content.map((b: any) => ({ type: b.type, value: b.value })) : []);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);

    const updates: Record<string, unknown> = {
      title,
      image,
      content: content.filter((b) => b.value.trim()),
    };

    if (category === "Recipes") {
      updates.cookingTime = cookingTimeValue ? `${cookingTimeValue} ${cookingTimeUnit}` : "";
      updates.ingredients = ingredients.filter(Boolean);
    }
    if (category === "Addresses") {
      updates.address = address;
    }

    await getServices().tipService.update(tip.id, updates as any);
    setSubmitting(false);
    toast("Tip updated");
    navigate({ to: "/profile/tips" });
  };

  const handleHide = () => setShowDeleteConfirm(true);

  const confirmHide = async () => {
    await getServices().tipService.hide(tip.id);
    setShowDeleteConfirm(false);
    toast("Tip hidden from feed");
    navigate({ to: "/profile/tips" });
  };

  const handleUnhide = async () => {
    await getServices().tipService.unhide(tip.id);
    toast("Tip is now visible");
    navigate({ to: "/profile/tips" });
  };

  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const removeIngredient = (i: number) => {
    setIngredients((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);
  };
  const updateIngredient = (i: number, v: string) => {
    setIngredients((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  const addContentBlock = (type: "text" | "image") => setContent((prev) => [...prev, { type, value: "" }]);
  const removeContentBlock = (i: number) => setContent((prev) => prev.filter((_, idx) => idx !== i));
  const updateContentBlock = (i: number, v: string) => {
    setContent((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], value: v };
      return next;
    });
  };

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-xl mx-auto px-5">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white">Edit Tip</h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ember)] mt-0.5">{category}</p>
          </div>
        </div>

        {tip.hidden && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 mb-6">
            <EyeOff className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">This tip is hidden from the feed</span>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          {tip.hidden ? (
            <button
              type="button"
              onClick={handleUnhide}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-[13px] hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              Show Tip
            </button>
          ) : (
            <button
              type="button"
              onClick={handleHide}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold text-[13px] hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hide Tip
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload value={image} onChange={setImage} label="Image" />

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your tip a name"
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
            />
          </div>

          {category === "Recipes" && (
            <>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
                  Cooking Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={cookingTimeValue}
                    onChange={(e) => setCookingTimeValue(e.target.value)}
                    placeholder="25"
                    className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
                  />
                  <select
                    value={cookingTimeUnit}
                    onChange={(e) => setCookingTimeUnit(e.target.value as "min" | "hour")}
                    className="w-28 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow appearance-none"
                  >
                    <option value="min">min</option>
                    <option value="hour">hour</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Ingredients
                  </label>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ember)] hover:text-[var(--ember)]/80 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
                <div className="space-y-2.5">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) => updateIngredient(idx, e.target.value)}
                        placeholder={`Ingredient ${idx + 1}`}
                        className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
                      />
                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4 text-zinc-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {category === "Addresses" && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Le Marais District, 75003"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Content
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addContentBlock("text")}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ember)] hover:text-[var(--ember)]/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock("image")}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ember)] hover:text-[var(--ember)]/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Image
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {content.map((block, idx) => (
                <div key={idx} className="flex gap-2">
                  {block.type === "text" ? (
                    <textarea
                      value={block.value}
                      onChange={(e) => updateContentBlock(idx, e.target.value)}
                      placeholder="Write your text..."
                      rows={3}
                      className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow resize-none"
                    />
                  ) : (
                    <div className="flex-1">
                      <ImageUpload value={block.value} onChange={(v) => updateContentBlock(idx, v)} compact />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeContentBlock(idx)}
                    className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !title}
            className="w-full py-4 px-6 rounded-full bg-[var(--ember)] text-white font-bold text-[15px] hover:bg-[var(--ember)]/90 disabled:opacity-50 transition-all shadow-lg shadow-[var(--ember)]/20"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-center text-zinc-900 dark:text-white mb-2">Hide this tip?</h3>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-6">
              The tip will be hidden from the public feed. You can still edit and manage it from My Tips.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmHide}
                className="flex-1 py-3 px-4 rounded-full bg-red-600 text-white font-bold text-[13px] hover:bg-red-700 transition-colors"
              >
                Hide Tip
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
