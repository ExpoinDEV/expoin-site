import React, {Suspense, useEffect} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import UnicornBackground from './UnicornBackground';
import {Skeleton} from '../ui/skeleton';
import {siteStyles} from './SiteShell';

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    const navOffset = 120;

    if (!location.hash) {
      window.scrollTo({top: 0, left: 0, behavior: 'auto'});
      return;
    }

    const targetId = location.hash.replace('#', '');
    let attempts = 0;

    const scrollToHash = () => {
      const target = document.getElementById(targetId);
      if (target) {
        const targetTop = window.scrollY + target.getBoundingClientRect().top - navOffset;
        window.scrollTo({top: Math.max(0, targetTop), left: 0, behavior: 'smooth'});
        return;
      }

      attempts += 1;
      if (attempts < 12) {
        window.setTimeout(scrollToHash, 120);
      }
    };

    scrollToHash();
  }, [location.pathname, location.hash]);

  return null;
}

function SaleBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030608]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: [
            'radial-gradient(circle at 12% 18%, rgba(56, 189, 248, 0.13), transparent 28%)',
            'radial-gradient(circle at 88% 32%, rgba(14, 165, 233, 0.10), transparent 30%)',
            'linear-gradient(180deg, rgba(5, 13, 18, 0.35), rgba(3, 3, 3, 0.96) 78%)',
          ].join(','),
        }}
      />
      <div
        className="absolute inset-x-5 top-24 h-[620px] rounded-[48px] border border-white/[0.035] sm:inset-x-8 lg:left-1/2 lg:w-[min(92vw,1440px)] lg:-translate-x-1/2"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            'radial-gradient(ellipse at center, rgba(9, 18, 24, 0.34), rgba(3, 6, 8, 0.88) 72%)',
          ].join(','),
          backgroundSize: '64px 64px, 64px 64px, 100% 100%',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.025), 0 40px 120px rgba(0,0,0,0.35)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
        }}
      />
      <div className="absolute left-[8%] top-52 h-56 w-56 rounded-full bg-[#38BDF8]/[0.055] blur-[90px] sm:h-72 sm:w-72" />
      <div className="absolute right-[6%] top-80 h-64 w-64 rounded-full bg-[#0EA5E9]/[0.045] blur-[110px] sm:h-80 sm:w-80" />
    </div>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const isSalePage = normalizedPath === '/sale' || normalizedPath.startsWith('/sale/community');
  const hideAnimatedBackground = isSalePage || normalizedPath === '/not-financial-advice';
  const hideSiteChrome = normalizedPath === '/not-financial-advice';

  if (hideSiteChrome) {
    return (
      <>
        <ScrollManager />
        <Suspense fallback={<div className="relative z-10 flex h-[50vh] items-center justify-center px-6"><Skeleton className="h-12 w-full max-w-sm rounded-full" /></div>}>
          <Outlet />
        </Suspense>
      </>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#38BDF8] selection:text-black relative bg-[#030303] text-white z-0">
      <style>{siteStyles}</style>
      <ScrollManager />
      {isSalePage ? <SaleBackground /> : null}
      {!hideAnimatedBackground ? <UnicornBackground /> : null}
      {!hideAnimatedBackground ? <div className="fixed inset-0 grid-bg pointer-events-none z-0"></div> : null}
      <Navbar />
      <Suspense fallback={<div className="relative z-10 flex h-[50vh] items-center justify-center px-6"><Skeleton className="h-12 w-full max-w-sm rounded-full" /></div>}>
        <main className="relative z-10">
          <Outlet />
        </main>
      </Suspense>
      <Footer />
    </div>
  );
}
