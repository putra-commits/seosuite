# SEOsuite

> Automated SEO Intelligence Platform — [seosuite.info](https://seosuite.info)

Built on the BERNAS Intelligence Engine. Enterprise-grade SEO auditing, Core Web Vitals monitoring, keyword tracking, and the **Pilar1st** topic cluster builder.

## 📌 Dokumentasi & Standar Audit

- 📊 **[Laporan Audit Kesiapan Repositori](file:///D:/Fullstack/seosuite/docs/AUDIT_REPORT.md)**: Evaluasi kesiapan teknis repositori terhadap mesin lead & audit.
- 📋 **[Checklist Parameter Audit SEOsuite](file:///D:/Fullstack/seosuite/docs/AUDIT_CHECKS.md)**: 5-Layer Checklist (Technical, On-page, Performance, Local ID, AI Visibility).

## Modules

| Module | Description | Status |
|---|---|---|
| **SEO Audit & Lead Engine** | 5-layer audit (Technical, On-page, Speed, Local ID/WA, AI Readiness) + Generator Lead WhatsApp | 🚀 In Progress |
| **Pilar1st** | GEO × Keyword matrix — 100 keywords × 10 kota = 1000 artikel | ✅ Live |
| **CWV Monitor** | PageSpeed Insights API integration — LCP, INP, CLS, FCP, TTFB | 🔑 Requires PSI_API_KEY |
| **GSC Tracker** | Keyword rank tracking via Google Search Console API | 🔜 Roadmap |
| **PDF Reports** | Weekly automated SEO health PDF export | 🔜 Roadmap |

## Quick Start

```bash
# Clone
git clone https://github.com/putra-commits/seosuite.git
cd seosuite

# Install
npm install

# Configure
cp .env.local.example .env.local
# Add your PSI_API_KEY for full CWV data

# Dev
npm run dev

# Build
npm run build
```

## API Reference

### `GET /api/audit?url=https://yourdomain.com`
Runs a 53-point technical SEO audit. Returns score (0–100) + 7 section breakdown.

### `POST /api/pilar`
```json
{ "keywords": ["Next.js", "SEO Audit"], "cities": ["Jakarta", "Bandung"] }
```
Returns GEO × Keyword cluster matrix with intent classification and word targets.

### `GET /api/health`
Returns service health status.

## Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + Custom Design System
- **Icons**: Lucide React
- **Engine**: BERNAS SEO Health Check (ported from `seo-health-check.ts`)
- **Domain**: seosuite.info

## Workflows (Cod1st × UX1st × Debug1st)

Developed following the BERNAS agent methodology:
- **Cod1st**: Type-safe API routes, AbortSignal timeouts, proper error guards
- **UX1st**: Premium dark SaaS UI, score ring, real-time progress, scan-line effect
- **Debug1st**: No SSR leaks, no window/document in server routes, health endpoint

---

© 2026 SEOsuite — A BERNAS Sovereign Intelligence Group product
