import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  children: ReactNode;
}

export default function Column({ id, title, count, color, children }: ColumnProps) {
  return (
    <Card className="w-80 bg-zinc-900 border-zinc-800 flex-shrink-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{title}</span>
          <span className="text-sm font-normal text-zinc-500">{count}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 min-h-[500px]">
        {children}
      </CardContent>
    </Card>
  );
}