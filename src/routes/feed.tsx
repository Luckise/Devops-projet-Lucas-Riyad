import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Heart, Share, MoreHorizontal, Calendar as CalendarIcon } from "lucide-react";
import { MOCK_EVENTS, getMyEventIds } from "../lib/mock-data";

export const Route = createFileRoute("/feed")({ component: FeedRoute });

const MOCK_FEED = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      handle: "@sarahc",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "2h",
    content:
      "The lighting at the Warehouse 42 techno set last night was absolutely unreal. Best set I've heard all year.",
    eventId: "1",
    image:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    likes: 124,
    comments: 12,
  },
  {
    id: "2",
    author: {
      name: "Marcus Thorne",
      handle: "@marcust",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "5h",
    content:
      "Sunrise soundbath at The Glasshouse. Exactly what was needed to reset for the week. 🧘‍♂️✨",
    eventId: "2",
    image: null,
    likes: 89,
    comments: 4,
  },
  {
    id: "3",
    author: {
      name: "Elena Rodriguez",
      handle: "@elenar",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "Oct 24",
    content:
      "Still thinking about the Autumn Street Food festival. The bao buns from that one truck... wow.",
    eventId: "3",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
    likes: 256,
    comments: 28,
  },
  {
    id: "4",
    author: {
      name: "Alex Kim",
      handle: "@alexk",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    },
    timestamp: "Oct 23",
    content:
      'The Indie Film Showcase exceeded all expectations. "Midnight in the Valley" was a masterpiece of tension.',
    eventId: "4",
    image: null,
    likes: 42,
    comments: 1,
  },
];

function FeedRoute() {
  const [tab, setTab] = useState<"global" | "myevents">("global");
  const myEventIds = getMyEventIds();

  const filteredFeed = MOCK_FEED.filter((post) => {
    if (tab === "global") return true;
    return post.eventId && myEventIds.includes(post.eventId);
  });

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

        <div className="flex flex-col">
          {filteredFeed.map((post) => {
            const linkedEvent = MOCK_EVENTS.find(e => e.id === post.eventId);
            return (
            <article
              key={post.id}
              className="flex flex-row gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0 pt-1">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-hidden text-[15px] text-black dark:text-white">
                    <span className="font-bold truncate">{post.author.name}</span>
                    <span className="text-black/50 dark:text-white/50 truncate">{post.author.handle}</span>
                    <span className="text-black/50 dark:text-white/50">·</span>
                    <span className="text-black/50 dark:text-white/50 flex-shrink-0">{post.timestamp}</span>
                  </div>
                  <button className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors -mr-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <p className="mt-0.5 text-[15px] text-black/85 dark:text-white/90 leading-snug whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.image && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="w-full h-auto max-h-[400px] object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

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
                    <span className="text-[13px]">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:[color:var(--ember)] group transition-colors">
                    <div className="p-2 rounded-full group-hover:bg-[var(--ember)]/10 transition-colors -ml-2">
                      <Heart className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[13px]">{post.likes}</span>
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

        {/* Empty State / End of Feed */}
        {filteredFeed.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <p className="text-black/60 dark:text-white/60 text-lg font-serif font-medium">No posts yet.</p>
            <p className="text-black/40 dark:text-white/40 text-sm mt-2 font-medium">
              Follow or get tickets for events to see posts about them here.
            </p>
          </div>
        ) : (
          <div className="py-12 px-6 text-center">
            <p className="text-black/50 dark:text-white/50 text-[15px]">You're all caught up.</p>
          </div>
        )}
      </div>
    </main>
  );
}
