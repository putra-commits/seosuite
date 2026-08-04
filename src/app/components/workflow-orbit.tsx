import { Binary, Search, Layers, Unlink, TrendingUp } from 'lucide-react';

/**
 * Rantai node beranimasi untuk kolom kanan hero saat state idle.
 * Label diambil dari nama fitur yang sudah ada di produk — bukan klaim baru.
 * Stagger lewat inline animationDelay; keyframes dijaga prefers-reduced-motion
 * di globals.css.
 */
const NODES = [
  { label: 'Audit', Icon: Binary },
  { label: 'Kata Kunci', Icon: Search },
  { label: 'Konten', Icon: Layers },
  { label: 'Link', Icon: Unlink },
  { label: 'Peringkat', Icon: TrendingUp },
];

export default function WorkflowOrbit() {
  return (
    <div className="flex flex-col items-stretch gap-1">
      {NODES.map(({ label, Icon }, i) => (
        <div key={label}>
          <div
            className="workflow-node flex items-center gap-4 rounded-xl border border-white/10 bg-ink-800 px-4 py-3"
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/15 text-accent">
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-white">
              {label}
            </span>
            <span className="ml-auto font-mono text-xs tracking-[0.25em] text-slate-500">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          {i < NODES.length - 1 && (
            <div className="flex justify-center py-1">
              <span
                aria-hidden="true"
                className="workflow-arrow text-accent"
                style={{ animationDelay: `${i * 0.18 + 0.09}s` }}
              >
                &darr;
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
