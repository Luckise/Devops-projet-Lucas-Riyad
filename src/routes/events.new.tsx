import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, X, Plus, ChevronDown } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { getServices } from "../di/container";
import { toast } from "../lib/toast";
import { useUser } from "../hooks/use-user";

export const Route = createFileRoute("/events/new")({
  beforeLoad: async () => {
    try {
      const profile = await (await getServices()).authService.getCurrentUser();
      if (!profile.isAdmin) throw redirect({ to: "/" });
    } catch (err) {
      if (err instanceof redirect) throw err;
      throw redirect({ to: "/login" });
    }
  },
  component: EventCreate,
});

function EventCreate() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([""]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);

  useEffect(() => {
    if (user.email) {
      getServices().then((svc) => svc.groupService.getUserGroups(user.email).then(setUserGroups));
    }
  }, [user.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location || !selectedGroup) return;
    setSubmitting(true);

    await (
      await getServices()
    ).eventService.create({
      title,
      image,
      date,
      time,
      location,
      price: price ? parseFloat(price) : 0,
      description,
      tags: tags.filter(Boolean),
      maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : 0,
      groupId: selectedGroup,
      joined: 0,
      isPast: false,
      hidden: false,
      attendees: [],
    });

    setSubmitting(false);
    toast("Event created successfully");
    window.dispatchEvent(new Event("data-changed"));
    navigate({ to: "/events" });
  };

  const addTag = () => setTags((prev) => [...prev, ""]);
  const removeTag = (i: number) => {
    setTags((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  };
  const updateTag = (i: number, v: string) => {
    setTags((prev) => {
      const next = [...prev];
      next[i] = v;
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
            <h1 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white">
              New Event
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ember)] mt-0.5">
              Admin
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload value={image} onChange={setImage} label="Image" />

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Donnez un titre à votre événement"
              required
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="JJ/MM/AAAA"
                required
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="HH:MM"
                required
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Adresse ou lieu de l'événement"
              required
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
                Price (EUR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Prix en € (0 = gratuit)"
                required
                min="0"
                step="0.5"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
                Max Participants <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="Nombre max de participants"
                required
                min="1"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 block">
              Group <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow appearance-none"
              >
                <option value="">Choisir un groupe</option>
                {userGroups.map((g: any) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Tags
              </label>
              <button
                type="button"
                onClick={addTag}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--ember)] hover:text-[var(--ember)]/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="space-y-2.5">
              {tags.map((tag, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(idx, e.target.value)}
                    placeholder={`Tag ${idx + 1}`}
                    className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(idx)}
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
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez en détail votre événement..."
              required
              rows={5}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !title || !date || !time || !location}
            className="w-full py-4 px-6 rounded-full bg-[var(--ember)] text-white font-bold text-[15px] hover:bg-[var(--ember)]/90 disabled:opacity-50 transition-all shadow-lg shadow-[var(--ember)]/20"
          >
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}
