import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

export default function IssueCard({ issue, isDragging = false }: { issue: any; isDragging?: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: issue._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const priorityColors: any = {
        HIGH: 'bg-red-500',
        MEDIUM: 'bg-amber-500',
        LOW: 'bg-emerald-500',
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-4 cursor-grab active:cursor-grabbing bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all ${isDragging ? 'scale-105 shadow-2xl' : ''}`}
        >
            <div className="flex justify-between items-start mb-3">
                <p className="font-medium text-sm leading-snug">{issue.title}</p>
                <Badge variant="outline" className={`text-[10px] ${priorityColors[issue.priority] || 'bg-zinc-700'}`}>
                    {issue.priority}
                </Badge>
            </div>

            {issue.description && (
                <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{issue.description}</p>
            )}

            <div className="flex items-center justify-between">
                {issue.assignee && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <User className="h-3 w-3" />
                        <span>{issue.assignee.name}</span>
                    </div>
                )}
                {issue.labels?.length > 0 && (
                    <div className="flex gap-1">
                        {issue.labels.slice(0, 2).map((label: string) => (
                            <Badge key={label} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {label}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}