import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { getServices } from "../di/container";
import { toast } from "../lib/toast";

export const Route = createFileRoute("/tips/new")({
  beforeLoad: async () => {
    try {
      await (await getServices()).authService.getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: TipCreate,
});

type ContentBlock = { type: "text" | "image"; value: string };
const CATEGORIES = ["Recipes", "Promotions", "Addresses", "Guides"] as const;

function TipCreate() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number] | "">("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [cookingTimeValue, setCookingTimeValue] = useState("");
  const [cookingTimeUnit, setCookingTimeUnit] = useState<"min" | "hour">("min");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [address, setAddress] = useState("");
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);

    const profile =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("eat_user_profile") || "{}")
        : {};

    const tip: Record<string, unknown> = {
      title,
      category,
      image,
      height: "aspect-[3/4]",
      content: content.filter((b) => b.value.trim()),
      authorEmail: profile.email || "",
    };

    if (category === "Recipes") {
      tip.cookingTime = cookingTimeValue ? `${cookingTimeValue} ${cookingTimeUnit}` : "";
      tip.ingredients = ingredients.filter(Boolean);
    }
    if (category === "Addresses") {
      tip.address = address;
    }

    await (await getServices()).tipService.create(tip as any);
    setSubmitting(false);
    toast("Tip created successfully");
    navigate({ to: "/tips" });
  };

  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const removeIngredient = (i: number) => {
    setIngredients((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  };
  const updateIngredient = (i: number, v: string) => {
    setIngredients((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  const addContentBlock = (type: "text" | "image") =>
    setContent((prev) => [...prev, { type, value: "" }]);
  const removeContentBlock = (i: number) =>
    setContent((prev) => prev.filter((_, idx) => idx !== i));
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
          <h1 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white">New Tip</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    category === cat
                      ? "bg-[var(--ember)] text-white border-[var(--ember)] shadow-sm"
                      : "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-[var(--ember)]/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <ImageUpload value={image} onChange={setImage} label="Image" />

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Donnez un titre à votre astuce"
              required
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
            />
          </div>

          {category === "Recipes" && (
            <>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
                  Cooking Time <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={cookingTimeValue}
                    onChange={(e) => setCookingTimeValue(e.target.value)}
                    placeholder="Durée (ex: 25)"
                    required
                    className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
                  />
                  <select
                    value={cookingTimeUnit}
                    onChange={(e) => setCookingTimeUnit(e.target.value as "min" | "hour")}
                    className="w-28 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow appearance-none"
                  >
                    <option value="min">minutes</option>
                    <option value="hour">heures</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Ingredients <span className="text-red-500">*</span>
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
                        placeholder={`Ingrédient ${idx + 1}`}
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
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse ou lieu (ex: Le Marais, 75003)"
                required
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Content <span className="text-red-500">*</span>
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
                      placeholder="Écrivez votre texte..."
                      rows={3}
                      className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow resize-none"
                    />
                  ) : (
                    <div className="flex-1">
                      <ImageUpload
                        value={block.value}
                        onChange={(v) => updateContentBlock(idx, v)}
                        compact
                      />
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
            {submitting ? "Creating..." : "Create Tip"}
          </button>
        </form>
      </div>
    </main>
  );
}
