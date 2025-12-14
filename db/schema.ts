import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";


// TODO: support for having images attached to products
export const products = sqliteTable("products", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text().notNull(),
    price: integer().notNull(),
    stock: integer().notNull(),
});

export const customers = sqliteTable("customers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    address: text("address"),
    postalCode: text("postal_code"),
    city: text("city"),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const orders = sqliteTable("orders", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    customerId: integer("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    priceAtTime: integer("price_at_time").notNull(),
    totalAmount: integer("total_amount").notNull(),
    status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
    deliveryAddress: text("delivery_address"),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});


