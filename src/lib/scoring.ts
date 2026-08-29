/**
 * scoring.ts — Weighted Scoring Engine, Issue Prioritization, and WhatsApp Copy Generator
 */

export type Severity = 'critical' | 'warn' | 'pass' | 'info';
export type EffortLevel = 'S' | 'M' | 'L';
export type ImpactLevel = 'H' | 'M' | 'L';
export type IssueOwner = 'dev' | 'konten' | 'bisnis';

export interface AuditFinding {
  id: string;
  category: 'technical' | 'onpage' | 'performance' | 'local' | 'ai';
  severity: Severity;
  pass: boolean;
  title_id: string;
  why_it_matters_id: string;
  evidence: string;
  how_to_fix_id: string;
  effort: EffortLevel;
  impact: ImpactLevel;
  owner: IssueOwner;
}

export interface ModuleSection {
  id: 'technical' | 'onpage' | 'performance' | 'local' | 'ai';
  title: string;
  weight: number;
  score: number;
  findings: AuditFinding[];
}

export interface TopIssue {
  id: string;
  title_id: string;
  why_it_matters_id: string;
  how_to_fix_id: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  category: string;
  severity: Severity;
}

export interface CalculatedAudit {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  statusColor: 'emerald' | 'amber' | 'rose';
  summaryText: string;
  lossEstimateText: string;
  top3Issues: TopIssue[];
  modules: ModuleSection[];
}

// Bobot modul resmi
export const MODULE_WEIGHTS = {
  technical: 30,
  onpage: 20,
  performance: 20,
  local: 15,
  ai: 15,
};

export function calculateModuleScore(findings: AuditFinding[]): number {
  if (!findings || findings.length === 0) return 0;
  
  // Hitung poin kelulusan
  const totalScorable = findings.filter(f => f.severity !== 'info');
  if (totalScorable.length === 0) return 100;

  let earnedPoints = 0;
  let maxPoints = 0;

  for (const item of totalScorable) {
    const itemWeight = item.severity === 'critical' ? 3 : 1;
    maxPoints += itemWeight;
    if (item.pass) {
      earnedPoints += itemWeight;
    }
  }

  return Math.round((earnedPoints / maxPoints) * 100);
}

export function rankTopIssues(allFindings: AuditFinding[]): TopIssue[] {
  const failedIssues = allFindings.filter(f => !f.pass && (f.severity === 'critical' || f.severity === 'warn'));

  // Prioritization score: Impact H=3, M=2, L=1 | Severity Critical=4, Warn=2 | Effort S=3, M=2, L=1 (Quick wins prioritize higher)
  const ranked = [...failedIssues].sort((a, b) => {
    const impactScoreA = (a.impact === 'H' ? 30 : a.impact === 'M' ? 20 : 10) + (a.severity === 'critical' ? 40 : 15) + (a.effort === 'S' ? 15 : a.effort === 'M' ? 10 : 5);
    const impactScoreB = (b.impact === 'H' ? 30 : b.impact === 'M' ? 20 : 10) + (b.severity === 'critical' ? 40 : 15) + (b.effort === 'S' ? 15 : b.effort === 'M' ? 10 : 5);
    return impactScoreB - impactScoreA;
  });

  return ranked.slice(0, 3).map(f => ({
    id: f.id,
    title_id: f.title_id,
    why_it_matters_id: f.why_it_matters_id,
    how_to_fix_id: f.how_to_fix_id,
    impact: f.impact,
    effort: f.effort,
    category: f.category,
    severity: f.severity,
  }));
}

export function calculateOverallAudit(modules: Omit<ModuleSection, 'score' | 'weight'>[]): CalculatedAudit {
  const allFindings: AuditFinding[] = [];
  const fullModules: ModuleSection[] = [];
  let overallScore = 0;

  for (const m of modules) {
    const weight = MODULE_WEIGHTS[m.id] || 20;
    const score = calculateModuleScore(m.findings);
    fullModules.push({
      ...m,
      weight,
      score,
    });
    allFindings.push(...m.findings);
    overallScore += (score * weight) / 100;
  }

  overallScore = Math.min(100, Math.max(0, Math.round(overallScore)));

  const grade: CalculatedAudit['grade'] =
    overallScore >= 85 ? 'A' :
    overallScore >= 70 ? 'B' :
    overallScore >= 55 ? 'C' :
    overallScore >= 40 ? 'D' : 'F';

  const statusColor: CalculatedAudit['statusColor'] =
    overallScore >= 75 ? 'emerald' :
    overallScore >= 50 ? 'amber' : 'rose';

  const top3Issues = rankTopIssues(allFindings);

  // Buat ringkasan ramah pemilik bisnis (bukan bahasa dev kaku)
  let summaryText = '';
  if (overallScore >= 80) {
    summaryText = 'Fondasi website Anda sudah kokoh dan mudah ditemukan Google, namun masih ada peluang optimasi konversi WhatsApp dan kesiapan kutipan AI.';
  } else if (overallScore >= 55) {
    summaryText = 'Website Anda sudah aktif, namun mengalami kebocoran calon pelanggan akibat kecepatan mobile atau belum lengkapnya struktur kontak lokal & schema.';
  } else {
    summaryText = 'Website Anda mengalami hambatan teknis serius yang menghalangi Google mengindeks halaman dan menghilangkan potensi pelanggan harian.';
  }

  // Estimasi dampak kerugian (jujur & perkiraan)
  const lossEstimateText = overallScore < 60
    ? 'Perkiraan: Dengan skor kesehatan saat ini, website berpotensi kehilangan 30%–50% calon prospek mobile setiap bulannya dibanding kompetitor yang responsif.'
    : 'Perkiraan: Memperbaiki 3 isu prioritas dapat meningkatkan kemudahan perayapan Google dan mempercepat waktu kontak calon pembeli hingga 2x lipat.';

  return {
    overallScore,
    grade,
    statusColor,
    summaryText,
    lossEstimateText,
    top3Issues,
    modules: fullModules,
  };
}

/**
 * Generator Pesan WhatsApp Otomatis untuk Outreach Klien
 */
export function generateWhatsAppMessage(params: {
  businessName?: string;
  domain: string;
  score: number;
  reportSlug: string;
  top3Issues: TopIssue[];
}): string {
  const name = params.businessName ? `Halo Kak / Tim ${params.businessName}` : 'Halo Rekan Bisnis';
  const issueBullets = params.top3Issues
    .map((issue, idx) => `${idx + 1}. *${issue.title_id}* (${issue.why_it_matters_id})`)
    .join('\n');

  return `${name}, salam sukses! 🚀

Kami baru saja melakukan health check performa digital untuk domain *${params.domain}*.
Hasil skor kesehatan SEO & Konversi: *${params.score}/100*.

Berikut 3 luka prioritas yang terdeteksi dan berpotensi menghambat masuknya leads:
${issueBullets || '1. Optimasi struktur data dan kecepatan mobile'}

Laporan audit interaktif lengkap dapat Anda buka di:
👉 https://seosuite.info/laporan/${params.reportSlug}

Ketiga perbaikan teknis di atas bisa kami bantu selesaikan langsung ke kode situs Anda dalam 7–14 hari kerja. 
Apakah ada waktu sebentar jika kami bantu jelaskan langkah perbaikannya? Terima kasih! 🙏`;
}
