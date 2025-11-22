'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';

import LogOutButton from './logout';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppSidebar() {
    const { data: session } = useSession();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3 p-2">
                    <Avatar>
                        <AvatarImage src={session?.user?.image || ''} />
                        <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate">{session?.user?.name || 'User'}</span>
                        <span className="text-xs text-muted-foreground truncate">{session?.user?.email || ''}</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Placeholder for future menu items */}
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Link href="/dashboard">Dashboard</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-2">
                    <LogOutButton />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
