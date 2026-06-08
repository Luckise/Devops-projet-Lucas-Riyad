export const MOCK_EVENTS = [
  {
    id: "1",
    title: "Neon Nights: Underground Techno",
    date: "2025-10-28",
    time: "23:00",
    location: "Warehouse 42, District 9",
    price: 15,
    joined: 342,
    maxParticipants: 500,
    isPast: true,
    hidden: false,
    attendees: ["lucas.guillemin@efrei.net", "ryiad.larbaoui@efrei.net"],
    image:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    tags: ["Techno", "Underground"],
    groupId: "seed_efrei_esports",
    description: "Experience the pulse of the underground. Neon Nights returns to Warehouse 42 for a 12-hour marathon set featuring international and local techno artists. Expect heavy bass, immersive visuals, and a community of true music lovers.",
  },
  {
    id: "2",
    title: "Sunrise Yoga & Soundbath",
    date: "2025-10-29",
    time: "06:30",
    location: "The Glasshouse",
    price: 25,
    joined: 45,
    maxParticipants: 100,
    isPast: true,
    hidden: false,
    attendees: [],
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
    tags: ["Wellness", "Morning"],
    groupId: "seed_hiking",
    description: "Start your morning with intention. Join us as the sun rises over The Glasshouse for a 90-minute vinyasa flow followed by a deeply restorative crystal bowl soundbath. Bring your own mat.",
  },
  {
    id: "3",
    title: "Street Food Festival: Autumn Edition",
    date: "2026-11-02",
    time: "12:00",
    location: "Central Plaza",
    price: 0,
    joined: 1250,
    maxParticipants: 2000,
    isPast: false,
    hidden: false,
    attendees: [],
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
    tags: ["Food", "Community"],
    groupId: "seed_a_table",
    description: "The city's best food trucks converge for our seasonal street food festival. Taste autumn-inspired dishes, local craft beers, and enjoy live acoustic music throughout the afternoon. Free entry!",
  },
  {
    id: "4",
    title: "Indie Film Showcase",
    date: "2026-11-05",
    time: "20:00",
    location: "Lumina Theater",
    price: 12,
    joined: 112,
    maxParticipants: 200,
    isPast: false,
    hidden: false,
    attendees: [],
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
    tags: ["Cinema", "Art"],
    groupId: "seed_cine_club",
    description: "A curated evening of independent short films from emerging local directors. The screening will be followed by a Q&A session with the filmmakers and a networking mixer in the lobby.",
  },
  {
    id: "5",
    title: "SOLD OUT: DJ Snake Live",
    date: "2026-11-10",
    time: "22:00",
    location: "Megaclub Arena",
    price: 35,
    joined: 2500,
    maxParticipants: 2500,
    isPast: false,
    hidden: false,
    attendees: [],
    image:
      "https://images.unsplash.com/photo-1571266028243-3716f02d2d01?q=80&w=800&auto=format&fit=crop",
    tags: ["Concert", "Electronic"],
    groupId: "seed_efrei_esports",
    description: "The biggest electronic show of the year is completely sold out. DJ Snake brings his signature high-energy set to the Megaclub Arena with full production.",
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

export function updateItem<T extends { id: string }>(storageKey: string, id: string, updates: Partial<T>): void {
  const items: T[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const idx = items.findIndex((i: T) => i.id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    localStorage.setItem(storageKey, JSON.stringify(items));
  }
}

export function deleteItem(storageKey: string, id: string): void {
  const items: any[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const filtered = items.filter((i: any) => i.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(filtered));
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

export function getAllEvents() {
  return [...getSavedItems("user_events"), ...MOCK_EVENTS];
}

export function unhideEvent(eventId: string): void {
  updateItem("user_events", eventId, { hidden: false } as any);
  const idx = MOCK_EVENTS.findIndex((e) => e.id === eventId);
  if (idx !== -1) MOCK_EVENTS[idx].hidden = false;
}

export function hideEvent(eventId: string): void {
  updateItem("user_events", eventId, { hidden: true } as any);
  const idx = MOCK_EVENTS.findIndex((e) => e.id === eventId);
  if (idx !== -1) MOCK_EVENTS[idx].hidden = true;
}

export function findEvent(eventId: string) {
  const all = [...getSavedItems("user_events"), ...MOCK_EVENTS];
  return all.find((e) => e.id === eventId);
}

export function unhideTip(tipId: string): void {
  updateItem("user_tips", tipId, { hidden: false } as any);
  const idx = MOCK_TIPS.findIndex((t) => t.id === tipId);
  if (idx !== -1) MOCK_TIPS[idx].hidden = false;
}

export function hideTip(tipId: string): void {
  updateItem("user_tips", tipId, { hidden: true } as any);
  const idx = MOCK_TIPS.findIndex((t) => t.id === tipId);
  if (idx !== -1) MOCK_TIPS[idx].hidden = true;
}

export function formatDate(dateStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return dateStr;
}

export function formatTime(timeStr: string): string {
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  }
  return timeStr;
}

export function isEventPast(event: { date: string; time?: string }): boolean {
  if (!event.date) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
    const timeStr = event.time || "00:00";
    const dateTime = new Date(`${event.date}T${timeStr}`);
    dateTime.setHours(dateTime.getHours() + 1);
    return dateTime < new Date();
  }
  return false;
}

export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = a.date.match(/^\d{4}-\d{2}-\d{2}$/) ? a.date : "9999-99-99";
    const dateB = b.date.match(/^\d{4}-\d{2}-\d{2}$/) ? b.date : "9999-99-99";
    return dateA.localeCompare(dateB);
  });
}

export function findTip(tipId: string) {
  const all = [...getSavedItems("user_tips"), ...MOCK_TIPS];
  return all.find((t) => t.id === tipId);
}

function generateTicketId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "TICK-";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export async function createTicket(event: any, profile: any): Promise<any> {
  const ticketId = generateTicketId();
  let qrDataUrl = "";
  try {
    const QRCode = (await import("qrcode")).default;
    qrDataUrl = await QRCode.toDataURL(ticketId, {
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
  } catch {
    qrDataUrl = "";
  }
  const ticket = {
    id: ticketId,
    eventId: event.id,
    qrDataUrl,
    type: event.price > 0 ? "General Admission" : "Free Entry",
    purchaseDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    event: {
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
    },
  };
  saveItem("purchased_tickets", ticket);
  return ticket;
}
