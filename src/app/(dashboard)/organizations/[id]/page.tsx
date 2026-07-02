'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';

interface Organization {
    _id: string;
    name: string;
    description?: string;
    members: any[];
    projects: any[];
}

export default function OrganizationPage() {
    const params = useParams();
    const router = useRouter();
    const orgId = params.id as string;

    const [org, setOrg] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();

                const res = await fetch(`/api/organizations/${orgId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch');

                const data = await res.json();
                setOrg(data);
            } catch (error) {
                toast.error("Failed to load organization");
                router.push('/organizations');
            } finally {
                setLoading(false);
            }
        };

        if (orgId) fetchOrganization();
    }, [orgId, router]);

    if (loading) {
        return <div className="p-10 text-center">Loading organization...</div>;
    }

    if (!org) {
        return <div className="p-10 text-center">Organization not found</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/organizations')}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold">
                                    {org.name[0]}
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold tracking-tight">{org.name}</h1>
                                    {org.description && (
                                        <p className="text-zinc-400 mt-1">{org.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="px-4 py-1.5">
                                <Users className="mr-2 h-4 w-4" />
                                {org.members.length} Members
                            </Badge>

                            <Button variant="outline">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold">Projects</h2>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {org.projects && org.projects.length > 0 ? (
                        org.projects.map((project: any) => (
                            <Card
                                key={project._id}
                                className="bg-zinc-900 border-zinc-800 hover:border-blue-500 transition-colors cursor-pointer"
                                onClick={() => router.push(`/organizations/projects/${project._id}/board`)}
                            >
                                <CardHeader>
                                    <CardTitle>{project.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-zinc-400 line-clamp-2">
                                        {project.description || "No description provided"}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                            <p className="text-xl text-zinc-400">No projects yet</p>
                            <p className="text-sm text-zinc-500 mt-2">Create your first project in this organization</p>
                            <Button className="mt-6" onClick={() => router.push(`/organizations/${orgId}/projects/new`)}>Create First Project</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}