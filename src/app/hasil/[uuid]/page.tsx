import { getAudit } from '@/lib/audit-store';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ShareCard from './ShareCard';

interface Props {
  params: Promise<{ uuid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params;
  const audit = await getAudit(uuid);
  if (!audit) return { title: 'Hasil tidak ditemukan' };
  const domain = new URL(audit.url).hostname;
  return {
    title: `${domain} — SEO Score ${audit.score}/100`,
    description: `Hasil audit SEO untuk ${domain}: ${audit.score}/100. Cek website kamu di SEOsuite.`,
    openGraph: {
      title: `SEO Score ${audit.score}/100 — ${domain}`,
      description: `Audit 53-point untuk ${domain}. Cek website kamu juga!`,
    },
  };
}

export default async function HasilPage({ params }: Props) {
  const { uuid } = await params;
  const audit = await getAudit(uuid);
  if (!audit) notFound();

  return <ShareCard audit={audit} />;
}
