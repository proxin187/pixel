"use server"

import { Suspense } from "react";
import { sql, desc, asc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { products, orders, customers } from "@/db/schema";
import ReportsContent from "@/components/dashboard";

export interface SalesTrendData {
    date: string;
    revenue: number;
    orderCount: number;
}

export interface ProductStats {
    id: number;
    name: string;
    totalRevenue: number;
    totalQuantity: number;
    stock: number;
    price: number;
}

export interface StockAlert {
    id: number;
    name: string;
    stock: number;
    price: number;
}

export interface OverviewStats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
}

export async function getOverviewStats(): Promise<OverviewStats> {
    // Get total revenue and orders
    const orderStats = await db
        .select({
            totalRevenue: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`,
            totalOrders: sql<number>`COUNT(${orders.id})`,
        })
        .from(orders);

    // Get total customers
    const customerCount = await db
        .select({
            count: sql<number>`COUNT(${customers.id})`,
        })
        .from(customers);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalOrders = orderStats[0]?.totalOrders || 0;
    const totalCustomers = customerCount[0]?.count || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
    };
}

export async function getSalesTrends(): Promise<SalesTrendData[]> {
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await db
        .select({
            date: sql<string>`DATE(${orders.createdAt} / 1000, 'unixepoch')`,
            revenue: sql<number>`SUM(${orders.totalAmount})`,
            orderCount: sql<number>`COUNT(${orders.id})`,
        })
        .from(orders)
        .where(gte(orders.createdAt, thirtyDaysAgo))
        .groupBy(sql`DATE(${orders.createdAt} / 1000, 'unixepoch')`)
        .orderBy(asc(sql`DATE(${orders.createdAt} / 1000, 'unixepoch')`));

    return salesData.map(item => ({
        date: item.date,
        revenue: item.revenue,
        orderCount: item.orderCount,
    }));
}

export async function getBestSellingProducts(): Promise<ProductStats[]> {
    const productStats = await db
        .select({
            id: products.id,
            name: products.name,
            totalRevenue: sql<number>`SUM(${orders.totalAmount})`,
            totalQuantity: sql<number>`SUM(${orders.quantity})`,
            stock: products.stock,
            price: products.price,
        })
        .from(orders)
        .innerJoin(products, eq(orders.productId, products.id))
        .groupBy(products.id, products.name, products.stock, products.price)
        .orderBy(desc(sql`SUM(${orders.totalAmount})`))
        .limit(10);

    return productStats;
}

export async function getLowStockProducts(): Promise<StockAlert[]> {
    const lowStock = await db
        .select({
            id: products.id,
            name: products.name,
            stock: products.stock,
            price: products.price,
        })
        .from(products)
        .where(sql`${products.stock} <= 10`)
        .orderBy(asc(products.stock));

    return lowStock;
}

export default async function ReportsPage() {
    const overviewStats = getOverviewStats();
    const salesTrends = getSalesTrends();
    const bestSellingProducts = getBestSellingProducts();
    const lowStockProducts = getLowStockProducts();

    return (
        <Suspense fallback={<p>Loading dashboard...</p>}>
            <ReportsContent
                overviewStats={overviewStats}
                salesTrends={salesTrends}
                bestSellingProducts={bestSellingProducts}
                lowStockProducts={lowStockProducts}
            />
        </Suspense>
    );
}


