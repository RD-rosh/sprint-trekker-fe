'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Organization {
    _id: string;
    name: string;
    description?: string;
    members: any[];
    projects: any[];
    createdAt: string;
}

export default function OrganizationsPage() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newOrg, setNewOrg] = useState({ name: '', description: '' });
    const [creating, setCreating] = useState(false);

    // Listen to Firebase Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                dispatch(setUser({
                    _id: firebaseUser.uid,
                    firebaseUid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
                    avatar: firebaseUser.photoURL || undefined,
                }));

                await fetchOrganizations(firebaseUser.uid);
            } else {
                window.location.href = '/login';
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [dispatch]);

    const fetchOrganizations = async (userId: string) => {
        try {
            const res = await fetch('/api/organizations', {
                headers: {
                    Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
                },
            });
            const data = await res.json();
            setOrganizations(data);
        } catch (error) {
            toast.error('Failed to load organizations');
        }
    };

    const createOrganization = async () => {
        if (!newOrg.name.trim()) return;

        setCreating(true);
        try {
            const res = await fetch('/api/organizations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
                },
                body: JSON.stringify(newOrg),
            });

            if (res.ok) {
                toast.success('Organization created successfully!');
                setNewOrg({ name: '', description: '' });
                setIsCreateOpen(false);
                // Refresh list
                if (auth.currentUser) await fetchOrganizations(auth.currentUser.uid);
            }
        } catch (error) {
            toast.error('Failed to create organization');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold">S</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Sprint Trekker</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {user?.avatar && (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            )}
                            <div>
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-zinc-500">{user?.email}</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => auth.signOut()}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight">Organizations</h2>
                        <p className="text-zinc-400 mt-2">Select or create a workspace to get started</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                <Plus className="mr-2 h-5 w-5" />
                                New Organization
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800">
                            <DialogHeader>
                                <DialogTitle>Create New Organization</DialogTitle>
                                <DialogDescription>
                                    Create a workspace for your team
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div>
                                    <Label>Organization Name</Label>
                                    <Input
                                        placeholder="Acme Corp"
                                        value={newOrg.name}
                                        onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Description (optional)</Label>
                                    <Textarea
                                        placeholder="Building the future of project management..."
                                        value={newOrg.description}
                                        onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                                    />
                                </div>

                                <Button onClick={createOrganization} disabled={creating} className="w-full">
                                    {creating ? 'Creating...' : 'Create Organization'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Organizations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org) => (
                        <Card
                            key={org._id}
                            className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-200 group cursor-pointer"
                            onClick={() => window.location.href = `/organizations/${org._id}`}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl font-bold">
                                        {org.name[0].toUpperCase()}
                                    </div>
                                    <span>{org.name}</span>
                                </CardTitle>
                                {org.description && (
                                    <CardDescription className="line-clamp-2">
                                        {org.description}
                                    </CardDescription>
                                )}
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{org.members.length} members</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(org.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button variant="ghost" className="group-hover:text-blue-400">
                                        Enter Workspace
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {organizations.length === 0 && (
                        <div className="col-span-full text-center py-20 text-zinc-500">
                            <p className="text-xl">No organizations yet</p>
                            <p className="mt-2">Create your first one to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}