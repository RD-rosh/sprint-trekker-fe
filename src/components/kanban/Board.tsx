// components/kanban/Board.tsx
'use client';

import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
// ... other imports

export default function KanbanBoard({ projectId }: { projectId: string }) {
    const [issues, setIssues] = useState<Issue[]>([]);

    const handleDragEnd = (event: DragEndEvent) => {
        // Update status on drag between columns
        // Call API / Server Action to update issue status
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-8 h-[calc(100vh-180px)]">
                {['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'].map(status => (
                    <Column
                        key={status}
                        status={status}
                        issues={issues.filter(i => i.status === status)}
                    />
                ))}
            </div>
        </DndContext>
    );
}