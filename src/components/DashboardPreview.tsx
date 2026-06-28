import React from 'react';
import { DASHBOARD_ASSETS } from '../lib/constants';
import { useSpotlight } from '../hooks/useSpotlight';
import { 
  IcoWalletMenu, IcoCardMenu, IcoSwapMenu, IcoBridgeMenu, 
  IcoGridMenu, IcoSettingsMenu, IcoMoonMenu, IcoSearchMenu, IcoChevronMenu 
} from './ui/icons';

const DashboardSparkline = ({ type }: { type: string }) => {
  let path = "";
  let grad = "";
  if (type === "mix1") {
     path = "M0 15 C 20 25, 30 25, 40 15 C 50 5, 70 5, 80 10 C 90 15, 100 25, 120 20";
     grad = "sparkline-grad-1";
  } else if (type === "mix2") {
     path = "M0 20 C 15 20, 25 10, 40 10 C 60 10, 70 25, 90 25 C 105 25, 110 15, 120 15";
     grad = "sparkline-grad-2";
  } else {
     return <div className="w-[120px] h-[30px]" />;
  }

  return (
    <svg width="120" height="30" viewBox="0 0 120 30" fill="none" className="shrink-0 hidden sm:block">
      <defs>
         <linearGradient id="sparkline-grad-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="80%" stopColor="#ef4444" />
         </linearGradient>
         <linearGradient id="sparkline-fill-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
         </linearGradient>
         <linearGradient id="sparkline-grad-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#ef4444" />
         </linearGradient>
         <linearGradient id="sparkline-fill-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
         </linearGradient>
      </defs>
      <path d={`${path} L 120 30 L 0 30 Z`} fill={`url(#${grad.replace('grad', 'fill')})`} />
      <path d={path} stroke={`url(#${grad})`} strokeWidth="1.5" />
    </svg>
  )
};

export default function DashboardPreview() {
  const handleMouseMove = useSpotlight();

  return (
    <div 
      className="w-full rounded-[24px] border border-white/10 bg-[#080808] overflow-hidden flex flex-col md:flex-row h-[600px] shadow-[0_0_80px_rgba(0,0,0,0.8)] relative group spotlight-card mx-auto max-w-5xl z-20"
      onMouseMove={handleMouseMove}
    >
       <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" style={{ background: 'radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.04), transparent 40%)' }}></div>
       
       {/* Sidebar */}
       <div className="w-64 border-r border-white/5 bg-[#050505] flex-col p-4 hidden md:flex z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
             <img src="/logo_wht.svg" alt="Expoin" className="h-8 w-auto object-contain" />
          </div>
          {/* Menu */}
          <div className="flex flex-col gap-2 flex-1">
             <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] cursor-pointer shadow-[inset_0_0_0_1px_rgba(56,189,248,0.2)]">
                <IcoWalletMenu /> <span className="text-sm font-medium">Wallet</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                <IcoCardMenu /> <span className="text-sm font-medium">Buy / Sell</span>
                <span className="ml-auto text-[9px] bg-[#38BDF8]/20 text-[#38BDF8] px-1.5 py-0.5 rounded-full font-mono uppercase font-semibold tracking-wider">New</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                <IcoSwapMenu /> <span className="text-sm font-medium">Swap</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                <IcoBridgeMenu /> <span className="text-sm font-medium">Bridge</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                <IcoGridMenu /> <span className="text-sm font-medium">NFTs</span>
                <span className="ml-auto text-[9px] bg-[#38BDF8]/20 text-[#38BDF8] px-1.5 py-0.5 rounded-full font-mono uppercase font-semibold tracking-wider">New</span>
             </div>
          </div>
          {/* Bottom Menu */}
          <div className="flex flex-col gap-2 mt-auto">
             <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                <IcoSettingsMenu /> <span className="text-sm font-medium">Settings</span>
             </div>
             <div className="flex items-center justify-between px-4 py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#38BDF8]/5 to-transparent border border-[#38BDF8]/10 text-white cursor-pointer">
                <span className="text-sm font-medium text-[#38BDF8]">Dark mode</span>
                <div className="bg-[#38BDF8] p-1.5 rounded-full text-black"><IcoMoonMenu /></div>
             </div>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 flex flex-col bg-[#0A0A0A] z-10 relative">
          {/* Header */}
          <div className="border-b border-white/5 px-5 py-4 md:h-20 md:px-10 md:py-0 shrink-0">
             <div className="flex h-full flex-col justify-center gap-3 sm:flex-row sm:items-center sm:justify-between">
               <div className="flex items-center gap-4">
                <span className="text-sm text-white/40">Balance</span>
                <span className="text-lg font-medium text-white font-mono">$99.00</span>
               </div>
               <a href="https://wallet.expoin.net" className="inline-flex w-fit items-center gap-2 self-start rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-3 py-2 text-xs font-medium text-[#38BDF8] transition-colors hover:bg-[#38BDF8]/20 sm:self-auto sm:px-5 sm:py-2.5 sm:text-sm">
                  <IcoWalletMenu /> Connect wallet
               </a>
             </div>
          </div>

          {/* Tabs */}
          <div className="flex px-6 md:px-10 border-b border-white/5 shrink-0">
             <div className="flex-1 text-center py-4 border-b-2 border-[#38BDF8] text-white text-sm font-medium cursor-pointer">Assets</div>
             <div className="flex-1 text-center py-4 border-b-2 border-transparent text-white/40 hover:text-white transition-colors cursor-pointer text-sm font-medium">Statistics</div>
          </div>

          {/* Content / Scrollable */}
          <div className="p-6 md:p-10 flex-1 overflow-y-auto flex flex-col gap-4">
             {/* Search */}
             <div className="w-full md:w-80 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5 focus-within:border-white/10 transition-colors">
                <IcoSearchMenu className="text-white/40" />
                <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 w-full font-sans" />
             </div>

             {/* List */}
             <div className="flex flex-col gap-3 mt-4">
                {DASHBOARD_ASSETS.map((asset, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer group/row">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-lg relative" style={{ backgroundColor: asset.color + '20', color: asset.color }}>
                           <div className="absolute inset-0 rounded-full opacity-20 blur-md" style={{ backgroundColor: asset.color }}></div>
                           <span className="relative z-10">{asset.char}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-white group-hover/row:text-[#38BDF8] transition-colors">{asset.name}</span>
                           <span className="text-xs text-white/40 font-mono uppercase mt-0.5">{asset.ticker}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 sm:gap-6">
                        <DashboardSparkline type={asset.type} />
                        <div className="w-8 h-8 rounded-full border border-transparent group-hover/row:border-white/10 flex items-center justify-center transition-colors">
                           <IcoChevronMenu className="text-white/30 group-hover/row:text-white/70 transition-colors" />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}
