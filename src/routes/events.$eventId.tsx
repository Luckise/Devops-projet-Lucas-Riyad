import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { getServices } from "../di/container";
import { formatDate, formatTime, isEventPast } from "../lib/date-utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CheckCircle2,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import SaveButton from "../components/SaveButton";
import { toast } from "../lib/toast";
import { useUser } from "../hooks/use-user";

export const Route = createFileRoute("/events/$eventId")({
  beforeLoad: async () => {
    try {
      await (await getServices()).authService.getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: EventDetailsRoute,
  loader: async ({ params }) => {
    const event = await (await getServices()).eventService.findEvent(params.eventId);
    if (!event) throw new Error("Event not found");
    return { event };
  },
});

function EventDetailsRoute() {
  const { event } = Route.useLoaderData();
  const navigate = useNavigate();
  const { user } = useUser();
  const [joined, setJoined] = useState(event.joined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const eventPast = isEventPast(event);
  const isEventFull = event.maxParticipants > 0 && joined >= event.maxParticipants;

  const handleJoin = async () => {
    try {
      await (await getServices()).authService.getCurrentUser();
    } catch {
      navigate({ to: "/login" });
      return;
    }
    if (isEventFull) return;
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newJoined = joined + 1;
    setJoined(newJoined);

    const services = await getServices();
    await services.eventService.update(event.id, {
      joined: newJoined,
      attendees: [...(event.attendees || []), user.email].filter(Boolean),
    } as any);

    await services.ticketService.create(event, user);

    if (event.price > 0) {
      window.open("https://www.helloasso.com/", "_blank");
      setPaymentSuccess(true);
      setIsProcessing(false);
      toast("Redirected to HelloAsso for payment");

      setTimeout(() => {
        navigate({ to: "/tickets" });
      }, 2000);
    } else {
      setIsProcessing(false);
      toast("You joined! Ticket generated.");
      navigate({ to: "/tickets" });
    }
  };

  return (
    <main className="min-h-screen pb-48 bg-white dark:bg-zinc-950">
      {/* Immersive Hero Image */}
      <div className="relative h-[55vh] w-full bg-zinc-900">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent h-full w-full" />

        {/* Top Nav (Back Button) */}
        <div className="absolute top-0 left-0 w-full p-4 pt-[4.5rem] flex justify-between items-center z-10">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-11 h-11 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/30 dark:hover:bg-black/40 transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 -mt-10 relative z-10">
        {/* Event Header */}
        <div className="flex flex-wrap gap-2 mb-4">
          {eventPast && (
            <span className="px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-[11px] font-bold tracking-wide uppercase text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
              Past Event
            </span>
          )}
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-[11px] font-bold tracking-wide uppercase text-zinc-800 dark:text-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1] text-zinc-900 dark:text-white mb-6 tracking-tight">
          {event.title}
        </h1>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
            <Calendar className="w-5 h-5 text-[var(--ember)] mt-0.5" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Date
              </p>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(event.date)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
            <Clock className="w-5 h-5 text-[var(--ember)] mt-0.5" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Time
              </p>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatTime(event.time)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 col-span-2">
            <MapPin className="w-5 h-5 text-[var(--ember)] mt-0.5" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Location
              </p>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{event.location}</p>
            </div>
          </div>
        </div>

        {/* Story / Description */}
        <div className="prose prose-zinc dark:prose-invert max-w-none mb-12">
          <h3 className="text-lg font-bold mb-3 font-sans">About this event</h3>
          <p className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
            {event.description}
          </p>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      {!eventPast && (
        <div className="fixed bottom-[4.5rem] left-0 w-full p-4 pb-6 bg-gradient-to-t from-white via-white/95 to-white/0 dark:from-zinc-950 dark:via-zinc-950/95 dark:to-zinc-950/0 z-40">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SaveButton eventId={event.id} />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Price
                </span>
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {event.price === 0 ? "Free" : `€${event.price}`}
                </span>
              </div>
              {event.maxParticipants > 0 && (
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Capacity
                  </span>
                  <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                    {joined}/{event.maxParticipants}
                  </span>
                </div>
              )}
            </div>

            {isEventFull ? (
              <div className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-[15px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                <XCircle className="w-5 h-5" />
                <span>Event Full</span>
              </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isProcessing || paymentSuccess}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-[15px] transition-all duration-300 ${
                  paymentSuccess
                    ? "bg-green-500 text-white"
                    : "bg-[var(--ember)] hover:bg-[var(--ember)]/90 text-white shadow-lg shadow-[var(--ember)]/20"
                } disabled:opacity-80`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {event.price > 0 ? "Redirecting to HelloAsso..." : "Generating Ticket..."}
                    </span>
                  </div>
                ) : paymentSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Payment Complete</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5" />
                    <span>{event.price > 0 ? "Buy Ticket" : "Get Free Ticket"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
