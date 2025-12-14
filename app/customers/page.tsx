"use server"

import { Suspense } from "react";
import { eq, desc } from "drizzle-orm";

import CustomersTable from "@/components/customers";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";

export async function createCustomer(form: FormData) {
    const name = form.get("name");
    const email = form.get("email");
    const phone = form.get("phone");
    const address = form.get("address");
    const postalCode = form.get("postalCode");
    const city = form.get("city");
    const notes = form.get("notes");

    await db.insert(customers)
        .values({
            name: name!.toString(),
            email: email!.toString(),
            phone: phone?.toString() || null,
            address: address?.toString() || null,
            postalCode: postalCode?.toString() || null,
            city: city?.toString() || null,
            notes: notes?.toString() || null,
        });

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/customers");
}

export async function updateCustomer(form: FormData) {
    const id = form.get("id");
    const name = form.get("name");
    const email = form.get("email");
    const phone = form.get("phone");
    const address = form.get("address");
    const postalCode = form.get("postalCode");
    const city = form.get("city");
    const notes = form.get("notes");

    await db.update(customers)
        .set({
            name: name!.toString(),
            email: email!.toString(),
            phone: phone?.toString() || null,
            address: address?.toString() || null,
            postalCode: postalCode?.toString() || null,
            city: city?.toString() || null,
            notes: notes?.toString() || null,
        })
        .where(eq(customers.id, parseInt(id!.toString())));

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/customers");
}

export async function deleteCustomer(form: FormData) {
    const id = form.get("id");

    await db.delete(customers)
        .where(eq(customers.id, parseInt(id!.toString())));

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/customers");
}

export async function getCustomerOrders(customerId: number) {
    const customerOrders = await db
        .select({
            id: orders.id,
            totalAmount: orders.totalAmount,
            status: orders.status,
            createdAt: orders.createdAt,
            notes: orders.notes,
        })
        .from(orders)
        .where(eq(orders.customerId, customerId))
        .orderBy(desc(orders.createdAt));

    return customerOrders;
}

export default async function Page() {
    let allCustomers = db.select().from(customers);

    return (
        <Suspense fallback={<p>loading</p>}>
            <CustomersTable customers={allCustomers} />
        </Suspense>
    );
}




