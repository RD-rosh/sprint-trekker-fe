import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { StoreProvider } from '@/store/providers';
import AppThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sprint Trekker',
  description: 'Modern product sprint planning with team collaboration',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <AppThemeProvider>
          <StoreProvider>
            <div className="min-h-screen bg-background text-foreground">
              <header className="w-full border-b border-border bg-card/60 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src="/icon.svg" alt="SprintTrekker" width={36} height={36} />
                    <span className="font-bold text-lg">SprintTrekker</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </div>
              </header>

              <main>{children}</main>
            </div>
          </StoreProvider>
        </AppThemeProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}