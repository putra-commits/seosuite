/**
 * verify-engine.ts — Smoke Test untuk Engine Audit, Security, dan Lead Store
 */

import { validateAndSanitizeUrl } from '../src/lib/security';
import { calculateOverallAudit, generateWhatsAppMessage, AuditFinding } from '../src/lib/scoring';
import { saveAuditReport, getAuditBySlug, getAllLeads, seedDummyAudit } from '../src/lib/audit-store';

async function main() {
  console.log('--- 1. Testing SSRF Guard ---');
  const privateUrls = [
    'http://localhost:3000',
    'http://127.0.0.1/admin',
    'http://192.168.1.1',
    'http://10.0.0.5',
    'ftp://example.com',
  ];

  for (const u of privateUrls) {
    const res = validateAndSanitizeUrl(u);
    console.log(`URL: ${u} => Valid: ${res.valid} | Error: ${res.error}`);
    if (res.valid) {
      throw new Error(`SSRF Guard failed for ${u}! It should be invalid.`);
    }
  }

  const validRes = validateAndSanitizeUrl('bernas.id');
  console.log(`Valid URL: bernas.id => Sanitized: ${validRes.sanitizedUrl}`);
  if (!validRes.valid || validRes.sanitizedUrl !== 'https://bernas.id') {
    throw new Error('Valid URL check failed!');
  }

  console.log('\n--- 2. Testing Scoring & Issue Prioritization ---');
  const sampleFindings: AuditFinding[] = [
    {
      id: 'LOC-01',
      category: 'local',
      severity: 'critical',
      pass: false,
      title_id: 'Tidak Ada Link WhatsApp',
      why_it_matters_id: 'Konsumen Indonesia butuh WhatsApp.',
      evidence: 'None',
      how_to_fix_id: 'Pasang tombol wa.me',
      effort: 'S',
      impact: 'H',
      owner: 'bisnis',
    },
    {
      id: 'PERF-04',
      category: 'performance',
      severity: 'critical',
      pass: false,
      title_id: 'TTFB Lambat 1.5s',
      why_it_matters_id: 'Pengunjung mobile kabur.',
      evidence: '1500ms',
      how_to_fix_id: 'Gunakan CDN',
      effort: 'M',
      impact: 'H',
      owner: 'dev',
    },
    {
      id: 'PAGE-03',
      category: 'onpage',
      severity: 'critical',
      pass: false,
      title_id: 'H1 Tag Hilang',
      why_it_matters_id: 'Google bingung topik utama.',
      evidence: '0 H1',
      how_to_fix_id: 'Pasang 1 tag H1',
      effort: 'S',
      impact: 'H',
      owner: 'dev',
    },
  ];

  const calculated = calculateOverallAudit([
    { id: 'technical', title: 'Technical', findings: [] },
    { id: 'onpage', title: 'Onpage', findings: [sampleFindings[2]] },
    { id: 'performance', title: 'Performance', findings: [sampleFindings[1]] },
    { id: 'local', title: 'Local', findings: [sampleFindings[0]] },
    { id: 'ai', title: 'AI', findings: [] },
  ]);

  console.log(`Calculated Score: ${calculated.overallScore} | Grade: ${calculated.grade}`);
  console.log(`Top 3 Issues count: ${calculated.top3Issues.length}`);
  if (calculated.top3Issues.length !== 3) {
    throw new Error('Expected 3 top issues!');
  }

  console.log('\n--- 3. Testing WhatsApp Copy Generator ---');
  const waMsg = generateWhatsAppMessage({
    businessName: 'Klinik Sehat',
    domain: 'kliniksehat.id',
    score: calculated.overallScore,
    reportSlug: 'klinik-sehat-id',
    top3Issues: calculated.top3Issues,
  });
  console.log('Sample WhatsApp Message:');
  console.log(waMsg);

  console.log('\n--- 4. Testing Audit Store & Lead Persistence ---');
  const dummy = await seedDummyAudit();
  console.log(`Seeded Dummy Record: ${dummy.slug} | Business: ${dummy.businessName}`);

  const fetched = await getAuditBySlug(dummy.slug);
  console.log(`Fetched Record by Slug: ${fetched?.slug} | Score: ${fetched?.score}`);
  if (!fetched || fetched.slug !== dummy.slug) {
    throw new Error('Audit store fetch by slug failed!');
  }

  const leads = await getAllLeads();
  console.log(`Total Leads in Store: ${leads.length}`);
  if (leads.length === 0) {
    throw new Error('Leads list is empty!');
  }

  console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
