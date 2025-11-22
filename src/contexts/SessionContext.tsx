'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

type Session = {
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    } | null;
} | null;

interface SessionContextType {
    session: Session;
    isPending: boolean;
    refetch: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session>(null);
    const [isPending, setIsPending] = useState(true);

    const fetchSession = async () => {
        try {
            const { data } = await authClient.getSession();
            // Normalize the data to match Session type (convert undefined to null for image)
            const normalizedData = data ? {
                ...data,
                user: data.user ? {
                    ...data.user,
                    image: data.user.image ?? null
                } : null
            } : null;
            setSession(normalizedData);
        } catch (error) {
            console.error('Failed to fetch session:', error);
            setSession(null);
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        // Fetch session only once on mount
        fetchSession();
    }, []);

    return (
        <SessionContext.Provider value={{ session, isPending, refetch: fetchSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSessionContext must be used within a SessionProvider');
    }
    return context;
}

