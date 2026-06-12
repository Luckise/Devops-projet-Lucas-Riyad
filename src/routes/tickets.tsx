import { createFileRoute, redirect } from "@tanstack/react-router";
import { MapPin, Calendar, Clock, Ticket, X } from "lucide-react";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { getServices } from "../di/container";
import type { Ticket as TicketModel } from "../types/models";

export const Route = createFileRoute("/tickets")({
  beforeLoad: async () => {
    try {
      await (await getServices()).authService.getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: TicketsRoute,
});

const MOCK_TICKETS: TicketModel[] = [
  {
    id: "TICK-8X9P2",
    eventId: "1",
    qrDataUrl: "",
    type: "General Admission",
    purchaseDate: "Oct 24, 2023",
    event: {
      title: "Neon Nights: Underground Techno",
      date: "2025-10-28",
      time: "23:00",
      location: "Warehouse 42, District 9",
      image:
        "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    },
  },
  {
    id: "TICK-4J7K1",
    eventId: "3",
    qrDataUrl: "",
    type: "Free Entry",
    purchaseDate: "Oct 25, 2023",
    event: {
      title: "Wine & Cheese Night",
      date: "2025-10-30",
      time: "19:00",
      location: "La Cave des Artistes",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    },
  },
];

function TicketsRoute() {
  const [expandedQr, setExpandedQr] = useState<string | null>(null);
  const [mockQrUrls, setMockQrUrls] = useState<Record<string, string>>({});
  const [dynamicTickets, setDynamicTickets] = useState<TicketModel[]>([]);

  useEffect(() => {
    getServices().then((svc) => svc.ticketService.getAll().then(setDynamicTickets));
  }, []);

  const allTickets = [...dynamicTickets, ...MOCK_TICKETS];

  useEffect(() => {
    Promise.all(
      MOCK_TICKETS.map(async (t) => {
        try {
          const url = await QRCode.toDataURL(t.id, { width: 400, margin: 2 });
          return [t.id, url] as const;
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      const entries = results.filter(Boolean) as [string, string][];
      setMockQrUrls(Object.fromEntries(entries));
    });
  }, []);

  const getQrUrl = (ticket: TicketModel): string | null => {
    if (ticket.qrDataUrl) return ticket.qrDataUrl;
    return mockQrUrls[ticket.id] || null;
  };

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <header className="mb-8">
          <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white">
            My Tickets
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">Show these at the entrance</p>
        </header>

        {allTickets.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-7 h-7 text-zinc-400" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No tickets yet</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              Join an event to get a ticket
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {allTickets.map((ticket) => {
            const qrUrl = getQrUrl(ticket);
            return (
              <div
                key={ticket.id}
                className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-none border border-zinc-200/50 dark:border-white/10"
              >
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

                <div className="p-5 relative bg-white dark:bg-zinc-900">
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
                        <span className="text-sm font-medium leading-snug">
                          {ticket.event.location}
                        </span>
                      </div>
                    </div>

                    {qrUrl ? (
                      <button
                        onClick={() => setExpandedQr(ticket.id)}
                        className="w-24 h-24 bg-white dark:bg-white p-1.5 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm"
                      >
                        <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                      </button>
                    ) : (
                      <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-200">
                        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-500 rounded-full animate-spin" />
                      </div>
                    )}
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
            );
          })}
        </div>

        {expandedQr &&
          (() => {
            const ticket = allTickets.find((t) => t.id === expandedQr);
            const qrUrl = ticket ? getQrUrl(ticket) : null;
            return (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Expanded QR code"
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-300 animate-in fade-in"
                onClick={() => setExpandedQr(null)}
              >
                <div
                  className="bg-white p-8 rounded-[2rem] w-full max-w-[320px] flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in-95 duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-full aspect-square bg-white flex items-center justify-center border border-zinc-100 rounded-2xl p-4 shadow-inner">
                    {qrUrl ? (
                      <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-500 rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                      Ticket ID
                    </p>
                    <p className="text-black font-mono font-bold tracking-tight text-lg">
                      {expandedQr}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedQr(null)}
                    aria-label="Close QR code"
                    className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors mt-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })()}
      </div>
    </main>
  );
}
