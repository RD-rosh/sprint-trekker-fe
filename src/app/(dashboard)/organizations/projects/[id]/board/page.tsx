'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MembersDialog from '@/components/organization/MembersDialog';

export default function ProjectBoardPage() {
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProject = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setProject(data);
        } catch (error) {
            toast.error('Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchProject();
    }, [projectId]);

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="text-zinc-400 animate-pulse">Loading project...</div>
        </div>
    );
    if (!project) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="text-zinc-400">Project not found</div>
        </div>
    );

    const orgId = project.organization?._id || project.organization;
    const orgName = project.organization?.name || 'Organization';
    const members = project.organization?.members || [];
    const ownerId = project.organization?.owner?._id || project.organization?.owner;

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Project Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <div className="flex items-center justify-between">

                        {/* Left: breadcrumbs */}
                        <Breadcrumbs
                            items={[
                                { label: 'Organizations', href: '/organizations' },
                                { label: orgName, href: orgId ? `/organizations/${orgId}` : '/organizations' },
                                { label: project.name },
                            ]}
                        />

                        {/* Right: actions */}
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-sm px-3 py-1 hidden sm:flex">
                                {project.sprints?.length || 0} Sprint{project.sprints?.length !== 1 ? 's' : ''}
                            </Badge>

                            {orgId && (
                                <MembersDialog
                                    orgId={orgId}
                                    members={members}
                                    ownerId={ownerId}
                                    onMembersChanged={fetchProject}
                                />
                            )}

                            <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Project title row */}
                    <div className="flex items-center gap-3 mt-4">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">{project.name[0]}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">{project.name}</h1>
                            {project.description && (
                                <p className="text-zinc-400 text-sm mt-0.5">{project.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                <KanbanBoard projectId={projectId} />
            </div>
        </div>
    );
}