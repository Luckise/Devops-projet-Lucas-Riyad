import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Heart, Share, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

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
    image: null,
    likes: 42,
    comments: 1,
  },
];

function App() {
  return (
    <main className="min-h-screen text-white pb-20 pt-[60px] md:pt-[80px]">
      <div className="max-w-xl mx-auto border-x border-white/10 min-h-screen">
        <header className="sticky top-[60px] md:top-[80px] z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </header>

        <div className="flex flex-col">
          {MOCK_FEED.map((post) => (
            <article
              key={post.id}
              className="flex flex-row gap-3 px-4 py-3 border-b border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer"
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
                  <div className="flex items-center gap-1.5 overflow-hidden text-[15px]">
                    <span className="font-bold truncate">{post.author.name}</span>
                    <span className="text-white/50 truncate">{post.author.handle}</span>
                    <span className="text-white/50">·</span>
                    <span className="text-white/50 flex-shrink-0">{post.timestamp}</span>
                  </div>
                  <button className="text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors -mr-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <p className="mt-0.5 text-[15px] text-white/90 leading-snug whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.image && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="w-full h-auto max-h-[400px] object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center mt-3 text-white/50 max-w-md">
                  <button className="flex items-center gap-2 hover:text-blue-400 group transition-colors">
                    <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors -ml-2">
                      <MessageCircle className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[13px]">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-pink-500 group transition-colors">
                    <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors -ml-2">
                      <Heart className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[13px]">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-400 group transition-colors">
                    <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors -ml-2">
                      <Share className="w-[18px] h-[18px]" />
                    </div>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State / End of Feed */}
        <div className="py-12 px-6 text-center">
          <p className="text-white/50 text-[15px]">You're all caught up.</p>
        </div>
      </div>
    </main>
  );
}
