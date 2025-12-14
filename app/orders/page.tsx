"use server"

import { Suspense } from "react";
import { eq, desc } from "drizzle-orm";

import OrdersTable from "@/components/orders";
import { db } from "@/db";
import { orders, customers, products } from "@/db/schema";

export async function createOrder(form: FormData) {
    const customerId = form.get("customerId");
    const productId = form.get("productId");
    const quantity = form.get("quantity");
    const status = form.get("status");
    const notes = form.get("notes");
    const deliveryAddress = form.get("deliveryAddress");

    let product = await db.select()
        .from(products)
        .where(eq(products.id, parseInt(productId!.toString())))
        .get();

    await db.insert(orders)
        .values({
            customerId: parseInt(customerId!.toString()),
            productId: parseInt(productId!.toString()),
            quantity: parseInt(quantity!.toString()),
            priceAtTime: product!.price,
            totalAmount: product!.price * parseInt(quantity!.toString()),
            status: status?.toString() || "pending",
            deliveryAddress: deliveryAddress?.toString() || null,
            notes: notes?.toString() || null,
        });

    await db.update(products)
        .set({ stock: product!.stock - parseInt(quantity!.toString()) })
        .where(eq(products.id, parseInt(productId!.toString())));

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/orders");
}

export async function updateOrderStatus(form: FormData) {
    const orderId = form.get("orderId");
    const status = form.get("status");

    await db.update(orders)
        .set({ status: status!.toString() })
        .where(eq(orders.id, parseInt(orderId!.toString())));

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/orders");
}

export async function deleteOrder(form: FormData) {
    const orderId = form.get("orderId");

    await db.delete(orders)
        .where(eq(orders.id, parseInt(orderId!.toString())));

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/orders");
}

export async function getOrderDetails(orderId: number) {
    const orderData = await db
        .select({
            order: orders,
            customer: customers,
            product: products,
        })
        .from(orders)
        .leftJoin(customers, eq(orders.customerId, customers.id))
        .leftJoin(products, eq(orders.productId, products.id))
        .where(eq(orders.id, orderId))
        .get();

    if (!orderData) return null;

    return {
        ...orderData.order,
        customer: orderData.customer,
        product: orderData.product,
    };
}

export default async function Page() {
    let allOrders = db
        .select({
            order: orders,
            customer: customers,
        })
        .from(orders)
        .leftJoin(customers, eq(orders.customerId, customers.id))
        .orderBy(desc(orders.createdAt));

    let allCustomers = db.select().from(customers);
    let allProducts = db.select().from(products);

    return (
        <Suspense fallback={<p>loading</p>}>
            <OrdersTable orders={allOrders} customers={allCustomers} products={allProducts} />
        </Suspense>
    );
}


