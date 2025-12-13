"use client"

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
    return (
        <header className="sticky top-0 z-50 h-14 w-full border-b bg-background/95">
            <div className="flex h-14 items-center gap-4 px-4">
                <SidebarTrigger />

                 <div className="flex flex-1 items-center justify-center">
                    <div className="flex items-center gap-2 w-full max-w-md">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="h-9 border-0 shadow-none focus-visible:ring-0" />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600" />
                    </Button>
                </div>
            </div>
        </header>
    );
}


