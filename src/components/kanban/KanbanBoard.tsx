'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import IssueCard from './IssueCard';
import Column from './Column';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import CreateIssueDrawer from '@/components/issue/CreateIssueDrawer';
import IssueDetailsDialog from '@/components/issue/IssueDetailsDialog';
import SprintSelector from '@/components/sprint/SprintSelector';

const columns = [
    { id: 'BACKLOG', title: 'Backlog', color: 'zinc' },
    { id: 'TODO', title: 'To Do', color: 'blue' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'amber' },
    { id: 'DONE', title: 'Done', color: 'emerald' },
];

export default function KanbanBoard({ projectId }: { projectId: string }) {
    const [issues, setIssues] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null);
    const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [filterSprint, setFilterSprint] = useState<string>('all');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const fetchIssues = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/projects/${projectId}/board`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setProject(data);
                setIssues(Array.isArray(data.issues) ? data.issues : []);
            } else {
                toast.error('Failed to load project details');
            }
        } catch (err) {
            toast.error('Failed to load project details');
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [projectId]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeIssue = issues.find(i => i._id === active.id);
        if (!activeIssue) return;

        // Resolve new status — either from column ID or from target card's status
        let newStatus = over.id as string;
        const overIssue = issues.find(i => i._id === over.id);
        if (overIssue) {
            newStatus = overIssue.status;
        }

        // Validate against columns
        const isValidStatus = columns.some(col => col.id === newStatus);
        if (!isValidStatus) return;

        if (activeIssue.status !== newStatus) {
            // Optimistic update
            setIssues(prev => prev.map(issue =>
                issue._id === active.id ? { ...issue, status: newStatus } : issue
            ));

            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await fetch(`/api/issues/${active.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                });
                if (!res.ok) throw new Error('Failed to update status');
                toast.success('Issue moved successfully');
            } catch (err) {
                toast.error('Failed to update issue');
                fetchIssues(); // Revert on error
            }
        }
    };

    const members = project?.organization?.members || [];
    const sprints = project?.sprints || [];

    const filteredIssues = issues.filter(issue => {
        if (filterSprint === 'all') return true;
        if (filterSprint === 'backlog') return !issue.sprint;
        return issue.sprint?._id === filterSprint || issue.sprint === filterSprint;
    });

    return (
        <>
            {/* Sprint Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <SprintSelector projectId={projectId} onSprintChange={setFilterSprint} />
                <p className="text-xs text-zinc-500">
                    {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
                </p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={(e) => setActiveId(e.active.id as string)}
                onDragCancel={() => setActiveId(null)}
            >
                <div className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-240px)]">
                    {columns.map((column) => {
                        const columnIssues = filteredIssues.filter(issue => issue.status === column.id);

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
                                        <IssueCard
                                            key={issue._id}
                                            issue={issue}
                                            onClick={() => {
                                                setSelectedIssue(issue);
                                                setDetailsOpen(true);
                                            }}
                                        />
                                    ))}
                                </SortableContext>

                                <CreateIssueDrawer
                                    projectId={projectId}
                                    defaultStatus={column.id as any}
                                    onIssueCreated={fetchIssues}
                                    trigger={
                                        <Button variant="ghost" className="w-full mt-4 text-zinc-400 hover:text-white">
                                            <Plus className="mr-2 h-4 w-4" /> Add Issue
                                        </Button>
                                    }
                                />
                            </Column>
                        );
                    })}
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeId ? <IssueCard issue={issues.find(i => i._id === activeId)} isDragging /> : null}
                </DragOverlay>
            </DndContext>

            {selectedIssue && (
                <IssueDetailsDialog
                    issue={selectedIssue}
                    isOpen={detailsOpen}
                    onClose={() => {
                        setDetailsOpen(false);
                        setSelectedIssue(null);
                    }}
                    onIssueUpdated={fetchIssues}
                    members={members}
                    sprints={sprints}
                />
            )}
        </>
    );
}