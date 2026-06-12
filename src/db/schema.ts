import { pgTable, uuid, text, numeric, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  joined: numeric("joined").notNull().default("0"),
  maxParticipants: numeric("max_participants").notNull().default("0"),
  isPast: boolean("is_past").notNull().default(false),
  hidden: boolean("hidden").notNull().default(false),
  attendees: jsonb("attendees").notNull().default("[]"),
  image: text("image").notNull().default(""),
  tags: jsonb("tags").notNull().default("[]"),
  groupId: text("group_id"),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  owner: text("owner").notNull(),
  members: jsonb("members").notNull().default("[]"),
  image: text("image"),
  content: jsonb("content"),
});

export const tips = pgTable("tips", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull().default(""),
  height: text("height"),
  cookingTime: text("cooking_time"),
  ingredients: jsonb("ingredients"),
  address: text("address"),
  hidden: boolean("hidden").notNull().default(false),
  authorEmail: text("author_email"),
  content: jsonb("content").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: jsonb("content").notNull().default("[]"),
  eventId: text("event_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  authorEmail: text("author_email"),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: text("event_id").notNull(),
  qrDataUrl: text("qr_data_url").notNull(),
  type: text("type").notNull(),
  purchaseDate: text("purchase_date").notNull(),
  event: jsonb("event").notNull(),
});
