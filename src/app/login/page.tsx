'use client';

import { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, GitBranch, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Welcome back!');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success('Account created successfully!');
            }
            window.location.href = '/organizations'; // Redirect after success
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success('Signed in with Google');
            window.location.href = '/organizations';
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-4">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">S</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white">Sprint Trekker</h1>
                    </div>
                </div>

                <Card className="border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl text-white">
                            {isLogin ? 'Welcome back' : 'Create your account'}
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            {isLogin
                                ? 'Sign in to continue to your workspace'
                                : 'Join the best sprint management tool'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Google Sign In */}
                        <Button
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                            variant="outline"
                            className="w-full h-12 text-base border-zinc-700 hover:bg-zinc-800"
                        >
                            {googleLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.22-1 2.25-2.13 2.94v2.73h3.45c2.02-1.86 3.18-4.6 3.18-7.93z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.45-2.73c-.98.66-2.23 1.06-3.83 1.06-2.95 0-5.45-1.99-6.34-4.67H2.18v2.92C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.66 13.53c-.36-.97-.57-2-.57-3.03s.21-2.06.57-3.03V3.99H2.18C1.43 5.9 1 8.12 1 10.5c0 2.38.43 4.6 1.18 6.51z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.48 2.93c.9-2.68 3.4-4.62 6.34-4.62z" />
                                </svg>
                            )}
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="bg-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-zinc-950 px-2 text-zinc-500">or continue with email</span>
                            </div>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Alex Rivera"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={!isLogin}
                                        className="bg-zinc-900 border-zinc-800 focus:border-blue-500"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-zinc-900 border-zinc-800 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-zinc-900 border-zinc-800 focus:border-blue-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="text-center text-sm">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-zinc-500 mt-8">
                    By signing up, you agree to our Terms and Privacy Policy
                </p>
            </div>
        </div>
    );
}