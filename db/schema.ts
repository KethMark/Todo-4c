import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: varchar({ length: 191 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  gender: varchar({ length: 6 }).notNull(),
  completed: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
});
