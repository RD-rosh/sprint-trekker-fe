"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const current = mounted ? resolvedTheme || theme : 'light';

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
        >
            {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    );
}
