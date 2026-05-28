import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Calendar, Clock, ArrowRight, Users } from "lucide-react";
import { MOCK_EVENTS, getSavedItems } from "../lib/mock-data";
import SaveButton from "../components/SaveButton";

export const Route = createFileRoute("/")({
  component: EventsRoute,
});

function EventsRoute() {
  const allEvents = [...getSavedItems("user_events"), ...MOCK_EVENTS];

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <header className="mb-6">
          <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none" style={{ color: "var(--ember)" }}>
            Events
          </h1>
        </header>

        <div className="flex flex-col gap-6">
          {allEvents.map((event) => (
            <Link
              to="/events/$eventId"
              params={{ eventId: event.id }}
              key={event.id}
              className="group relative rounded-[2rem] overflow-hidden bg-zinc-900 aspect-[4/5] flex flex-col justify-end transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] active:scale-[0.98] cursor-pointer ring-1 ring-white/10 block"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

              <div className="absolute top-5 left-5 z-20 flex flex-wrap gap-2 pr-5">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase text-white border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="absolute top-5 right-5 z-20">
                <SaveButton eventId={event.id} compact />
              </div>

              <div className="relative z-20 p-6 pt-12 flex flex-col gap-3">
                <h2 className="text-[1.75rem] font-serif font-medium leading-[1.1] text-white drop-shadow-md pr-4">
                  {event.title}
                </h2>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-medium text-white/80 mt-1">
                  <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
                    <Calendar className="w-3.5 h-3.5 text-white/60" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-white/60" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
                    <Users className="w-3.5 h-3.5 text-white/60" />
                    <span>{event.joined}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-white/90 font-medium">
                    <MapPin className="w-4 h-4 text-white/60" />
                    <span className="truncate max-w-[170px]">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold tracking-tight text-white">{event.price === 0 ? "Free Entry" : `€${event.price}`}</span>
                    <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
