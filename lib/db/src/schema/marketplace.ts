import { createInsertSchema } from "drizzle-zod";
import { boolean, integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
};

export const jobsTable = pgTable("jobs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  companyInitials: text("company_initials").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  experience: text("experience").notNull(),
  salary: text("salary").notNull(),
  postedAt: text("posted_at").notNull(),
  imageUrl: text("image_url").notNull(),
  verified: boolean("verified").notNull().default(false),
  ...timestamps,
});

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  reviews: integer("reviews").notNull().default(0),
  seller: text("seller").notNull(),
  imageUrl: text("image_url").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  ...timestamps,
});

export const rentalsTable = pgTable("rentals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  pricePerDay: numeric("price_per_day", { precision: 10, scale: 2 }).notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  location: text("location").notNull(),
  owner: text("owner").notNull(),
  imageUrl: text("image_url").notNull(),
  available: boolean("available").notNull().default(true),
  ...timestamps,
});

export const workersTable = pgTable("workers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  profession: text("profession").notNull(),
  location: text("location").notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  experience: text("experience").notNull(),
  skills: text("skills").array().notNull(),
  imageUrl: text("image_url").notNull(),
  verified: boolean("verified").notNull().default(false),
  ...timestamps,
});

export const communitiesTable = pgTable("communities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  members: integer("members").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  topics: text("topics").array().notNull(),
  ...timestamps,
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({ createdAt: true, updatedAt: true });
export const insertProductSchema = createInsertSchema(productsTable).omit({ createdAt: true, updatedAt: true });
export const insertRentalSchema = createInsertSchema(rentalsTable).omit({ createdAt: true, updatedAt: true });
export const insertWorkerSchema = createInsertSchema(workersTable).omit({ createdAt: true, updatedAt: true });
export const insertCommunitySchema = createInsertSchema(communitiesTable).omit({ createdAt: true, updatedAt: true });

export type Job = z.infer<typeof insertJobSchema>;
export type Product = z.infer<typeof insertProductSchema>;
export type Rental = z.infer<typeof insertRentalSchema>;
export type Worker = z.infer<typeof insertWorkerSchema>;
export type Community = z.infer<typeof insertCommunitySchema>;