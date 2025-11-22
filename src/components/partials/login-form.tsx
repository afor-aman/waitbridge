'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/utils/authHelperClient';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission and page refresh
        setIsLoading(true);

        // Show loading toast
        const loadingToastId = toast.loading('Signing you in...', {
            description: (
                <span className="text-gray-500">Please wait while we verify your credentials.</span>
            ),
        });

        try {
            const result = await signIn(email, password);

            if (result?.error) {
                // Handle API error
                const errorMessage =
                    result.error?.message || 'Login failed. Please check your credentials.';
                toast.error('Login Failed', {
                    id: loadingToastId,
                    description: <span className="text-red-500">{errorMessage}</span>,
                });
            } else if (result?.data) {
                // Handle successful login

                toast.success('Welcome back!', {
                    id: loadingToastId,
                    description: (
                        <span className="text-green-500">
                            You have been successfully logged in.
                        </span>
                    ),
                });
                // Redirect to dashboard after successful login
                router.push("/dashboard");
            }
        } catch (err) {
            const errorMessage = 'Login failed. Please check your credentials.';
            toast.error('Login Failed', {
                id: loadingToastId,
                description: <span className="text-red-500">{errorMessage}</span>,
            });
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                </Link>
            </div>
        </form>
    );
}
