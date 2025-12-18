"use client"

import Link from "next/link";

import {
    Package,
    ShoppingCart,
    LayoutDashboard,
    User,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Products", url: "/products", icon: Package },
    { title: "Customers", url: "/customers", icon: User },
    { title: "Orders", url: "/orders", icon: ShoppingCart },
];

export function AppSidebar() {
    return (
        <>
            <Sidebar>
                <SidebarHeader className="flex items-center justify-center h-14 border-b bg-background/95">
                    <div className="flex gap-2">
                        <Package className="h-6 w-6" />
                        <span className="text-lg font-semibold">Pixel Store</span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="bg-background/95">
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="h-14 border-t bg-background/95">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                        AD
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        <span className="font-medium">Admin</span>
                                        <span className="text-xs text-muted-foreground">admin@pixel.com</span>
                                    </div>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}


