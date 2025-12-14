"use client"

import { useState, useEffect } from "react";
import { createOrder, updateOrderStatus, deleteOrder } from "@/app/orders/page";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogMedia,
} from "@/components/ui/alert-dialog"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Trash2, Pencil, Plus, Ellipsis, Package } from "lucide-react";

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface Order {
    id: number;
    customerId: number;
    productId: number;
    quantity: number;
    priceAtTime: number;
    totalAmount: number;
    status: string;
    deliveryAddress: string | null;
    notes: string | null;
    createdAt: Date | null;
}

interface OrderWithRelations {
    order: Order;
    customer: Customer | null;
}

interface OrdersTableProps {
    orders: Promise<OrderWithRelations[]>;
    customers: Promise<Customer[]>;
    products: Promise<Product[]>;
}

const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

export default function OrdersTable({ orders, customers, products }: OrdersTableProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [ordersList, setOrdersList] = useState<OrderWithRelations[]>([]);
    const [customersList, setCustomersList] = useState<Customer[]>([]);
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("pending");
    const [editStatus, setEditStatus] = useState<string>("");

    useEffect(() => {
        orders.then(data => setOrdersList(data));
        customers.then(data => setCustomersList(data));
        products.then(data => setProductsList(data));
    }, [orders, customers, products]);

    const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("customerId", selectedCustomerId);
        formData.append("productId", selectedProductId);
        formData.append("status", selectedStatus);
        await createOrder(formData);
        setIsCreateDialogOpen(false);
        setSelectedCustomerId("");
        setSelectedProductId("");
        setSelectedStatus("pending");
    };

    const handleUpdateOrderStatus = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("status", editStatus);
        await updateOrderStatus(formData);
        setIsEditDialogOpen(false);
        setEditingOrder(null);
    };

    const handleDeleteOrder = async (id: number) => {
        const formData = new FormData();
        formData.append("orderId", id.toString());
        await deleteOrder(formData);
    };

    const openEditDialog = (order: Order) => {
        setEditingOrder(order);
        setEditStatus(order.status);
        setIsEditDialogOpen(true);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-700",
            processing: "bg-blue-100 text-blue-700",
            shipped: "bg-purple-100 text-purple-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const getProductById = (id: number) => {
        return productsList.find(p => p.id === id);
    };

    const getMaxQuantity = (productId: string) => {
        const product = productsList.find(p => p.id === parseInt(productId));
        return product?.stock || 0;
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Orders</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Order
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleCreateOrder}>
                            <DialogHeader>
                                <DialogTitle>Create New Order</DialogTitle>
                                <DialogDescription>
                                    Fill in the order details.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="customer">Customer *</Label>
                                    <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customersList.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name} ({customer.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="product">Product *</Label>
                                    <Select value={selectedProductId} onValueChange={setSelectedProductId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productsList.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name} (${(product.price / 100).toFixed(2)}) - Stock: {product.stock}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">Quantity *</Label>
                                    <Input id="quantity" name="quantity" type="number" min="1" max={selectedProductId ? getMaxQuantity(selectedProductId) : undefined} required />
                                    {selectedProductId && (
                                        <p className="text-xs text-muted-foreground">
                                            Available stock: {getMaxQuantity(selectedProductId)}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                                    <Input id="deliveryAddress" name="deliveryAddress" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea id="notes" name="notes" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={!selectedCustomerId || !selectedProductId}>
                                    Create Order
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Order Status Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleUpdateOrderStatus}>
                        <DialogHeader>
                            <DialogTitle>Update Order Status</DialogTitle>
                            <DialogDescription>
                                Change the status of order #{editingOrder?.id}.
                            </DialogDescription>
                        </DialogHeader>
                        <input type="hidden" name="orderId" value={editingOrder?.id || ""} />
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status *</Label>
                                <Select value={editStatus} onValueChange={setEditStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Update Status</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px] pl-6">Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="w-[80px]">Qty</TableHead>
                            <TableHead className="w-[120px]">Total</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="w-[120px]">Date</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ordersList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No orders found. Create your first order to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            ordersList.map(({ order, customer }) => {
                                const product = getProductById(order.productId);
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className="pl-6 font-medium">#{order.id}</TableCell>
                                        <TableCell>{customer?.name || "N/A"}</TableCell>
                                        <TableCell>{product?.name || "N/A"}</TableCell>
                                        <TableCell>{order.quantity}</TableCell>
                                        <TableCell className="font-medium">
                                            ${(order.totalAmount / 100).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Ellipsis />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(order)}>
                                                        <Pencil />
                                                        Update Status
                                                    </DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Trash2 />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent size="sm">
                                                            <AlertDialogHeader>
                                                                <AlertDialogMedia>
                                                                    <Package />
                                                                </AlertDialogMedia>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete order #{order.id}.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>
                                                                    Confirm
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}


