export const MOCK_EVENTS = [
  {
    id: "1",
    title: "Neon Nights: Underground Techno",
    date: "Oct 28",
    time: "11:00 PM",
    location: "Warehouse 42, District 9",
    price: 15,
    joined: 342,
    isPast: true,
    image:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    tags: ["Techno", "Underground"],
    description: "Experience the pulse of the underground. Neon Nights returns to Warehouse 42 for a 12-hour marathon set featuring international and local techno artists. Expect heavy bass, immersive visuals, and a community of true music lovers.",
  },
  {
    id: "2",
    title: "Sunrise Yoga & Soundbath",
    date: "Oct 29",
    time: "06:30 AM",
    location: "The Glasshouse",
    price: 25,
    joined: 45,
    isPast: true,
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
    tags: ["Wellness", "Morning"],
    description: "Start your morning with intention. Join us as the sun rises over The Glasshouse for a 90-minute vinyasa flow followed by a deeply restorative crystal bowl soundbath. Bring your own mat.",
  },
  {
    id: "3",
    title: "Street Food Festival: Autumn Edition",
    date: "Nov 02",
    time: "12:00 PM",
    location: "Central Plaza",
    price: 0,
    joined: 1250,
    isPast: false,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
    tags: ["Food", "Community"],
    description: "The city's best food trucks converge for our seasonal street food festival. Taste autumn-inspired dishes, local craft beers, and enjoy live acoustic music throughout the afternoon. Free entry!",
  },
  {
    id: "4",
    title: "Indie Film Showcase",
    date: "Nov 05",
    time: "08:00 PM",
    location: "Lumina Theater",
    price: 12,
    joined: 112,
    isPast: false,
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
    tags: ["Cinema", "Art"],
    description: "A curated evening of independent short films from emerging local directors. The screening will be followed by a Q&A session with the filmmakers and a networking mixer in the lobby.",
  },
];

export const MOCK_TIPS = [
  {
    id: "1",
    title: "The Perfect Matcha Latte at Home",
    category: "Recipes",
    image:
      "https://images.unsplash.com/photo-1536281105995-103328e75294?q=80&w=600&auto=format&fit=crop",
    height: "aspect-[3/4]",
    cookingTime: "10 min",
    ingredients: [
      "2 tsp ceremonial grade matcha powder",
      "1/4 cup hot water (80°C)",
      "1 cup oat milk",
      "1 tsp honey or maple syrup",
    ],
    content: [
      {
        type: "text",
        value: "Making a café-quality matcha latte at home is easier than you think. The key is in the whisking and the quality of your powder.",
      },
      {
        type: "image",
        value: "https://images.unsplash.com/photo-1582787011404-58ebf1a304fc?q=80&w=800&auto=format&fit=crop",
      },
      {
        type: "text",
        value: "Start by sifting your matcha into a bowl to prevent clumps. Add the hot water and whisk vigorously in a W-shape until frothy. Heat and froth your oat milk, then pour it over the matcha. Sweeten to taste.",
      },
    ]
  },
  {
    id: "3",
    title: "20% off all October Techno Events",
    category: "Promotions",
    image:
      "https://images.unsplash.com/photo-1559223607-b4d0555ae227?q=80&w=600&auto=format&fit=crop",
    height: "aspect-[4/3]",
    content: [
      {
        type: "text",
        value: "To celebrate the start of the indoor season, we're offering an exclusive 20% discount on all techno events listed in the app for October.",
      },
      {
        type: "text",
        value: "Simply use the promo code OCTOBERTECH at checkout. This offer is valid until the end of the month and applies to our top picks like Warehouse 42 and The Vault.",
      }
    ]
  },
  {
    id: "4",
    title: "Best Vintage Stores in the City",
    category: "Addresses",
    image:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=600&auto=format&fit=crop",
    height: "aspect-[3/4]",
    address: "Le Marais District, 75003",
    content: [
      {
        type: "text",
        value: "Finding the perfect vintage piece requires patience and knowing where to look. We've curated the absolute best spots in the district.",
      },
      {
        type: "image",
        value: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop",
      },
      {
        type: "text",
        value: "Make sure to check out 'Retro Revival' on the corner of 5th and Main for rare denim, and 'Second Time Around' for incredible 70s leather jackets.",
      }
    ]
  },
  {
    id: "5",
    title: "15-Minute Spicy Vodka Pasta",
    category: "Recipes",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=600&auto=format&fit=crop",
    height: "aspect-square",
    cookingTime: "15 min",
    ingredients: [
      "250g rigatoni",
      "1/2 onion, finely diced",
      "2 cloves garlic, minced",
      "1/4 cup tomato paste",
      "2 tbsp vodka",
      "1/2 cup heavy cream",
      "Chili flakes to taste",
      "Parmesan for serving",
    ],
    content: [
      {
        type: "text",
        value: "This spicy vodka pasta went viral for a reason. It's rich, creamy, and comes together in the time it takes to boil the pasta.",
      },
      {
        type: "text",
        value: "Sauté the onion and garlic until translucent. Add the tomato paste and chili flakes, cooking until the paste darkens. Deglaze with vodka, then stir in the cream. Toss with cooked pasta and a splash of pasta water. Serve with plenty of parmesan."
      }
    ]
  },
  {
    id: "6",
    title: "Sunday Market Guide: What to buy",
    category: "Guides",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop",
    height: "aspect-[4/5]",
    content: [
      {
        type: "text",
        value: "Navigating the Sunday market can be overwhelming. Here is our definitive guide on what stalls are actually worth your time.",
      },
      {
        type: "image",
        value: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=800&auto=format&fit=crop"
      },
      {
        type: "text",
        value: "Head straight to the artisan baker at the north entrance for sourdough, then loop back to the central aisle for seasonal organic greens. Skip the imported fruits entirely."
      }
    ]
  }
];

