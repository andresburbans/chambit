
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ConditionalFooter } from '@/components/layout/conditional-footer';

export const metadata: Metadata = {
  title: {
    default: 'Chambit | Contrata Expertos Locales',
    template: '%s | Chambit',
  },
  description: 'Conecta con profesionales confiables en tu ciudad para cualquier servicio que necesites. Limpieza, reparaciones, tutorías y más.',
  applicationName: 'Chambit',
  authors: [{ name: 'Chambit Team' }],
  generator: 'Next.js',
  keywords: ['servicios', 'freelancers', 'expertos', 'mantenimiento', 'local'],
  creator: 'Chambit Team',
  publisher: 'Chambit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Chambit | Contrata Expertos Locales',
    description: 'Encuentra al profesional ideal para tu hogar o empresa, validado y cerca de ti.',
    url: 'https://chambit.com',
    siteName: 'Chambit',
    images: [
      {
        url: '/logo-chambit-text.png',
        width: 1200,
        height: 630,
        alt: 'Chambit Logo',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chambit | Encuentra al experto ideal',
    description: 'Resuelve tus necesidades diarias conectando con trabajadores independientes validados.',
    images: ['/logo-chambit-text.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#34af00',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents iOS zooming on inputs
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
        {process.env.NODE_ENV === "development" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  try {
                    if (sessionStorage.getItem('dev-cache-reset-done')) return;
                    sessionStorage.setItem('dev-cache-reset-done', '1');

                    var doReload = false;
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.getRegistrations().then(function (regs) {
                        if (regs.length) doReload = true;
                        return Promise.all(regs.map(function (reg) { return reg.unregister(); }));
                      }).catch(function () {});
                    }
                    if ('caches' in window) {
                      caches.keys().then(function (keys) {
                        if (keys.length) doReload = true;
                        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
                      }).catch(function () {});
                    }
                    setTimeout(function () {
                      if (doReload) window.location.reload();
                    }, 250);
                  } catch (e) {}
                })();
              `,
            }}
          />
        )}
      </head>
      <body className={cn("font-body antialiased min-h-screen bg-background")}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 md:pt-[var(--header-height)] pb-0 md:pb-0">
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
