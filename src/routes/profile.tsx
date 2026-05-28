import { createFileRoute } from '@tanstack/react-router'
import { User, Settings, Bell, CreditCard } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return (
    <main className="min-h-screen text-white pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 pt-4 md:pt-8">
        <header className="mb-8">
          <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-1.5 ml-0.5">Account</p>
          <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none">Profile</h1>
        </header>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-20 h-20 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
            <User className="w-8 h-8 text-white/40" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Event Goer</h2>
            <p className="text-white/50 text-sm mt-0.5">hello@example.com</p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { icon: CreditCard, label: 'Payment Methods' },
            { icon: Bell, label: 'Notifications' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 text-left">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-white/70" />
              </div>
              <span className="font-medium text-white/90">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10">
          <button className="w-full text-center text-white/40 font-medium hover:text-white/80 transition-colors">
            Log Out
          </button>
        </div>
      </div>
    </main>
  )
}