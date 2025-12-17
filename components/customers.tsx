"use client"

import { useState, useEffect } from "react";
import { createCustomer, updateCustomer, deleteCustomer, getCustomerOrders } from "@/app/customers/page";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Trash2, Pencil, Plus, Ellipsis, Eye, Mail, Phone, MapPin } from "lucide-react";

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    postalCode: string | null;
    city: string | null;
    notes: string | null;
    createdAt: Date | null;
}

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: Date | null;
    notes: string | null;
}

interface CustomersTableProps {
    customers: Promise<Customer[]>;
}

export default function CustomersTable({ customers }: CustomersTableProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [customersList, setCustomersList] = useState<Customer[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        customers.then(data => setCustomersList(data));
    }, [customers]);

    const handleCreateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createCustomer(formData);
        setIsCreateDialogOpen(false);
    };

    const handleUpdateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await updateCustomer(formData);
        setIsEditDialogOpen(false);
        setEditingCustomer(null);
    };

    const handleDeleteCustomer = async (id: number) => {
        const formData = new FormData();
        formData.append("id", id.toString());
        await deleteCustomer(formData);
    };

    const openEditDialog = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsEditDialogOpen(true);
    };

    const openViewDialog = async (customer: Customer) => {
        setViewingCustomer(customer);
        setIsViewDialogOpen(true);
        setLoadingOrders(true);
        const orders = await getCustomerOrders(customer.id);
        setCustomerOrders(orders);
        setLoadingOrders(false);
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Customers</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Customer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleCreateCustomer}>
                            <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                                <DialogDescription>
                                    Fill in the customer details.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input id="email" name="email" type="email" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" type="tel" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input id="postalCode" name="postalCode" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea id="notes" name="notes" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create Customer</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleUpdateCustomer}>
                        <DialogHeader>
                            <DialogTitle>Edit Customer</DialogTitle>
                            <DialogDescription>
                                Update the customer details.
                            </DialogDescription>
                        </DialogHeader>
                        <input type="hidden" name="id" value={editingCustomer?.id || ""} />
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name *</Label>
                                <Input id="edit-name" name="name" defaultValue={editingCustomer?.name || ""} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email *</Label>
                                <Input id="edit-email" name="email" type="email" defaultValue={editingCustomer?.email || ""} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input id="edit-phone" name="phone" type="tel" defaultValue={editingCustomer?.phone || ""} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-address">Address</Label>
                                <Input id="edit-address" name="address" defaultValue={editingCustomer?.address || ""} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-postalCode">Postal Code</Label>
                                    <Input id="edit-postalCode" name="postalCode" defaultValue={editingCustomer?.postalCode || ""} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-city">City</Label>
                                    <Input id="edit-city" name="city" defaultValue={editingCustomer?.city || ""} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-notes">Notes</Label>
                                <Textarea id="edit-notes" name="notes" defaultValue={editingCustomer?.notes || ""} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Update Customer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                    </DialogHeader>
                    {viewingCustomer && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{viewingCustomer.name}</h3>
                                    <div className="mt-2 space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span>{viewingCustomer.email}</span>
                                        </div>
                                        {viewingCustomer.phone && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-4 w-4" />
                                                <span>{viewingCustomer.phone}</span>
                                            </div>
                                        )}
                                        {(viewingCustomer.address || viewingCustomer.city) && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>
                                                    {viewingCustomer.address}
                                                    {viewingCustomer.postalCode && `, ${viewingCustomer.postalCode}`}
                                                    {viewingCustomer.city && ` ${viewingCustomer.city}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {viewingCustomer.notes && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium">Notes</p>
                                            <p className="text-sm text-muted-foreground mt-1">{viewingCustomer.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Order History</h3>
                                {loadingOrders ? (
                                    <p className="text-sm text-muted-foreground">Loading orders...</p>
                                ) : customerOrders.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No orders yet.</p>
                                ) : (
                                    <div className="border rounded-lg">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Order ID</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Total</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {customerOrders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell>#{order.id}</TableCell>
                                                        <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</TableCell>
                                                        <TableCell>${order.totalAmount}</TableCell>
                                                        <TableCell>
                                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] pl-6">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customersList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No customers found. Add your first customer to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customersList.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="pl-6 font-medium">{customer.name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone || "-"}</TableCell>
                                    <TableCell>{customer.city || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <Ellipsis />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openViewDialog(customer)}>
                                                    <Eye />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEditDialog(customer)}>
                                                    <Pencil />
                                                    Edit
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
                                                                <Trash2 />
                                                            </AlertDialogMedia>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete "{customer.name}" and all associated orders.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>Confirm</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}