export const MOCK_POSTS = [
  {
    id: "1",
    content: [
      { type: "text", value: "What an incredible night at Neon Nights! The energy was unmatched." },
      { type: "image", value: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "Thank you to everyone who came out. See you at the next one." },
    ],
    eventId: "1",
    createdAt: "2024-10-29",
  },
  {
    id: "2",
    content: [
      { type: "text", value: "The Street Food Festival is just around the corner. Here's what to expect." },
      { type: "text", value: "Over 30 food trucks, live music, and a dedicated craft beer section. Bring your appetite!" },
    ],
    eventId: "3",
    createdAt: "2024-11-01",
  },
];

export function saveItem<T>(storageKey: string, item: T): void {
  const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
  existing.unshift(item);
  localStorage.setItem(storageKey, JSON.stringify(existing));
}

export function getSavedItems<T>(storageKey: string): T[] {
  return JSON.parse(localStorage.getItem(storageKey) || "[]");
}

export function getSavedEventIds(): string[] {
  return JSON.parse(localStorage.getItem("saved_events") || "[]");
}

export function isEventSaved(eventId: string): boolean {
  const saved = getSavedEventIds();
  return saved.includes(eventId);
}

export function toggleSavedEvent(eventId: string): boolean {
  const saved = getSavedEventIds();
  const idx = saved.indexOf(eventId);
  if (idx === -1) {
    saved.unshift(eventId);
    localStorage.setItem("saved_events", JSON.stringify(saved));
    return true;
  } else {
    saved.splice(idx, 1);
    localStorage.setItem("saved_events", JSON.stringify(saved));
    return false;
  }
}

export function getPurchasedEventIds(): string[] {
  const stored = JSON.parse(localStorage.getItem("purchased_tickets") || "[]");
  const demoIds = ["1", "3"];
  return [...new Set([...demoIds, ...stored])];
}

export function getMyEventIds(): string[] {
  const saved = getSavedEventIds();
  const purchased = getPurchasedEventIds();
  return [...new Set([...saved, ...purchased])];
}
