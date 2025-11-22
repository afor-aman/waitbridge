'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/partials/app-sidebar';
import { SessionProvider, useSessionContext } from '@/contexts/SessionContext';
import { Loader2 } from 'lucide-react';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { session, isPending } = useSessionContext();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/signup');
        }
    }, [session, isPending, router]);

    // Show loading state while checking session
    if (isPending) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    // Don't render dashboard if not authenticated (redirect will happen)
    if (!session) {
        return null;
    }

    return (
        <SidebarProvider>
            <AppSidebar session={session} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <DashboardContent>{children}</DashboardContent>
        </SessionProvider>
    );
}
