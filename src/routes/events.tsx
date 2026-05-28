import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Calendar, Clock, ArrowRight, Ticket, Users } from 'lucide-react'

export const Route = createFileRoute('/events')({
  component: EventsRoute,
})

// Mock data for the prototype
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Neon Nights: Underground Techno',
    date: 'Oct 28',
    time: '11:00 PM',
    location: 'Warehouse 42, District 9',
    price: '€15',
    joined: 342,
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop',
    tags: ['Techno', 'Underground'],
  },
  {
    id: '2',
    title: 'Sunrise Yoga & Soundbath',
    date: 'Oct 29',
    time: '06:30 AM',
    location: 'The Glasshouse',
    price: '€25',
    joined: 45,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
    tags: ['Wellness', 'Morning'],
  },
  {
    id: '3',
    title: 'Street Food Festival: Autumn Edition',
    date: 'Nov 02',
    time: '12:00 PM',
    location: 'Central Plaza',
    price: 'Free Entry',
    joined: 1250,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    tags: ['Food', 'Community'],
  },
  {
    id: '4',
    title: 'Indie Film Showcase',
    date: 'Nov 05',
    time: '08:00 PM',
    location: 'Lumina Theater',
    price: '€12',
    joined: 112,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    tags: ['Cinema', 'Art'],
  }
]

function EventsRoute() {
  return (
    <main className="min-h-screen text-white pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <header className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-1.5 ml-0.5">Happening Soon</p>
            <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none">Events</h1>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full transition-colors mb-1">
            <Ticket className="w-4 h-4" />
            <span>Tickets</span>
          </button>
        </header>

        <div className="flex flex-col gap-6">
          {MOCK_EVENTS.map((event) => (
            <article 
              key={event.id}
              className="group relative rounded-[2rem] overflow-hidden bg-zinc-900 aspect-[4/5] flex flex-col justify-end transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] active:scale-[0.98] cursor-pointer ring-1 ring-white/10"
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

              {/* Tags Layer - Top */}
              <div className="absolute top-5 left-5 z-20 flex flex-wrap gap-2 pr-5">
                {event.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase text-white border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Content Layer - Bottom */}
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
                    <span className="font-bold tracking-tight text-white">{event.price}</span>
                    <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}