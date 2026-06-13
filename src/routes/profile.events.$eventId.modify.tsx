import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, X, Plus, ChevronDown, Trash2, Users, Search, EyeOff } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { getServices } from "../di/container";
import { toast } from "../lib/toast";
import { useUser } from "../hooks/use-user";

export const Route = createFileRoute("/profile/events/$eventId/modify")({
  beforeLoad: async () => {
    try {
      const profile = await (await getServices()).authService.getCurrentUser();
      if (!profile.isAdmin) throw redirect({ to: "/profile" });
    } catch (err) {
      if (err instanceof redirect) throw err;
      throw redirect({ to: "/login" });
    }
  },
  component: ProfileEventEditRoute,
  loader: async ({ params }) => {
    const event = await (await getServices()).eventService.findEvent(params.eventId);
    if (!event) throw new Error("Event not found");
    return { event };
  },
});

function ProfileEventEditRoute() {
  const { event } = Route.useLoaderData();
  const navigate = useNavigate();
  const { user } = useUser();
  const [title, setTitle] = useState(event.title || "");
  const [image, setImage] = useState(event.image || "");
  const [date, setDate] = useState(event.date || "");
  const [time, setTime] = useState(event.time || "");
  const [location, setLocation] = useState(event.location || "");
  const [price, setPrice] = useState(event.price?.toString() || "");
  const [maxParticipants, setMaxParticipants] = useState(event.maxParticipants?.toString() || "");
  const [description, setDescription] = useState(event.description || "");
  const [tags, setTags] = useState<string[]>(event.tags?.length ? event.tags : [""]);
  const [selectedGroup, setSelectedGroup] = useState(event.groupId || "");
  const [submitting, setSubmitting] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userGroups, setUserGroups] = useState<any[]>([]);

  useEffect(() => {
    if (user.email) {
      getServices().then((svc) => svc.groupService.getUserGroups(user.email).then(setUserGroups));
    }
  }, [user.email]);

  const attendees: string[] = event.attendees || [];
  const filteredAttendees = searchQuery
    ? attendees.filter((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
    : attendees;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location || !selectedGroup) return;
    setSubmitting(true);

    await (
      await getServices()
    ).eventService.update(event.id, {
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
    } as any);

    setSubmitting(false);
    toast("Event updated");
    window.dispatchEvent(new Event("data-changed"));
    navigate({ to: "/profile/events" });
  };

  const handleHide = () => setShowDeleteConfirm(true);

  const confirmHide = async () => {
    await (await getServices()).eventService.hide(event.id);
    setShowDeleteConfirm(false);
    toast("Event hidden from feed");
    window.dispatchEvent(new Event("data-changed"));
    navigate({ to: "/profile/events" });
  };

  const handleUnhide = async () => {
    await (await getServices()).eventService.unhide(event.id);
    toast("Event is now visible");
    window.dispatchEvent(new Event("data-changed"));
    navigate({ to: "/profile/events" });
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
              Edit Event
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ember)] mt-0.5">
              Admin
            </p>
          </div>
        </div>

        {event.hidden && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 mb-6">
            <EyeOff className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
              This event is hidden from the feed
            </span>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => setShowAttendees(!showAttendees)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
          >
            <Users className="w-4 h-4" />
            {attendees.length} Attendee{attendees.length !== 1 ? "s" : ""}
          </button>
          {event.hidden ? (
            <button
              type="button"
              onClick={handleUnhide}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-[13px] hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              Show Event
            </button>
          ) : (
            <button
              type="button"
              onClick={handleHide}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold text-[13px] hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Event
            </button>
          )}
        </div>

        {showAttendees && (
          <div className="mb-8 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">
              Attendees ({attendees.length})
            </h3>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendees..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/30 transition-shadow"
              />
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {filteredAttendees.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-6">
                  {searchQuery ? "No matching attendees" : "No attendees yet"}
                </p>
              ) : (
                filteredAttendees.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--ember)]/10 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-[var(--ember)]" />
                    </div>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {a}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

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
                Tags <span className="text-red-500">*</span>
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
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !title || !date || !time || !location || !selectedGroup}
              className="flex-1 py-4 px-6 rounded-full bg-[var(--ember)] text-white font-bold text-[15px] hover:bg-[var(--ember)]/90 disabled:opacity-50 transition-all shadow-lg shadow-[var(--ember)]/20"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-center text-zinc-900 dark:text-white mb-2">
              Hide this event?
            </h3>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-6">
              The event will be hidden from the public feed.
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
                Hide Event
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
