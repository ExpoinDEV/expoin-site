import React from 'react';
import {Link} from 'react-router-dom';

export default function Hero() {
  return (
    <main className="container lg:px-12 lg:pt-0 min-h-[1100px] lg:min-h-[1030px] flex flex-col lg:flex-row z-10 mr-auto ml-auto pt-0 pr-6 pl-6 relative items-center lg:-mt-[70px]">
      {/* Left Column */}
      <div className="lg:w-1/2 flex flex-col lg:py-0 lg:mt-0 w-full mt-16 pt-12 pb-16 lg:pb-12 justify-center">
        <h1 className="lg:text-7xl leading-[1.1] text-5xl tracking-tight font-sans font-semibold mb-6">
          <span className="text-[#38BDF8] text-glow">One Wallet. Every Chain.</span> <br /> 
          <span className="text-white/40">No Middleman.</span>
        </h1>

        <p className="font-sans text-xl lg:text-2xl font-light text-white/70 leading-relaxed tracking-tight max-w-xl mb-12">
          We were tired of bridges and centralized bottlenecks, so we built the tool we wanted for ourselves. <span className="text-[#38BDF8] font-medium">Atomic Swaps</span> across any chain as if the borders never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 gap-x-6 gap-y-6 items-start sm:items-center">
          <a href="https://wallet.expoin.net" className="shiny-cta focus:outline-none">
            <span>Launch App</span>
          </a>

          <Link to={{pathname: '/', hash: '#key-advantages'}} className="hover:bg-white/10 hover:text-white transition-all flex text-sm font-medium text-slate-300 bg-white/5 rounded-full pt-3 pr-6 pb-3 pl-6 gap-x-2 gap-y-2 items-center group" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)', position: 'relative', '--border-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.15))', '--border-radius-before': '9999px' } as React.CSSProperties}>
            <span className="text-sm font-medium tracking-tight">Explore Ecosystem</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>

      {/* Right Column: Abstract UI with Sonar */}
      <div className="lg:w-1/2 lg:h-[800px] flex w-full h-[500px] relative perspective-1000 items-center justify-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" viewBox="0 0 600 600">
          {/* Connecting Beams */}
          <g>
            <path d="M -50 150 C 100 150, 100 300, 300 300" fill="none" stroke="white" strokeWidth="1" className="opacity-[0.08]"></path>
            <path d="M -50 150 C 100 150, 100 300, 300 300" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="animate-beam opacity-60" strokeDasharray="80 1000" strokeLinecap="round"></path>
          </g>
          <g>
            <path d="M -50 450 C 100 450, 100 300, 300 300" fill="none" stroke="white" strokeWidth="1" className="opacity-[0.08]"></path>
            <path d="M -50 450 C 100 450, 100 300, 300 300" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="animate-beam opacity-60" style={{ animationDelay: '-1s' }} strokeDasharray="80 1000" strokeLinecap="round"></path>
          </g>
          <g>
            <path d="M 650 100 C 500 100, 500 300, 300 300" fill="none" stroke="white" strokeWidth="1" className="opacity-[0.08]"></path>
            <path d="M 650 100 C 500 100, 500 300, 300 300" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="animate-beam opacity-60" style={{ animationDelay: '-2s' }} strokeDasharray="80 1000" strokeLinecap="round"></path>
          </g>
          <g>
            <path d="M 650 500 C 500 500, 500 300, 300 300" fill="none" stroke="white" strokeWidth="1" className="opacity-[0.08]"></path>
            <path d="M 650 500 C 500 500, 500 300, 300 300" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="animate-beam opacity-60" style={{ animationDelay: '-1.5s' }} strokeDasharray="80 1000" strokeLinecap="round"></path>
          </g>

          {/* Central Node */}
          <g transform="translate(300, 300)">
            <circle r="120" fill="url(#center-glow)" className="animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]"></circle>
            {/* Sonar Waves */}
            <circle r="20" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.5" className="animate-sonar"></circle>
            <circle r="20" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.5" className="animate-sonar delay-1000"></circle>
            <circle r="20" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.5" className="animate-sonar delay-2000"></circle>
            {/* Rings */}
            <circle r="65" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="10 20" className="animate-[spin_12s_linear_infinite]"></circle>
            <circle r="45" fill="none" stroke="#38BDF8" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 6" className="animate-[spin_15s_linear_infinite_reverse]"></circle>
            <g className="animate-[spin_12s_linear_infinite]" style={{ animationDuration: '20s' }}>
              <path d="M -80 0 L -70 0" stroke="white" strokeOpacity="0.2"></path>
              <path d="M 80 0 L 70 0" stroke="white" strokeOpacity="0.2"></path>
              <path d="M 0 -80 L 0 -70" stroke="white" strokeOpacity="0.2"></path>
              <path d="M 0 80 L 0 70" stroke="white" strokeOpacity="0.2"></path>
            </g>
            <circle r="8" fill="#0A0A0A" stroke="#38BDF8" strokeWidth="2"></circle>
            <circle r="4" fill="#38BDF8" className="animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]"></circle>
          </g>
        </svg>

        {/* Floating Labels */}
        <div className="absolute top-[20%] lg:top-[25%] left-[10%] lg:left-[15%] flex flex-col items-end">
          <span className="text-xs font-mono text-[#38BDF8] tracking-widest mb-1 opacity-80">ZERO LATENCY</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-[#38BDF8] to-transparent"></div>
        </div>
        <div className="absolute bottom-[20%] lg:bottom-[25%] right-[10%] lg:right-[15%] flex flex-col items-start">
          <span className="text-xs font-mono text-[#38BDF8] tracking-widest mb-1 opacity-80">DEFI NATIVE</span>
          <div className="h-[1px] w-12 bg-gradient-to-r from-[#38BDF8] to-transparent"></div>
        </div>
      </div>
    </main>
  );
}
