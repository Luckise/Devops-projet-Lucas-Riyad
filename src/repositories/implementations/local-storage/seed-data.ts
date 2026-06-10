import type { Group, Tip, Post } from "../../../types/models";

export const MOCK_CLUBS: Group[] = [
  {
    id: "seed_efrei_esports",
    name: "EFREI Esports",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "lucas.guillemin@efrei.net", "ryiad.larbaoui@efrei.net"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "EFREI Esports is the official competitive gaming club of EFREI Paris." },
      { type: "image", value: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "We host weekly practice sessions, LAN parties, and viewing parties for major tournaments." },
      { type: "text", value: "Practices run every Tuesday and Thursday evening at the EFREI campus gaming lab." },
    ],
  },
  {
    id: "seed_photo_club",
    name: "EFREI Photography",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "lucas.guillemin@efrei.net"],
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "The EFREI Photography Club brings together students passionate about capturing moments." },
      { type: "image", value: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "We organise monthly group walks to iconic Parisian locations." },
    ],
  },
  {
    id: "seed_hiking",
    name: "EFREI Outdoor",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "ryiad.larbaoui@efrei.net"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "EFREI Outdoor is for students who love nature, hiking, and adventure." },
      { type: "image", value: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "Previous trips include Fontainebleau bouldering, Normandy coastal hikes." },
    ],
  },
  {
    id: "seed_a_table",
    name: "EFREI A TABLE",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "lucas.guillemin@efrei.net"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "EFREI A TABLE is the campus culinary club where students gather to cook and share." },
      { type: "image", value: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "No experience needed, just an appetite. We meet every other Wednesday." },
    ],
  },
  {
    id: "seed_cine_club",
    name: "EFREI Ciné Club",
    owner: "admin@efrei.net",
    members: ["admin@efrei.net", "ryiad.larbaoui@efrei.net"],
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    content: [
      { type: "text", value: "EFREI Ciné Club screens films every Friday night in the campus amphitheatre." },
      { type: "image", value: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "Each screening is followed by an open discussion. Membership is free." },
    ],
  },
];

export const MOCK_TIPS: Tip[] = [
  {
    id: "1", title: "The Perfect Matcha Latte at Home", category: "Recipes",
    image: "https://images.unsplash.com/photo-1536281105995-103328e75294?q=80&w=600&auto=format&fit=crop",
    height: "aspect-[3/4]", cookingTime: "10 min",
    ingredients: ["2 tsp ceremonial grade matcha powder", "1/4 cup hot water (80°C)", "1 cup oat milk", "1 tsp honey or maple syrup"],
    content: [
      { type: "text", value: "Making a café-quality matcha latte at home is easier than you think." },
      { type: "image", value: "https://images.unsplash.com/photo-1582787011404-58ebf1a304fc?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "Start by sifting your matcha into a bowl to prevent clumps." },
    ],
  },
  {
    id: "3", title: "20% off all October Techno Events", category: "Promotions",
    image: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?q=80&w=600&auto=format&fit=crop",
    height: "aspect-[4/3]",
    content: [
      { type: "text", value: "To celebrate the start of the indoor season, we're offering an exclusive 20% discount." },
      { type: "text", value: "Simply use the promo code OCTOBERTECH at checkout." },
    ],
  },
  {
    id: "4", title: "Best Vintage Stores in the City", category: "Addresses",
    image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=600&auto=format&fit=crop",
    height: "aspect-[3/4]", address: "Le Marais District, 75003",
    content: [
      { type: "text", value: "Finding the perfect vintage piece requires patience and knowing where to look." },
      { type: "image", value: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "Make sure to check out 'Retro Revival' on the corner of 5th and Main." },
    ],
  },
  {
    id: "5", title: "15-Minute Spicy Vodka Pasta", category: "Recipes",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=600&auto=format&fit=crop",
    height: "aspect-square", cookingTime: "15 min",
    ingredients: ["250g rigatoni", "1/2 onion", "2 cloves garlic", "1/4 cup tomato paste", "2 tbsp vodka", "1/2 cup heavy cream", "Chili flakes to taste", "Parmesan for serving"],
    content: [
      { type: "text", value: "This spicy vodka pasta went viral for a reason." },
      { type: "text", value: "Sauté the onion and garlic until translucent." },
    ],
  },
  {
    id: "6", title: "Sunday Market Guide: What to buy", category: "Guides",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop",
    height: "aspect-[4/5]",
    content: [
      { type: "text", value: "Navigating the Sunday market can be overwhelming." },
      { type: "image", value: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=800&auto=format&fit=crop" },
      { type: "text", value: "Head straight to the artisan baker at the north entrance." },
    ],
  },
];

export const MOCK_POSTS: Post[] = [
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
      { type: "text", value: "The Street Food Festival is just around the corner." },
      { type: "text", value: "Over 30 food trucks, live music, and a dedicated craft beer section." },
    ],
    eventId: "3",
    createdAt: "2024-11-01",
  },
];
