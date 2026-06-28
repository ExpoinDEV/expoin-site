import React, { useState } from 'react';
import { atomicSteps } from '../../lib/constants';
import { useSpotlight } from '../../hooks/useSpotlight';

export default function SystemCapabilities() {
  const [activeSwapStep, setActiveSwapStep] = useState(0);
  const handleMouseMove = useSpotlight();

  return (
    <section id="how-it-works" className="flex flex-col overflow-hidden lg:px-12 z-10 bg-black/50 w-full border-white/5 border-t pt-32 pr-6 pb-32 pl-6 relative backdrop-blur-3xl items-center">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="flex flex-col items-center text-center max-w-3xl mb-24 relative z-10" data-aos="fade-up">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-48 w-6 overflow-hidden flex justify-center">
          <svg className="h-full w-full" viewBox="0 0 6 192" fill="none">
            <path d="M3 0V192" stroke="url(#header-beam)" strokeWidth="1.5" strokeLinecap="round" className="animate-beam opacity-70"></path>
            <defs>
              <linearGradient id="header-beam" x1="3" y1="0" x2="3" y2="192" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" stopOpacity="0"></stop>
                <stop offset="0.5" stopColor="#38BDF8"></stop>
                <stop offset="1" stopColor="#38BDF8" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]"></span>
          </span>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-[0.2em] font-medium">System Capabilities</span>
        </div>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-white mb-8">
          Your Wallet, Your Rules.
        </h2>

        <p className="text-xl text-white/60 leading-relaxed max-w-2xl font-light tracking-tight">
          Most "decentralized" tools still want to hold your hand (and your funds). Not us. We facilitate direct peer-to-peer trades through atomic swaps so you never have to trust an intermediary. You stay in control; we just provide the tech to make it happen.
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:gap-14 z-10 w-full max-w-5xl mx-auto relative">
        {/* Card 1: Atomic Swaps How-To */}
        <div className="spotlight-card group relative flex flex-col p-10 lg:p-14 rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500" data-aos="fade-up" data-aos-delay="100" onMouseMove={handleMouseMove}>
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)' }}></div>
          <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>

          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <h3 className="text-3xl font-semibold tracking-tight text-white mb-4 relative z-10">How Expoin DEX Works</h3>
          <p className="text-lg text-white/50 leading-relaxed mb-8 relative z-10 font-light max-w-2xl">
            Atomic swaps enable trustless, peer-to-peer trading without intermediaries.
          </p>

          <div className="relative z-10 mt-4 w-full h-72 rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col shadow-2xl transition-all duration-300">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
              </div>
              <span className="text-xs text-white/30 font-mono uppercase tracking-wider">Atomic_Swap_Engine</span>
            </div>
            <div className="flex-1 grid grid-cols-2 divide-x divide-white/5 relative">
              <div className="p-4 sm:p-5 flex flex-col justify-center relative overflow-hidden group/step">
                 <div className="absolute -right-4 -top-4 text-8xl font-bold text-white/[0.02] group-hover/step:text-[#38BDF8]/5 transition-colors">{activeSwapStep * 2 + 1}</div>
                 <div className="text-[#38BDF8] font-mono text-2xl mb-2 font-bold relative z-10">Step {activeSwapStep * 2 + 1}</div>
                 <h4 className="text-white text-[13px] font-medium mb-1.5 relative z-10 leading-snug">{atomicSteps[activeSwapStep].a.title}</h4>
                 <p className="text-white/50 text-[10px] sm:text-[11px] leading-relaxed relative z-10">{atomicSteps[activeSwapStep].a.desc}</p>
              </div>
              <div className="p-4 sm:p-5 flex flex-col justify-center relative overflow-hidden group/step">
                 <div className="absolute -right-4 -top-4 text-8xl font-bold text-white/[0.02] group-hover/step:text-[#38BDF8]/5 transition-colors">{activeSwapStep * 2 + 2}</div>
                 <div className="text-[#38BDF8] font-mono text-2xl mb-2 font-bold relative z-10">Step {activeSwapStep * 2 + 2}</div>
                 <h4 className="text-white text-[13px] font-medium mb-1.5 relative z-10 leading-snug">{atomicSteps[activeSwapStep].b.title}</h4>
                 <p className="text-white/50 text-[10px] sm:text-[11px] leading-relaxed relative z-10">{atomicSteps[activeSwapStep].b.desc}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-center gap-3 mt-6">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSwapStep(idx)}
                className={`flex items-center justify-center px-4 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 focus:outline-none ${
                  activeSwapStep === idx
                    ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8]'
                    : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                {idx === 0 ? '1-2' : idx === 1 ? '3-4' : '5-6'}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-20 w-full">
          {/* Card 2.1 */}
          <div className="spotlight-card group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" data-aos="fade-up" data-aos-delay="150" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(56, 189, 248, 0.1), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            
            <div className="relative z-10 flex flex-col h-full gap-10">
              <div className="flex justify-between items-start">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-2">Trade Anything.<br/>Everywhere.</h4>
                <div className="w-11 h-11 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#38BDF8] group-hover:border-[#38BDF8]/30 group-hover:bg-[#38BDF8]/10 transition-all duration-500 shrink-0 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-sm mt-auto">
                From blue chips like BTC and ETH to the deepest altcoins. We support 99% of the crypto market - and if you don’t see your favorite pair, just add it yourself. No gatekeepers, no limits.
              </p>
            </div>
          </div>

          {/* Card 2.2 */}
          <div className="spotlight-card group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" data-aos="fade-up" data-aos-delay="200" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(56, 189, 248, 0.1), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            
            <div className="relative z-10 flex flex-col h-full gap-10">
              <div className="flex justify-between items-start">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-2">Borders?<br/>What Borders?</h4>
                <div className="w-11 h-11 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#38BDF8] group-hover:border-[#38BDF8]/30 group-hover:bg-[#38BDF8]/10 transition-all duration-500 shrink-0 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-sm mt-auto">
                Moving assets between chains usually involves a lot of waiting and swearing at bridges. Not here. Swap instantly, as if the entire multichain ecosystem was just one single room.
              </p>
            </div>
          </div>

          {/* Card 2.3 */}
          <div className="spotlight-card group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]" data-aos="fade-up" data-aos-delay="250" onMouseMove={handleMouseMove}>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(56, 189, 248, 0.1), transparent 40%)' }}></div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>
            
            <div className="relative z-10 flex flex-col h-full gap-10">
              <div className="flex justify-between items-start">
                <h4 className="text-[#38BDF8] font-medium text-xl tracking-tight pr-2">Your Keys.<br/>Your Castle.</h4>
                <div className="w-11 h-11 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#38BDF8] group-hover:border-[#38BDF8]/30 group-hover:bg-[#38BDF8]/10 transition-all duration-500 shrink-0 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-sm mt-auto">
                We don’t want your data, and we certainly don’t want your keys. Everything stays encrypted locally on your device. If we disappeared tomorrow, your funds wouldn’t move a muscle. You’re in total control.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Made with security */}
        <div className="spotlight-card group relative flex flex-col px-0 py-8 sm:p-10 lg:p-14 rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500" data-aos="fade-up" data-aos-delay="300" onMouseMove={handleMouseMove}>
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.06), transparent 40%)' }}></div>
          <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#38BDF8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)' }}></div>

          <h3 className="text-3xl font-semibold tracking-tight text-white mb-4 relative z-10 px-5 sm:px-0">Made with security</h3>
          <p className="text-lg text-white/50 leading-relaxed mb-8 relative z-10 font-light max-w-2xl px-5 sm:px-0">
            Execute cross-chain trades safely with our robust swap interface, designed for absolute transparency and control.
          </p>

          <div className="relative mt-8 w-[calc(100%+24px)] max-w-none -mx-3 sm:mx-auto sm:w-full sm:max-w-[440px] rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 flex flex-col gap-3 shadow-2xl z-10">
            {/* Tabs */}
            <div className="flex gap-2 mb-1">
              <button className="px-4 py-1.5 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8] text-[10px] font-medium transition-colors">Taker order</button>
              <button className="px-4 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-[10px] font-medium transition-colors">Maker order</button>
            </div>

            {/* Sell Block */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-white/50 tracking-[0.2em] uppercase">Sell</span>
                <div className="flex items-center gap-1.5 text-[9px] text-white/40">
                  <span>Available for swaps <span className="text-white ml-0.5">0.00</span></span>
                  <button className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors ml-1">Max</button>
                  <button className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors">Half</button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#627EEA]/20 flex items-center justify-center text-[#627EEA]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-medium leading-none flex items-center gap-1">ETH <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><path d="m6 9 6 6 6-6"/></svg></span>
                    <span className="text-[9px] text-white/40 mt-1 uppercase font-mono">ERC-20</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-white font-mono text-sm leading-none">0.00</span>
                  <span className="text-[10px] text-white/40 mt-1 font-mono">≈$0.00</span>
                </div>
              </div>
            </div>

            {/* Swap Divider */}
            <div className="relative h-2 w-full flex items-center justify-center z-10">
              <div className="absolute w-8 h-8 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#38BDF8] cursor-pointer transition-colors shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
              </div>
            </div>

            {/* Buy Block */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-white/50 tracking-[0.2em] uppercase">Buy</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#F7931A]/20 flex items-center justify-center text-[#F7931A]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" display="none"/><path fill="currentColor" d="M299.8 181.5c-4.4-32.1-24.7-46.6-67.4-53.5l14-56.1-34.1-8.5-13.8 55.4c-9-2.2-18.2-4.3-27.4-6.2l13.9-55.6-34.1-8.5-14 56.3c-7.4-1.7-14.6-3.4-21.4-5.1l.1-5.1-47.2-11.8-9.1 36.5s25.4 5.9 24.9 6.2c13.9 3.5 16.4 12.7 16 20l-16 64.3c1.2.3 2.7.8 4.3 1.6-1.4-.3-2.9-.7-4.4-1.1l-22.6 90.6c-2.4 6-8.9 15.1-23.2 11.5 0 .3-24.9-6.2-24.9-6.2l-17 39.5 44.8 11.2c8.3 2.1 16.5 4.3 24.8 6.4l-14 56.4 34.1 8.5 13.8-55.5c9.2 2.4 18.2 4.7 27.1 6.8l-13.8 55.5 34.1 8.5 14.1-56.6c47.9 10.3 84.1 6.2 99.1-37.4 12.1-35.1-2.2-55.3-26.6-68.6 19.1-4.4 33.4-17.1 37.1-43.3zm-71.1 91c-9.7 39-75.1 18-96.2 12.7l17-68.2c21.2 5.3 89.2 15.6 79.2 55.5zm11.3-98c-8.8 35.5-60.5 17.2-77.4 13l15.3-61.4c16.9 4.3 71.3 11.6 62.1 48.4z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-medium leading-none flex items-center gap-1">BTC <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><path d="m6 9 6 6 6-6"/></svg></span>
                    <span className="text-[9px] text-white/40 mt-1 uppercase font-mono">NATIVE</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-white font-mono text-sm leading-none">0.00</span>
                  <span className="text-[10px] text-white/40 mt-1 font-mono">≈$0.00</span>
                </div>
              </div>
            </div>

            {/* Rate & Info */}
            <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 flex flex-col gap-2 text-[10px]">
              <div className="flex justify-between items-start">
                <span className="text-white/40">Rate:</span>
                <div className="flex flex-col items-end text-right gap-0.5">
                  <span className="text-[#38BDF8] font-mono">1 ETH = 0.03011376 BTC (≈$2075.17)</span>
                  <span className="text-white/40 font-mono text-[9px]">1 BTC = 33.20740564 ETH (≈$70997.43)</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-white/40 flex items-center gap-1.5">Compared to CEX <div className="border border-white/20 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] cursor-help">?</div></span>
                <span className="text-rose-400 font-mono">-2.94%</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-white/40">Total fees</span>
                <span className="text-[#38BDF8] font-mono">$0.00</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-[1fr_2.5fr] gap-2.5 mt-1.5">
              <button className="py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors">Clear</button>
              <a href="https://wallet.expoin.net" className="py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-black text-xs font-semibold transition-colors shadow-[0_0_20px_rgba(56,189,248,0.2)] flex items-center justify-center">Swap Now</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 relative z-10" data-aos="fade-up" data-aos-delay="400">
        <button className="group relative px-9 py-4 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 hover:bg-[#e5e5e5] flex items-center gap-3 overflow-hidden tracking-tight">
          <span className="relative z-10">Explore Capabilities</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right relative z-10 transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0"></div>
        </button>
      </div>
    </section>
  );
}
