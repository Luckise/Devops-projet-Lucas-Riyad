import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Calendar, Clock, QrCode, X } from "lucide-react";
import { MOCK_EVENTS } from "../lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/tickets")({
  component: TicketsRoute,
});

function TicketsRoute() {
  const [expandedQr, setExpandedQr] = useState<string | null>(null);

  // For the prototype, we assume the user has a ticket for the first event
  const myTickets = [
    {
      id: "TICK-8X9P2",
      event: MOCK_EVENTS[0], // Neon Nights
      status: "valid",
      type: "General Admission",
      purchaseDate: "Oct 24, 2023",
    },
    {
      id: "TICK-4J7K1",
      event: MOCK_EVENTS[2], // Street Food Festival (Free)
      status: "valid",
      type: "Free Entry",
      purchaseDate: "Oct 25, 2023",
    }
  ];

  return (
    <main className="min-h-screen pb-24 pt-[80px] bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <header className="mb-8">
          <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white">
            My Tickets
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Show these at the entrance
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {myTickets.map((ticket) => (
            <div key={ticket.id} className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-none border border-zinc-200/50 dark:border-white/10">
              {/* Event Image Banner */}
              <div className="h-32 w-full relative">
                <img 
                  src={ticket.event.image} 
                  alt={ticket.event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="px-2 py-1 rounded bg-black/40 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white w-fit mb-1 border border-white/20">
                    {ticket.type}
                  </span>
                  <h2 className="text-xl font-serif font-medium text-white leading-tight drop-shadow-md">
                    {ticket.event.title}
                  </h2>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-5 relative bg-white dark:bg-zinc-900">
                {/* Perforation Line */}
                <div className="absolute -top-3 left-0 w-full flex justify-between items-center z-10 px-0">
                  <div className="w-6 h-6 rounded-full bg-zinc-50 dark:bg-zinc-950 -ml-3 border border-transparent shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.05)]" />
                  <div className="flex-1 border-t-2 border-dashed border-zinc-200 dark:border-white/10 mx-2" />
                  <div className="w-6 h-6 rounded-full bg-zinc-50 dark:bg-zinc-950 -mr-3 border border-transparent shadow-[inset_1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.05)]" />
                </div>

                <div className="mt-4 flex gap-4 items-center">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <Calendar className="w-4 h-4 text-[var(--ember)]" />
                      <span className="text-sm font-medium">{ticket.event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <Clock className="w-4 h-4 text-[var(--ember)]" />
                      <span className="text-sm font-medium">{ticket.event.time}</span>
                    </div>
                    <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-300">
                      <MapPin className="w-4 h-4 text-[var(--ember)] mt-0.5" />
                      <span className="text-sm font-medium leading-snug">{ticket.event.location}</span>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <button 
                    onClick={() => setExpandedQr(ticket.id)}
                    className="w-24 h-24 bg-white dark:bg-white p-2 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm"
                  >
                    <QrCode className="w-full h-full text-black" strokeWidth={1} />
                  </button>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-between items-center">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                    Order {ticket.id}
                  </div>
                  <div className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                    Valid Entry
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Screen QR Modal */}
        {expandedQr && (
          <div 
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-300 animate-in fade-in"
            onClick={() => setExpandedQr(null)}
          >
            <div 
              className="bg-white p-8 rounded-[2rem] w-full max-w-[320px] flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-full aspect-square bg-white flex items-center justify-center border border-zinc-100 rounded-2xl p-4 shadow-inner">
                 <QrCode className="w-full h-full text-black" strokeWidth={1} />
              </div>
              <div className="text-center">
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Ticket ID</p>
                <p className="text-black font-mono font-bold tracking-tight text-lg">{expandedQr}</p>
              </div>
              <button 
                onClick={() => setExpandedQr(null)}
                className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors mt-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
