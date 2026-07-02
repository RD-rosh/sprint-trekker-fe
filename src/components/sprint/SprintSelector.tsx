'use client';

import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { auth } from '@/lib/firebase';
import CreateSprintDialog from './CreateSprintDialog';

export default function SprintSelector({ projectId, onSprintChange }: {
    projectId: string;
    onSprintChange: (sprintId: string) => void;
}) {
    const [sprints, setSprints] = useState<any[]>([]);
    const [selectedSprint, setSelectedSprint] = useState<string>('all');

    const fetchSprints = useCallback(async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/sprints/project/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setSprints(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Failed to load sprints:', error);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) fetchSprints();
    }, [projectId, fetchSprints]);

    return (
        <div className="flex items-center gap-3">
            <Select onValueChange={(value: string) => {
                setSelectedSprint(value);
                onSprintChange(value);
            }} value={selectedSprint}>
                <SelectTrigger className="w-64 bg-zinc-900 border-zinc-800">
                    <SelectValue placeholder="Select Sprint" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-300">
                    <SelectItem value="all">All Sprints / Issues</SelectItem>
                    <SelectItem value="backlog">Backlog (No Sprint)</SelectItem>
                    {sprints.map(sprint => (
                        <SelectItem key={sprint._id} value={sprint._id}>
                            {sprint.name} ({sprint.status})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <CreateSprintDialog projectId={projectId} onSprintCreated={fetchSprints} />
        </div>
    );
}