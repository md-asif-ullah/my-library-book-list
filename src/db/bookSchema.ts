import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const bookTable = pgTable("Books", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  price: integer("price").notNull(),
  writer: varchar("writer").notNull(),
  image: varchar("image").notNull(),
  rating: integer("rating").notNull(),
});
