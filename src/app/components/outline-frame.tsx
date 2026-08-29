import type { ReactNode } from 'react';

/**
 * Motif "rectangle outline gradient melayang".
 * Wrapper luar SENGAJA tidak overflow-hidden — glow-nya memang harus meluber.
 */
export default function OutlineFrame({
  children,
  className = '',
  innerClassName = '',
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-brand-600/25 via-brand-500/15 to-accent/20 blur-2xl"
      />
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-2xl shadow-brand-900/50 ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
