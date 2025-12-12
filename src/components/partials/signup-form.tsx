'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/utils/authHelperClient';
import { authClient } from '@/lib/auth-client';

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/dashboard',
            });
        } catch (err) {
            toast.error('Google Sign-In Failed', {
                description: <span className="text-red-500">Unable to sign in with Google. Please try again.</span>,
            });
            console.error('Google sign-in error:', err);
            setIsGoogleLoading(false);
        }
    };

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
                            Your account has been created. Redirecting to login...
                        </span>
                    ),
                });
                // Redirect to login page after successful signup
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
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
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isGoogleLoading}
                >
                    {isGoogleLoading ? (
                        'Connecting...'
                    ) : (
                        <>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </>
                    )}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                        Or continue with email
                    </span>
                </div>
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
                <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
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
