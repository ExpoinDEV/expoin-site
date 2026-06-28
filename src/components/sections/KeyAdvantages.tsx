import React from 'react';
import { useSpotlight } from '../../hooks/useSpotlight';

export default function KeyAdvantages() {
  const handleMouseMove = useSpotlight();

  return (
    <section id="key-advantages" className="overflow-hidden flex flex-col px-6 md:px-8 lg:px-12 z-10 bg-[#030303]/80 w-full border-white/5 border-t pt-32 pb-32 relative backdrop-blur-xl items-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_200px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl w-full relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6 mb-20 max-w-4xl mx-auto" data-aos="fade-up">
          <span className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] font-medium flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"></span>
            Expoin Ecosystem
            <span className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"></span>
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-semibold tracking-tight text-white leading-[1.1]">
            Key advantages of <br className="hidden sm:block" />
            <span className="text-[#38BDF8]">Expoin DEX and Wallet</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Privacy First */}
          <div className="spotlight-card group relative p-8 lg:p-10 rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-4">Privacy First</h4>
                <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#38BDF8]/20 transition-all duration-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-base mt-auto">
                No invasive KYC. No data tracking. Your trades stay between you and the ledger—exactly how crypto was meant to be.
              </p>
            </div>
          </div>

          {/* Card 2: Secure */}
          <div className="spotlight-card group relative p-8 lg:p-10 rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-4">Battle-Tested Tech</h4>
                <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#38BDF8]/20 transition-all duration-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-base mt-auto">
                Sleep easy. We use advanced atomic swap protocols to ensure your transactions are as bulletproof as the chains they run on.
              </p>
            </div>
          </div>

          {/* Card 3: Ramp on / ramp off */}
          <div className="spotlight-card group relative p-8 lg:p-10 rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-4">Frictionless Ramps</h4>
                <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#38BDF8]/20 transition-all duration-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10" />
                    <path d="m13 3 4 4-4 4" />
                    <path d="M17 17H7" />
                    <path d="m11 21-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-base mt-auto">
                The bridge between the "old world" and DeFi. Move your capital in and out without the typical bank drama or hidden fees.
              </p>
            </div>
          </div>

          {/* Card 4: Decentralised */}
          <div className="spotlight-card group relative p-8 lg:p-10 rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-4">99% Market Coverage</h4>
                <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#38BDF8]/20 transition-all duration-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M12 8v4"/></svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-base mt-auto">
                From BTC and ETH to the deepest altcoin pools. If it’s on a chain, you can trade it here. No gatekeepers, no limits.
              </p>
            </div>
          </div>

          {/* Card 5: Cross-chain bridges */}
          <div className="spotlight-card group relative p-8 lg:p-10 rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-4">The Ultimate Bridge</h4>
                <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#38BDF8]/20 transition-all duration-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-base mt-auto">
                50+ bridges under the hood, but you’ll never see them. Swap assets across networks instantly, as if borders didn't exist.
              </p>
            </div>
          </div>

          {/* Card 6: Noncustodial */}
          <div className="spotlight-card group relative p-8 lg:p-10 rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-4">True Ownership</h4>
                <div className="w-12 h-12 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#38BDF8]/20 transition-all duration-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-base mt-auto">
                Not your keys, not your coins. Your data and phrases never leave your device. Even we can’t touch your funds—and that’s a promise.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
