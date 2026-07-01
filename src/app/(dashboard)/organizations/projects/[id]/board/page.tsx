'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectBoardPage() {
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${await /* get token from firebase */ ''}`,
                    },
                });
                const data = await res.json();
                setProject(data);
            } catch (error) {
                toast.error("Failed to load project");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchProject();
    }, [projectId]);

    if (loading) return <div className="p-8">Loading project...</div>;
    if (!project) return <div className="p-8">Project not found</div>;

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Project Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">{project.name[0]}</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">{project.name}</h1>
                                {project.description && (
                                    <p className="text-zinc-400 mt-1">{project.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                {project.sprints?.length || 0} Active Sprints
                            </Badge>

                            <Button variant="outline" size="sm">
                                <Users className="mr-2 h-4 w-4" />
                                Members
                            </Button>

                            <Button variant="outline" size="sm">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>

                            <Button size="sm" className="bg-white text-black hover:bg-white/90">
                                <Plus className="mr-2 h-4 w-4" />
                                New Issue
                            </Button>
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