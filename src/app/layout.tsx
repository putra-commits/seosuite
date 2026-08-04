import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/sidebar';
import WhatsAppFloat from './components/whatsapp-float';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

// Variable sengaja TIDAK bernama --font-display/--font-mono: blok @theme di
// globals.css sudah memakai nama itu di :root (elemen <html> yang sama), jadi
// akan saling menimpa. next/font memasok --font-jakarta/--font-jetbrains,
// @theme yang merujuk ke keduanya.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://seo.adolo.id'),
  title: { default: 'AdoloSEO — Arsitektur Pendapatan & Intelijen SEO', template: '%s | AdoloSEO' },
  description: 'Transformasi website Anda menjadi aset kedaulatan digital. Audit AEO, GEO, dan optimasi konversi enterprise untuk dominasi pasar Indonesia.',
  keywords: ['audit AEO', 'optimasi GEO', 'AdoloSEO', 'arsitektur konversi', 'profit SEO', 'intelijen pasar'],
  openGraph: {
    title: 'AdoloSEO — Arsitektur Pendapatan & Intelijen SEO',
    description: 'Transformasi website Anda menjadi aset kedaulatan digital. Audit AEO, GEO, dan optimasi konversi.',
    url: 'https://seo.adolo.id',
    siteName: 'AdoloSEO',
    images: [{ url: '/brand/adoloseo-512.png', width: 512, height: 512 }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdoloSEO — Arsitektur Pendapatan & Intelijen SEO',
    description: 'Transformasi website Anda menjadi aset kedaulatan digital.',
    images: ['/brand/adoloseo-512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-ink text-slate-100 antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
            <WhatsAppFloat />
          </main>
        </div>
      </body>
    </html>
  );
}
