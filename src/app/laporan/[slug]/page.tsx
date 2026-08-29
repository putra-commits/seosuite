import { getAuditBySlug, seedDummyAudit } from '@/lib/audit-store';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReportView from './ReportView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let record = await getAuditBySlug(slug);
  if (!record && slug === 'klinik-gigi-sehat-id') {
    record = await seedDummyAudit();
  }

  if (!record) {
    return {
      title: 'Laporan Audit Tidak Ditemukan | SEOsuite',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Audit SEO ${record.domain} — Skor ${record.score}/100 | SEOsuite`,
    description: `Hasil analisis kesehatan SEO & konversi untuk ${record.domain}. Skor: ${record.score}/100. ${record.summaryText.slice(0, 140)}...`,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Audit SEO ${record.domain} — Skor ${record.score}/100`,
      description: `Cek 5-Layer SEO & Conversion Audit untuk ${record.domain} di SEOsuite.`,
      url: `https://seosuite.info/laporan/${record.slug}`,
      siteName: 'SEOsuite',
    },
  };
}

export default async function LaporanPage({ params }: Props) {
  const { slug } = await params;
  let record = await getAuditBySlug(slug);

  // Jika demo slug diakses dan belum ada file, seed dummy
  if (!record && slug === 'klinik-gigi-sehat-id') {
    record = await seedDummyAudit();
  }

  if (!record) {
    notFound();
  }

  // Sanitasi privasi nomor WhatsApp agar tidak bocor di HTML publik
  const sanitizedRecord = {
    ...record,
    whatsapp: '', // Sembunyikan nomor WhatsApp di tampilan publik
  };

  return <ReportView report={sanitizedRecord} />;
}
