"use client"

import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";

interface SalesTrendData {
    date: string;
    revenue: number;
    orderCount: number;
}

interface ProductStats {
    id: number;
    name: string;
    totalRevenue: number;
    totalQuantity: number;
    stock: number;
    price: number;
}

interface StockAlert {
    id: number;
    name: string;
    stock: number;
    price: number;
}

interface OverviewStats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
}

interface ReportsContentProps {
    overviewStats: Promise<OverviewStats>;
    salesTrends: Promise<SalesTrendData[]>;
    bestSellingProducts: Promise<ProductStats[]>;
    lowStockProducts: Promise<StockAlert[]>;
    profitabilityData: Promise<ProductStats[]>;
}

export default function ReportsContent({
    overviewStats,
    salesTrends,
    bestSellingProducts,
    lowStockProducts,
}: ReportsContentProps) {
    const [overview, setOverview] = useState<OverviewStats | null>(null);
    const [trends, setTrends] = useState<SalesTrendData[]>([]);
    const [bestSelling, setBestSelling] = useState<ProductStats[]>([]);
    const [lowStock, setLowStock] = useState<StockAlert[]>([]);

    useEffect(() => {
        overviewStats.then(setOverview);
        salesTrends.then(setTrends);
        bestSellingProducts.then(setBestSelling);
        lowStockProducts.then(setLowStock);
    }, [overviewStats, salesTrends, bestSellingProducts, lowStockProducts]);

    const formattedTrends = trends.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: item.revenue,
        orders: item.orderCount,
    }));

    const formattedBestSelling = bestSelling.slice(0, 5).map(item => ({
        name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
        revenue: item.totalRevenue,
        quantity: item.totalQuantity,
    }));

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your business performance and inventory status
                </p>
            </div>

            {overview && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <h3 className="text-2xl font-bold mt-2">
                                    ${overview.totalRevenue}
                                </h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <h3 className="text-2xl font-bold mt-2">{overview.totalOrders}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                                <h3 className="text-2xl font-bold mt-2">{overview.totalCustomers}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                                <h3 className="text-2xl font-bold mt-2">
                                    ${overview.averageOrderValue}
                                </h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Sales Trends (Last 30 Days)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Revenue ($)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="orders"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Orders"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Top 5 Best Selling Products</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formattedBestSelling}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Product Performance Details</h2>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Units Sold</TableHead>
                                <TableHead>Total Revenue</TableHead>
                                <TableHead>Current Stock</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bestSelling.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No sales data available yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                bestSelling.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.totalQuantity}</TableCell>
                                        <TableCell>${product.totalRevenue}</TableCell>
                                        <TableCell>
                                            <span className={`${product.stock <= 10 ? 'text-red-600 font-semibold' : ''}`}>
                                                {product.stock}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <h2 className="text-xl font-bold">Low Stock Alerts</h2>
                </div>
                {lowStock.length === 0 ? (
                    <p className="text-muted-foreground">All products are adequately stocked.</p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Current Stock</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lowStock.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <span className={`font-semibold ${
                                                product.stock === 0 ? 'text-red-600' :
                                                product.stock <= 5 ? 'text-orange-600' :
                                                'text-yellow-600'
                                            }`}>
                                                {product.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                product.stock === 0 ? 'bg-red-100 text-red-700' :
                                                product.stock <= 5 ? 'bg-orange-100 text-orange-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {product.stock === 0 ? 'Out of Stock' :
                                                 product.stock <= 5 ? 'Critical' : 'Low Stock'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
}


