import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ariaGuestContexts = pgTable("aria_guest_contexts", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  preferences: jsonb("preferences").notNull().default({}),
  profile: jsonb("profile").notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ariaActionRequests = pgTable("aria_action_requests", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: text("user_id"),
  type: text("type").notNull(),
  status: text("status").notNull(),
  title: text("title").notNull(),
  details: jsonb("details").notNull().default({}),
  confirmationMetadata: jsonb("confirmation_metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertAriaGuestContextSchema = createInsertSchema(ariaGuestContexts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAriaActionRequestSchema = createInsertSchema(ariaActionRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AriaGuestContext = typeof ariaGuestContexts.$inferSelect;
export type InsertAriaGuestContext = z.infer<typeof insertAriaGuestContextSchema>;
export type AriaActionRequest = typeof ariaActionRequests.$inferSelect;
export type InsertAriaActionRequest = z.infer<typeof insertAriaActionRequestSchema>;