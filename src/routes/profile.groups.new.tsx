import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { createGroup, saveClubPage } from "../lib/groups";
import { toast } from "../lib/toast";
import { getServices } from "../di/container";

type ContentBlock = { type: "text" | "image"; value: string };

export const Route = createFileRoute("/profile/groups/new")({
  beforeLoad: async () => {
    try {
      await (await getServices()).authService.getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: ClubCreate,
});

function ClubCreate() {
  const navigate = useNavigate();
  const stored = typeof window !== "undefined" ? localStorage.getItem("eat_user_profile") : null;
  const profile = stored ? JSON.parse(stored) : null;
  const email = profile?.email || "";

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    if (!image) {
      toast("Please add a cover image");
      setSubmitting(false);
      return;
    }

    const group = createGroup(name.trim(), email);
    saveClubPage(
      group.id,
      image,
      content.filter((b) => b.value.trim()),
    );

    setSubmitting(false);
    toast("Club created");
    navigate({ to: "/profile/groups" });
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
          <h1 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white">
            New Club
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload value={image} onChange={setImage} label="Cover Image" />

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Donnez un nom à votre club"
              required
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
            />
          </div>

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
            disabled={submitting || !name.trim()}
            className="w-full py-4 px-6 rounded-full bg-[var(--ember)] text-white font-bold text-[15px] hover:bg-[var(--ember)]/90 disabled:opacity-50 transition-all shadow-lg shadow-[var(--ember)]/20"
          >
            {submitting ? "Creating..." : "Create Club"}
          </button>
        </form>
      </div>
    </main>
  );
}
