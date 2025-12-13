import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";


// TODO: support for having images attached to products
export const products = sqliteTable("products", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text().notNull(),
    price: integer().notNull(),
    stock: integer().notNull(),
});


