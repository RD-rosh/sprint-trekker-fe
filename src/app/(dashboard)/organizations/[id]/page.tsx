'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, FolderKanban, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MembersDialog from '@/components/organization/MembersDialog';

interface Organization {
    _id: string;
    name: string;
    description?: string;
    owner: any;
    members: any[];
    projects: any[];
}

export default function OrganizationPage() {
    const params = useParams();
    const router = useRouter();
    const orgId = params.id as string;

    const [org, setOrg] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchOrganization = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/organizations/${orgId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setOrg(data);
        } catch (error) {
            toast.error('Failed to load organization');
            router.push('/organizations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orgId) fetchOrganization();
        // Grab the current DB user id from the token (sub is Firebase UID, we need the _id)
        // We store it after fetch so MembersDialog can mark "You"
        auth.currentUser?.getIdToken().then(async token => {
            try {
                const res = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const me = await res.json();
                    setCurrentUserId(me._id);
                }
            } catch (e) {
                // If /api/auth/me is not implemented, silently skip
            }
        });
    }, [orgId]);

    if (loading) return <div className="p-10 text-center text-zinc-400">Loading organization...</div>;
    if (!org) return <div className="p-10 text-center text-zinc-400">Organization not found</div>;

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: back + breadcrumbs */}
                        <Breadcrumbs
                            items={[
                                { label: 'Organizations', href: '/organizations' },
                                { label: org.name },
                            ]}
                        />

                        {/* Right: actions */}
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="px-3 py-1 hidden sm:flex">
                                {org.members.length} member{org.members.length !== 1 ? 's' : ''}
                            </Badge>

                            <MembersDialog
                                orgId={orgId}
                                members={org.members}
                                ownerId={org.owner?._id || org.owner}
                                currentUserId={currentUserId ?? undefined}
                                onMembersChanged={fetchOrganization}
                            />

                            <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Org title row */}
                    <div className="flex items-center gap-4 mt-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                            {org.name[0]}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">{org.name}</h1>
                            {org.description && (
                                <p className="text-zinc-400 mt-0.5 text-sm">{org.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-white">Projects</h2>
                    <Button className="bg-white text-black hover:bg-white/90">
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
                                className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all cursor-pointer group"
                                onClick={() => router.push(`/organizations/projects/${project._id}/board`)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center mb-2">
                                            <FolderKanban className="h-4 w-4 text-white" />
                                        </div>
                                        <Badge variant="secondary" className="text-[10px]">
                                            Board
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg group-hover:text-violet-300 transition-colors">
                                        {project.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-zinc-400 line-clamp-2">
                                        {project.description || 'No description provided'}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-4 text-xs text-zinc-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>Click to open board</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                            <FolderKanban className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-xl text-zinc-400">No projects yet</p>
                            <p className="text-sm text-zinc-500 mt-2">Create your first project in this organization</p>
                            <Button className="mt-6 bg-white text-black hover:bg-white/90">
                                <Plus className="mr-2 h-4 w-4" />
                                Create First Project
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}