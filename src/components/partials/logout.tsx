'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/utils/authHelperClient';
import { useRouter } from 'next/navigation';

const LogOutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        signOut();
        router.push('/');
    };

    return (
        <Button variant="outline" onClick={handleLogout} className="text-sm w-full">
            Logout
        </Button>
    );
};

export default LogOutButton;
