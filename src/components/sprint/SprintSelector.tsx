'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function SprintSelector({ projectId, onSprintChange }: {
    projectId: string;
    onSprintChange: (sprintId: string | null) => void;
}) {
    const [sprints, setSprints] = useState<any[]>([]);
    const [selectedSprint, setSelectedSprint] = useState<string | null>(null);

    useEffect(() => {
        // Fetch sprints
        fetch(`/api/sprints/project/${projectId}`)
            .then(res => res.json())
            .then(data => setSprints(data));
    }, [projectId]);

    return (
        <div className="flex items-center gap-3">
            <Select onValueChange={(value) => {
                setSelectedSprint(value);
                onSprintChange(value);
            }}>
                <SelectTrigger className="w-64 bg-zinc-900 border-zinc-800">
                    <SelectValue placeholder="Select Sprint" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="backlog">Backlog (No Sprint)</SelectItem>
                    {sprints.map(sprint => (
                        <SelectItem key={sprint._id} value={sprint._id}>
                            {sprint.name} ({sprint.status})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Sprint
            </Button>
        </div>
    );
}