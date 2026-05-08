import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/sidebar';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://seosuite.info'),
  title: { default: 'SEOsuite — Arsitektur Pendapatan & Intelijen SEO', template: '%s | SEOsuite' },
  description: 'Transformasi website Anda menjadi aset kedaulatan digital. Audit AEO, GEO, dan optimasi konversi enterprise untuk dominasi pasar Indonesia.',
  keywords: ['audit AEO', 'optimasi GEO', 'SEO suite', 'arsitektur konversi', 'profit SEO', 'intelijen pasar'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#09090b] text-[#fafafa] antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
