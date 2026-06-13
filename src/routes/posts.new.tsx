import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Calendar, MapPin, Check } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { getServices } from "../di/container";
import { toast } from "../lib/toast";
import type { Event } from "../types/models";
import { useUser } from "../hooks/use-user";

export const Route = createFileRoute("/posts/new")({
  beforeLoad: async () => {
    try {
      await (await getServices()).authService.getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: PostCreate,
});

type ContentBlock = { type: "text" | "image"; value: string };

function PostCreate() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [content, setContent] = useState<ContentBlock[]>([{ type: "text", value: "" }]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    getServices().then((svc) => svc.eventService.getAll().then(setAllEvents));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filledContent = content.filter((b) => b.value.trim());
    const hasText = filledContent.some((b) => b.type === "text");
    if (!selectedEventId || !hasText) return;
    setSubmitting(true);

    const post = {
      content: filledContent,
      eventId: selectedEventId,
      createdAt: new Date().toISOString().split("T")[0],
      authorEmail: user.email || "",
    };

    await (await getServices()).postService.create(post as any);
    setSubmitting(false);
    toast("Post published successfully");
    navigate({ to: "/feed" });
  };

  const addContentBlock = (type: "text" | "image") => setContent([...content, { type, value: "" }]);
  const removeContentBlock = (i: number) => {
    if (content.length > 1) setContent(content.filter((_, idx) => idx !== i));
  };
  const updateContentBlock = (i: number, v: string) => {
    const next = [...content];
    next[i] = { ...next[i], value: v };
    setContent(next);
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
            <h1 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white">
              New Post
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Écrivez votre message..."
                      rows={4}
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
                  {content.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContentBlock(idx)}
                      className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shrink-0"
                    >
                      <X className="w-4 h-4 text-zinc-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
              Link to Event <span className="text-red-500">*</span>
            </label>
            <div className="max-h-[280px] overflow-y-auto space-y-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-2 border border-zinc-200 dark:border-zinc-800">
              {allEvents.length === 0 && (
                <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-6">
                  Aucun événement pour le moment disponible
                </p>
              )}
              {allEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEventId(event.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    selectedEventId === event.id
                      ? "bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-[var(--ember)]/20"
                      : "hover:bg-white/50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 shrink-0">
                    <img
                      src={event.image}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date}</span>
                      <MapPin className="w-3 h-3 ml-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  {selectedEventId === event.id && (
                    <Check className="w-4 h-4 text-[var(--ember)] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              submitting ||
              !selectedEventId ||
              content.every((b) => b.type !== "text" || !b.value.trim())
            }
            className="w-full py-4 px-6 rounded-full bg-[var(--ember)] text-white font-bold text-[15px] hover:bg-[var(--ember)]/90 disabled:opacity-50 transition-all shadow-lg shadow-[var(--ember)]/20"
          >
            {submitting ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </main>
  );
}
