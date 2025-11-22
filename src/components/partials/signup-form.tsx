'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/utils/authHelperClient';

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission and page refresh
        setIsLoading(true);

        // Basic validation
        if (password !== confirmPassword) {
            const errorMessage = 'Passwords do not match.';

            toast.error('Validation Error', {
                description: <span className="text-red-500">{errorMessage}</span>,
            });
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            const errorMessage = 'Password must be at least 6 characters long.';

            toast.error('Validation Error', {
                description: <span className="text-red-500">{errorMessage}</span>,
            });
            setIsLoading(false);
            return;
        }

        // Show loading toast
        const loadingToastId = toast.loading('Creating your account...', {
            description: (
                <span className="text-gray-500">Please wait while we set up your account.</span>
            ),
        });

        try {
            const result = await signUp(email, password, name, '');

            if (result?.error) {
                // Handle API error
                const errorMessage = result.error?.message || 'Signup failed. Please try again.';

                toast.error('Signup Failed', {
                    id: loadingToastId,
                    description: <span className="text-red-500">{errorMessage}</span>,
                });
            } else if (result?.data) {
                // Handle successful signup

                toast.success('Account Created Successfully!', {
                    id: loadingToastId,
                    description: (
                        <span className="text-green-500">
                            Your account has been created. You can now sign in.
                        </span>
                    ),
                });
                // router.push("/login");
            }
        } catch (err) {
            const errorMessage = 'Signup failed. Please try again.';

            toast.error('Signup Failed', {
                id: loadingToastId,
                description: <span className="text-red-500">{errorMessage}</span>,
            });
            console.error('Signup error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your information below to create your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
                
            </div>
            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </form>
    );
}
