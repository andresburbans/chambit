import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth.tsx';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ConditionalFooter } from '@/components/layout/conditional-footer';

export const metadata: Metadata = {
  title: 'Chambit',
  description: 'Connect with local experts for any service you need.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen bg-background")}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-[var(--header-height)] pb-16 md:pb-0">
              {children}
            </main>
            <MobileNav />
            <ConditionalFooter />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
