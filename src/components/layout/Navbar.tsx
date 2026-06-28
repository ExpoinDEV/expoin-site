import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="fixed -translate-x-1/2 flex shadow-black/50 transition-all duration-300 hover:border-white/20 hover:shadow-[#38BDF8]/5 bg-gradient-to-br from-white/10 to-white/0 w-[calc(100vw-24px)] lg:w-fit max-w-[90vw] z-50 rounded-full ring-white/10 ring-1 pt-1.5 pr-1.5 pb-1.5 pl-4 top-4 sm:top-6 left-1/2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] backdrop-blur-xl items-center justify-between">
        <div className="flex items-center min-w-0 pr-3 lg:pr-6">
          <Link to="/" className="relative flex items-center justify-center min-w-0">
            <img src="/logo_wht.svg" alt="Expoin" className="h-8 sm:h-9 w-auto min-w-[112px] object-contain" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-3 sm:gap-6 mr-2 sm:mr-8">
          <Link to="/sale" className="text-[10px] sm:text-xs font-medium text-white/80 hover:text-white transition-colors">Buy EXN</Link>
          <Link to={{pathname: '/', hash: '#how-it-works'}} className="text-[10px] sm:text-xs font-medium text-white/80 hover:text-white transition-colors">How it Works</Link>
          <Link to={{pathname: '/', hash: '#key-advantages'}} className="text-[10px] sm:text-xs font-medium text-white/80 hover:text-white transition-colors">Explore Ecosystem</Link>
        </div>

        <a href="https://wallet.expoin.net" className="hidden lg:flex gap-2 hover:bg-[#38BDF8] transition-colors group text-xs font-semibold text-black bg-white rounded-full pt-2 pr-4 pb-2 pl-4 gap-x-2 gap-y-2 items-center flex-none">
          Launch App
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify group-hover:translate-x-0.5 transition-transform"><path fill="currentColor" d="M13.25 12.75V18a.75.75 0 0 0 1.28.53l6-6a.75.75 0 0 0 0-1.06l-6-6a.75.75 0 0 0-1.28.53z"></path></svg>
        </a>

        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="lg:hidden ml-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        <div className={`absolute left-3 right-3 top-20 rounded-[28px] border border-white/10 bg-[#06090d]/95 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex flex-col gap-2">
            <Link to="/sale" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.06]">Buy EXN</Link>
            <Link to={{pathname: '/', hash: '#how-it-works'}} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.06]">How it Works</Link>
            <Link to={{pathname: '/', hash: '#key-advantages'}} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.06]">Explore Ecosystem</Link>
          </div>

          <Link to="/sale" className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#38BDF8] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#38BDF8]/90">
            Buy EXN
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="transition-transform">
              <path fill="currentColor" d="M13.25 12.75V18a.75.75 0 0 0 1.28.53l6-6a.75.75 0 0 0 0-1.06l-6-6a.75.75 0 0 0-1.28.53z"></path>
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
