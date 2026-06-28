import React from 'react';
import {Link} from 'react-router-dom';

export default function Footer() {
  const handleSoon = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault();
    window.alert('This section is coming soon.');
  };

  return (
    <footer className="lg:px-12 flex flex-col z-10 overflow-hidden bg-[#030303] w-full border-white/5 border-t pt-12 pr-6 pb-12 pl-6 relative items-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_200px] [mask-image:linear-gradient(to_bottom,transparent,black_20%)] pointer-events-none"></div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 relative z-10">
        <div className="lg:w-3/12 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo_wht.svg" alt="Expoin" className="h-10 w-auto object-contain" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="text-white font-semibold text-base tracking-wide">DeFi, finally fixed.</h4>
            <p className="text-white/40 text-sm leading-relaxed max-w-[280px] font-light">
              No more bridge drama or centralized bottlenecks. Trade 99% of the market directly from your wallet with absolute precision.
            </p>
          </div>

          <div className="flex gap-5 mt-2">
            <a href="#" className="text-white/30 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"></path>
              </svg>
            </a>
            <a href="#" className="text-white/30 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.001 2c-5.525 0-10 4.475-10 10a9.99 9.99 0 0 0 6.837 9.488c.5.087.688-.213.688-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.337 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.687c-.1-.25-.45-1.275.1-2.65c0 0 .837-.263 2.75 1.024a9.3 9.3 0 0 1 2.5-.337c.85 0 1.7.112 2.5.337c1.913-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.02 10.02 0 0 0 22 12c0-5.525-4.475-10-10-10"></path>
              </svg>
            </a>
            <a href="#" className="text-white/30 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="lg:w-4/12 grid grid-cols-2 gap-8 pt-2">
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-medium text-sm tracking-wide">Expoin</h4>
            <ul className="flex flex-col gap-3.5">
              <li><a href="#" onClick={handleSoon} className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Docs</a></li>
              <li><Link to="/facts" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Facts</Link></li>
              <li><Link to="/faq" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">FAQ</Link></li>
              <li><Link to="/tokenomics" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Tokenomics</Link></li>
              <li><Link to="/roadmap" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Roadmap</Link></li>
              <li>
                <a href="#" onClick={handleSoon} className="flex items-center gap-2 text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">
                  Agent Economy
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-white font-medium text-sm tracking-wide">Project</h4>
            <ul className="flex flex-col gap-3.5">
              <li><a href="#" onClick={handleSoon} className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Vibe</a></li>
              <li><a href="#" onClick={handleSoon} className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Ambassadors</a></li>
              <li><a href="#" onClick={handleSoon} className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Press Kit</a></li>
              <li><Link to="/" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Main Site</Link></li>
            </ul>
          </div>
        </div>

        <div className="lg:w-5/12 flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          <a href="mailto:contact@expoin.net" className="flex-1 group relative p-7 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-36 lg:h-40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start relative z-10">
              <span className="text-white font-medium text-sm tracking-wide">Contact Us</span>
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                <path fill="currentColor" fillRule="evenodd" d="M17.47 15.53a.75.75 0 0 0 1.28-.53V6a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.53 1.28z" clipRule="evenodd"></path>
                <path fill="currentColor" d="M5.47 17.47a.75.75 0 1 0 1.06 1.06l6.97-6.97l-1.06-1.06z" opacity=".5"></path>
              </svg>
            </div>
            <div className="relative z-10 flex items-end justify-between">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify text-[#38BDF8]/60 w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                <path fill="currentColor" d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25z" opacity=".22"></path>
                <path fill="currentColor" d="M6.8 7.25h10.4c.47 0 .85.38.85.85v.18l-5.4 4.19a1.1 1.1 0 0 1-1.35 0L5.95 8.28V8.1c0-.47.38-.85.85-.85"></path>
                <path fill="currentColor" d="M5.95 9.82v6.08c0 .47.38.85.85.85h10.4c.47 0 .85-.38.85-.85V9.82l-4.48 3.47a2.6 2.6 0 0 1-3.14 0z" opacity=".72"></path>
              </svg>
            </div>
          </a>

          <a href="#" className="flex-1 group relative p-7 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-36 lg:h-40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start relative z-10">
              <span className="text-white font-medium text-sm tracking-wide">Help Center</span>
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                <path fill="currentColor" fillRule="evenodd" d="M17.47 15.53a.75.75 0 0 0 1.28-.53V6a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.53 1.28z" clipRule="evenodd"></path>
                <path fill="currentColor" d="M5.47 17.47a.75.75 0 1 0 1.06 1.06l6.97-6.97l-1.06-1.06z" opacity=".5"></path>
              </svg>
            </div>
            <div className="relative z-10 flex items-end justify-between">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify text-[#38BDF8]/60 w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                <path fill="currentColor" d="M2 12.124C2 6.533 6.477 2 12 2s10 4.533 10 10.124v5.243c0 .817 0 1.378-.143 1.87a3.52 3.52 0 0 1-1.847 2.188c-.458.22-1.004.307-1.801.434l-.13.02a13 13 0 0 1-.727.105c-.209.02-.422.027-.64-.016a2.1 2.1 0 0 1-1.561-1.35a2.2 2.2 0 0 1-.116-.639c-.012-.204-.012-.452-.012-.742v-4.173c0-.425 0-.791.097-1.105a2.1 2.1 0 0 1 1.528-1.43c.316-.073.677-.044 1.096-.01l.093.007l.11.01c.783.062 1.32.104 1.775.275q.481.181.883.487v-1.174c0-4.811-3.853-8.711-8.605-8.711s-8.605 3.9-8.605 8.711v1.174c.267-.203.563-.368.883-.487c.455-.17.992-.213 1.775-.276l.11-.009l.093-.007c.42-.034.78-.063 1.096.01a2.1 2.1 0 0 1 1.528 1.43c.098.314.097.68.097 1.105v4.172c0 .291 0 .54-.012.743c-.012.213-.04.427-.116.638a2.1 2.1 0 0 1-1.56 1.35a2.2 2.2 0 0 1-.641.017c-.201-.02-.444-.059-.727-.104l-.13-.02c-.797-.128-1.344-.215-1.801-.436a3.52 3.52 0 0 1-1.847-2.188c-.118-.405-.139-.857-.142-1.461L2 17.58z"></path>
                <path fill="currentColor" fillRule="evenodd" d="M12 5.75a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75m3 1.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75m-6 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V8A.75.75 0 0 1 9 7.25" clipRule="evenodd" opacity=".5"></path>
              </svg>
            </div>
          </a>
        </div>
      </div>

      <div className="w-full max-w-7xl mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <span className="text-white/20 text-xs font-mono tracking-wide">© 2026 Expoin DEX Technologies. All rights reserved.</span>

        <div className="flex items-center gap-8">
          <span className="text-white/20 text-xs font-mono border-l border-white/10 pl-8">Security Audited</span>
        </div>
      </div>
    </footer>
  );
}
