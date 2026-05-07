import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://seosuite.info'),
  title: { default: 'SEOsuite — Automated SEO Intelligence Platform', template: '%s | SEOsuite' },
  description: 'Enterprise-grade SEO auditing, Core Web Vitals monitoring, keyword tracking, and schema validation — all in one intelligent dashboard.',
  keywords: ['SEO audit', 'Core Web Vitals', 'PageSpeed', 'technical SEO', 'sitemap health', 'schema validator', 'GSC API'],
  openGraph: {
    title: 'SEOsuite — Automated SEO Intelligence Platform',
    description: 'Enterprise-grade SEO auditing, CWV monitoring, and keyword intelligence.',
    url: 'https://seosuite.info',
    siteName: 'SEOsuite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'SEOsuite', description: 'Automated SEO Intelligence Platform' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="scan-line" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
