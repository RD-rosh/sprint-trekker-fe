'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';
import IssueCard from './IssueCard';
import Column from './Column';
import { toast } from 'sonner';

const columns = [
    { id: 'BACKLOG', title: 'Backlog', color: 'zinc' },
    { id: 'TODO', title: 'To Do', color: 'blue' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'amber' },
    { id: 'DONE', title: 'Done', color: 'emerald' },
];

export default function KanbanBoard({ projectId }: { projectId: string }) {
    const [issues, setIssues] = useState<any[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const fetchIssues = async () => {
        // TODO: Replace with your API call
        // const res = await fetch(`/api/projects/${projectId}/issues`);
        // const data = await res.json();
        // setIssues(data);
    };

    useEffect(() => {
        fetchIssues();
    }, [projectId]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeIssue = issues.find(i => i._id === active.id);
        const newStatus = over.id as string; // Column ID

        if (activeIssue.status !== newStatus) {
            // Optimistic update
            setIssues(prev => prev.map(issue =>
                issue._id === active.id ? { ...issue, status: newStatus } : issue
            ));

            // TODO: Call API to update status
            try {
                // await fetch(`/api/issues/${active.id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
                toast.success('Issue moved successfully');
            } catch (err) {
                toast.error('Failed to update issue');
                fetchIssues(); // Revert on error
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={(e) => setActiveId(e.active.id as string)}
            onDragCancel={() => setActiveId(null)}
        >
            <div className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-180px)]">
                {columns.map((column) => {
                    const columnIssues = issues.filter(issue => issue.status === column.id);

                    return (
                        <Column
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            count={columnIssues.length}
                            color={column.color}
                        >
                            <SortableContext items={columnIssues.map(i => i._id)} strategy={verticalListSortingStrategy}>
                                {columnIssues.map(issue => (
                                    <IssueCard key={issue._id} issue={issue} />
                                ))}
                            </SortableContext>

                            <Button variant="ghost" className="w-full mt-4 text-zinc-400 hover:text-white">
                                <Plus className="mr-2 h-4 w-4" /> Add Issue
                            </Button>
                        </Column>
                    );
                })}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeId ? <IssueCard issue={issues.find(i => i._id === activeId)} isDragging /> : null}
            </DragOverlay>
        </DndContext>
    );
}