import React from 'react';

export function PageSection({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section {...props} className={`relative z-10 w-full border-t border-white/5 px-6 py-24 lg:px-12 ${className}`}>
      {children}
    </section>
  );
}

export function SectionShell({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`mx-auto w-full max-w-7xl ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({children}: {children: React.ReactNode}) {
  return (
    <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38BDF8]"></span>
      </span>
      <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#38BDF8]">{children}</span>
    </div>
  );
}

export function SpotlightCard({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_40%)]"></div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_28%)]"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
