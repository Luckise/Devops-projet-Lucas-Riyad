import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/tips')({
  component: TipsRoute,
})

const CATEGORIES = ['All', 'Recipes', 'Promotions', 'Addresses', 'Guides', 'Local Secrets']

const MOCK_TIPS = [
  {
    id: '1',
    title: 'The Perfect Matcha Latte at Home',
    category: 'Recipes',
    image: 'https://images.unsplash.com/photo-1536281105995-103328e75294?q=80&w=600&auto=format&fit=crop',
    height: 'aspect-[3/4]',
  },
  {
    id: '2',
    title: 'Hidden Jazz Bar in the Latin Quarter',
    category: 'Local Secrets',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    height: 'aspect-square',
  },
  {
    id: '3',
    title: '20% off all October Techno Events',
    category: 'Promotions',
    image: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?q=80&w=600&auto=format&fit=crop',
    height: 'aspect-[4/3]',
  },
  {
    id: '4',
    title: 'Best Vintage Stores in the City',
    category: 'Addresses',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=600&auto=format&fit=crop',
    height: 'aspect-[3/4]',
  },
  {
    id: '5',
    title: '15-Minute Spicy Vodka Pasta',
    category: 'Recipes',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=600&auto=format&fit=crop',
    height: 'aspect-square',
  },
  {
    id: '6',
    title: 'Sunday Market Guide: What to buy',
    category: 'Guides',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop',
    height: 'aspect-[4/5]',
  },
]

function TipsRoute() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredTips = MOCK_TIPS.filter(
    (tip) => activeCategory === 'All' || tip.category === activeCategory
  )

  return (
    <main className="min-h-screen text-white pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 md:pt-4">
        {/* Header */}
        <header className="mb-4">
          <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-1.5 ml-0.5">Lifestyle</p>
          <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none">Tips</h1>
        </header>

        {/* Scrollable Filter Bar */}
        <div className="relative -mx-4 px-4 mb-6">
          {/* Fading edges for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 gap-3 space-y-3">
          {filteredTips.map((tip) => (
            <article 
              key={tip.id} 
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="relative rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/10 transform transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] active:scale-[0.98]">
                {/* Visual Image */}
                <div className={`w-full ${tip.height}`}>
                  <img 
                    src={tip.image} 
                    alt={tip.title}
                    className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                
                {/* Category Badge overlay on image */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold tracking-wide uppercase text-white border border-white/20 shadow-sm">
                    {tip.category}
                  </span>
                </div>
              </div>
              
              {/* Title placed cleanly below the card for a Pinterest-like feel */}
              <div className="mt-2 px-1">
                <h3 className="text-[14px] font-medium leading-snug text-white/90 group-hover:text-white transition-colors">
                  {tip.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="text-center py-16 px-6 mt-8 rounded-[2rem] border border-white/5 bg-white/[0.02]">
            <p className="text-white/60 text-lg font-serif font-medium">No tips found.</p>
            <p className="text-white/40 text-sm mt-2 font-medium">We're still gathering recommendations for this category.</p>
          </div>
        )}
      </div>
    </main>
  )
}
