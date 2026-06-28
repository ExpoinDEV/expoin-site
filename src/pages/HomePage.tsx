import React, {Suspense} from 'react';
import Hero from '../components/sections/Hero';
import {Skeleton} from '../components/ui/skeleton';
import {usePageMetadata} from '../hooks/usePageMetadata';
import {createPageStructuredData} from '../lib/seo';

const DashboardPreview = React.lazy(() => import('../components/DashboardPreview'));
const SystemCapabilities = React.lazy(() => import('../components/sections/SystemCapabilities'));
const SwapSimulator = React.lazy(() => import('../components/SwapSimulator'));
const KeyAdvantages = React.lazy(() => import('../components/sections/KeyAdvantages'));
const Consultation = React.lazy(() => import('../components/sections/Consultation'));

const title = 'Expoin DEX and Wallet';
const description = 'Trade across chains from one wallet with atomic swaps, deep liquidity, and zero intermediaries.';
const structuredData = createPageStructuredData({
  path: '/',
  title,
  description,
  breadcrumbs: [{name: 'Home', path: '/'}],
});

export default function HomePage() {
  usePageMetadata({
    title,
    description,
    path: '/',
    jsonLd: structuredData,
  });

  return (
    <>
      <Hero />

      <Suspense fallback={<div className="w-full h-[600px] flex items-center justify-center"><Skeleton className="w-full max-w-5xl h-[600px] rounded-[24px]" /></div>}>
        <section className="relative z-20 w-full px-6 lg:px-12 pb-32 flex justify-center mt-12 lg:mt-0" data-aos="fade-up">
          <DashboardPreview />
        </section>
      </Suspense>

      <Suspense fallback={<div className="w-full h-[800px] flex items-center justify-center"><Skeleton className="w-full max-w-5xl h-[600px] rounded-[32px]" /></div>}>
        <SystemCapabilities />
      </Suspense>

      <section className="lg:px-12 flex flex-col overflow-hidden z-10 bg-[#030303]/50 w-full border-white/5 border-t px-6 py-32 relative backdrop-blur-xl items-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_200px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-70 pointer-events-none"></div>

        <div className="max-w-7xl w-full relative z-10">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-12 mb-20">
            <div className="flex flex-col gap-6 max-w-3xl">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-white/50">03</span>
                <span className="text-xs font-mono text-[#38BDF8]/90 uppercase tracking-[0.2em]">Exchange Infrastructure</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-semibold tracking-tight text-[#38BDF8] leading-[1.1]">
                Real-time swap simulation.
                <span className="text-white/40"> See the savings.</span>
              </h2>
            </div>
            <div className="max-w-sm pb-2">
              <p className="text-white/50 text-sm leading-relaxed font-light">
                Compare direct market access against traditional bridges and CEXs. See why our deep liquidity execution translates into immediate capital retention.
              </p>
            </div>
          </div>

          <div className="w-full relative group">
            <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-[24px]" />}>
              <SwapSimulator />
            </Suspense>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="w-full h-[600px] flex items-center justify-center"><Skeleton className="w-full max-w-7xl h-[400px] rounded-[32px]" /></div>}>
        <KeyAdvantages />
      </Suspense>

      <Suspense fallback={<div className="w-full h-[400px] flex items-center justify-center"><Skeleton className="w-full max-w-7xl h-[300px] rounded-[32px]" /></div>}>
        <Consultation />
      </Suspense>
    </>
  );
}
