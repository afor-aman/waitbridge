'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/partials/app-sidebar';
import { SessionProvider, useSessionContext } from '@/contexts/SessionContext';
import { Loader2, Save, Monitor, Smartphone } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/store/dashboardStore';
import { useEditorStore } from '@/store/editorStore';
import { toast } from 'sonner';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { session, isPending } = useSessionContext();
    const router = useRouter();
    const pathname = usePathname();
    const { activeTab, setActiveTab, previewMode, setPreviewMode } = useDashboardStore();
    const { getState } = useEditorStore();
    const [saving, setSaving] = useState(false);

    // Extract waitlist ID from pathname
    const waitlistId = pathname?.match(/\/dashboard\/([^\/]+)\/edit/)?.[1];
    const isEditPage = pathname?.includes('/edit');

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/signup');
        }
    }, [session, isPending, router]);

    // Save settings
    const handleSave = async () => {
        if (!waitlistId) return;
        
        setSaving(true);
        try {
            const currentState = getState();
            const res = await fetch(`/api/waitlist/${waitlistId}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentState),
            });

            if (res.ok) {
                toast.success('Settings saved successfully!');
            } else {
                const err = await res.text();
                toast.error(`Failed to save: ${err}`);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

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
                    <div className="flex items-center justify-between flex-1">
                        {isEditPage && (
                            <>
                                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                                    <TabsList className="grid w-[600px] grid-cols-4">
                                        <TabsTrigger value="edit">Edit</TabsTrigger>
                                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                        <TabsTrigger value="submissions">Submissions</TabsTrigger>
                                        <TabsTrigger value="share">Share</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                
                                <div className="flex items-center gap-2">
                                    {activeTab === 'edit' && (
                                        <div className="flex items-center gap-1 border rounded-md p-1">
                                            <Button
                                                type="button"
                                                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setPreviewMode('desktop')}
                                                className="h-8 px-3"
                                            >
                                                <Monitor className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setPreviewMode('mobile')}
                                                className="h-8 px-3"
                                            >
                                                <Smartphone className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <Button onClick={handleSave} disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
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
