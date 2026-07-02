import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  children: ReactNode;
}

export default function Column({ id, title, count, color, children }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={`w-80 bg-zinc-900 border-zinc-800 flex-shrink-0 transition-colors ${isOver ? 'ring-2 ring-blue-500/20 border-blue-500/40 bg-zinc-900/85' : ''
        }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{title}</span>
          <span className="text-sm font-normal text-zinc-500">{count}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 min-h-[500px] h-[calc(100%-80px)] overflow-y-auto pb-4">
        {children}
      </CardContent>
    </Card>
  );
}