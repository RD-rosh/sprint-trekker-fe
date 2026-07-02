'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    showBack?: boolean;
}

export default function Breadcrumbs({ items, showBack = true }: BreadcrumbsProps) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-3">
            {showBack && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                    onClick={() => router.back()}
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            )}

            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-sm">
                    {items.map((item, idx) => {
                        const isLast = idx === items.length - 1;
                        return (
                            <li key={idx} className="flex items-center gap-1.5">
                                {idx > 0 && (
                                    <ChevronRight className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
                                )}
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="text-zinc-400 hover:text-white transition-colors font-medium"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className={isLast ? 'text-white font-semibold' : 'text-zinc-400'}>
                                        {item.label}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}
