"use server"

import { Suspense } from "react";
import { eq } from "drizzle-orm";

import { ProductsTable } from "@/components/products";
import { db } from "@/db";
import { products } from "@/db/schema";


export async function createProduct(form: FormData) {
    await db.insert(products)
        .values({
            name: form.get("name")!.toString(),
            description: form.get("description")!.toString(),
            price: parseInt(form.get("price")!.toString()),
            stock: parseInt(form.get("stock")!.toString()),
            imageUrl: form.get("image_url")!.toString(),
        });

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/products");
}

export async function updateProduct(form: FormData) {
    const id = form.get("id");
    const name = form.get("name");
    const description = form.get("description");
    const price = form.get("price");
    const stock = form.get("stock");

    await db.update(products)
        .set({
            name: name!.toString(),
            description: description!.toString(),
            price: parseInt(price!.toString()),
            stock: parseInt(stock!.toString()),
            imageUrl: form.get("image_url")!.toString(),
        })
        .where(eq(products.id, parseInt(id!.toString())));

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/products");
}

export async function deleteProduct(form: FormData) {
    await db.delete(products)
        .where(eq(products.id, parseInt(form.get("id")!.toString())));

    const { revalidatePath } = await import("next/cache");

    revalidatePath("/products");
}

export default async function Page() {
    let allProducts = db.select().from(products);

    return (
        <Suspense fallback={<p>loading</p>}>
            <ProductsTable products={allProducts} />
        </Suspense>
    )
}


