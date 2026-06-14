import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  MessageCircle,
  Heart,
  Share,
  Calendar as CalendarIcon,
  Trash2,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { getServices } from "../di/container";
import { toast } from "../lib/toast";
import { useUser } from "../hooks/use-user";
import { formatDate, formatTime } from "../lib/date-utils";
import type { Event, Post, ContentBlock } from "../types/models";

export const Route = createFileRoute("/feed")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !localStorage.getItem("eat_user_profile")) {
      throw redirect({ to: "/login" });
    }
  },
  component: FeedRoute,
});

function renderContent(content: ContentBlock[] | string): string {
  if (typeof content === "string") return content;
  return content
    .filter((b) => b.type === "text" && b.value.trim())
    .map((b) => b.value)
    .join("\n");
}

function FeedRoute() {
  const { user } = useUser();
  const [tab, setTab] = useState<"global" | "myevents">("global");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletedPostIds, setDeletedPostIds] = useState<string[]>([]);
  const [myEventIds, setMyEventIds] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const userEmail =
      user.email ||
      (() => {
        try {
          const saved = localStorage.getItem("eat_user_profile");
          return saved ? JSON.parse(saved).email : "";
        } catch {
          return "";
        }
      })();
    const onRefresh = () => {
      getServices().then((svc) => {
        if (userEmail) {
          svc.eventService.getMyEventIds(userEmail).then(setMyEventIds);
        }
        svc.eventService.getAll().then(setEvents);
        svc.postService.getAll().then(setPosts);
      });
    };
    const saved = localStorage.getItem("eat_deleted_posts");
    if (saved) setDeletedPostIds(JSON.parse(saved));
    onRefresh();
    window.addEventListener("data-changed", onRefresh);
    return () => window.removeEventListener("data-changed", onRefresh);
  }, []);

  const userEmail = user.email || "";

  const myEvents = useMemo(() => {
    if (tab !== "myevents") return [];
    return events.filter((e) => myEventIds.includes(e.id));
  }, [events, tab, myEventIds]);

  const allPosts = useMemo(() => {
    return posts
      .filter((p) => !deletedPostIds.includes(p.id))
      .filter((p) => {
        if (tab === "global") return true;
        return p.eventId && myEventIds.includes(p.eventId);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, tab, deletedPostIds, myEventIds]);

  const handleDeletePost = (postId: string) => {
    const nextDeleted = [...deletedPostIds, postId];
    setDeletedPostIds(nextDeleted);
    localStorage.setItem("eat_deleted_posts", JSON.stringify(nextDeleted));
    setDeleteConfirmId(null);
    toast("Post deleted");
  };

  const getAuthorName = (email?: string) => {
    if (!email) return "Anonymous";
    if (email === user.email) return `${user.firstName} ${user.lastName}`.trim() || email;
    return email.split("@")[0];
  };

  const getAuthorAvatar = (email?: string) => {
    if (email === user.email && user.avatar) return user.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getAuthorName(email))}&background=var(--ember)&color=fff&size=150`;
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <main className="min-h-screen pb-20 pt-[60px] md:pt-[80px]">
      <div className="max-w-xl mx-auto border-x border-black/10 dark:border-white/10 min-h-screen">
        {/* Filter Tabs */}
        <div className="sticky top-[4rem] z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("global")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === "global"
                  ? "bg-[var(--ember)] text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setTab("myevents")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === "myevents"
                  ? "bg-[var(--ember)] text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              My events
            </button>
          </div>
        </div>

        {tab === "myevents" && myEvents.length > 0 && (
          <div className="flex flex-col">
            {myEvents.map((event) => (
              <Link
                key={event.id}
                to="/events/$eventId"
                params={{ eventId: event.id }}
                className="flex gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-black dark:text-white truncate">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[12px] text-black/50 dark:text-white/50">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(event.time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[12px] text-black/50 dark:text-white/50">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.joined}/{event.maxParticipants}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-col">
          {allPosts.map((post) => {
            const linkedEvent = events.find((e) => e.id === post.eventId);
            const textContent = renderContent(post.content);
            return (
              <article
                key={post.id}
                className="flex flex-row gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex-shrink-0 pt-1">
                  <img
                    src={getAuthorAvatar(post.authorEmail)}
                    alt={getAuthorName(post.authorEmail)}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden text-[15px] text-black dark:text-white">
                      <span className="font-bold truncate">{getAuthorName(post.authorEmail)}</span>
                      {post.authorEmail && (
                        <span className="text-black/50 dark:text-white/50 truncate">
                          @{post.authorEmail.split("@")[0]}
                        </span>
                      )}
                      <span className="text-black/50 dark:text-white/50">·</span>
                      <span className="text-black/50 dark:text-white/50 flex-shrink-0">
                        {timeAgo(post.createdAt)}
                      </span>
                    </div>
                    {post.authorEmail === userEmail && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(post.id)}
                        className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-500" />
                      </button>
                    )}
                  </div>

                  <p className="mt-0.5 text-[15px] text-black/85 dark:text-white/90 leading-snug whitespace-pre-wrap">
                    {textContent}
                  </p>

                  {linkedEvent && (
                    <div className="mt-3">
                      <Link
                        to="/events/$eventId"
                        params={{ eventId: linkedEvent.id }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-[var(--ember)] transition-colors" />
                        <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {linkedEvent.title}
                        </span>
                      </Link>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3 text-black/50 dark:text-white/50 max-w-md">
                    <button className="flex items-center gap-2 hover:[color:var(--ember)] group transition-colors">
                      <div className="p-2 rounded-full group-hover:bg-[var(--ember)]/10 transition-colors -ml-2">
                        <MessageCircle className="w-[18px] h-[18px]" />
                      </div>
                    </button>
                    <button className="flex items-center gap-2 hover:[color:var(--ember)] group transition-colors">
                      <div className="p-2 rounded-full group-hover:bg-[var(--ember)]/10 transition-colors -ml-2">
                        <Heart className="w-[18px] h-[18px]" />
                      </div>
                    </button>
                    <button className="flex items-center gap-2 hover:[color:var(--ember)] group transition-colors">
                      <div className="p-2 rounded-full group-hover:bg-[var(--ember)]/10 transition-colors -ml-2">
                        <Share className="w-[18px] h-[18px]" />
                      </div>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {allPosts.length === 0 && (tab !== "myevents" || myEvents.length === 0) ? (
          <div className="py-16 px-6 text-center">
            <p className="text-black/60 dark:text-white/60 text-lg font-serif font-medium">
              Aucun post pour le moment.
            </p>
            <p className="text-black/40 dark:text-white/40 text-sm mt-2 font-medium">
              {tab === "myevents"
                ? "Rejoignez des événements pour voir les posts ici."
                : "Créez un post via le bouton + pour commencer."}
            </p>
          </div>
        ) : allPosts.length > 0 ? (
          <div className="py-12 px-6 text-center">
            <p className="text-black/50 dark:text-white/50 text-[15px]">Vous êtes à jour.</p>
          </div>
        ) : null}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-center text-zinc-900 dark:text-white mb-2">
              Supprimer ce post ?
            </h3>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-6">
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[13px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeletePost(deleteConfirmId)}
                className="flex-1 py-3 px-4 rounded-full bg-red-600 text-white font-bold text-[13px] hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
