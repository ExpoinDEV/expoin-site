import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import UnicornBackground from './UnicornBackground';

type SiteShellProps = {
  children: React.ReactNode;
  showBackground?: boolean;
};

export const siteStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@1,6..72,300;1,6..72,400&display=swap');

  body {
    background-color: #030303;
    color: #ffffff;
    -webkit-font-smoothing: antialiased;
    font-family: 'Inter', sans-serif;
  }
  .font-serif {
    font-family: 'Newsreader', serif;
  }
  .text-glow {
    text-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
  }
  .grid-bg {
    background-size: 100px 200px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
    -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
  }

  @keyframes beam {
    0% { stroke-dashoffset: 1000; }
    100% { stroke-dashoffset: 0; }
  }
  .animate-beam {
    animation: beam 3s linear infinite;
  }
  @keyframes sonar-wave {
    0% { r: 10px; opacity: 0.8; stroke-width: 1px; }
    100% { r: 80px; opacity: 0; stroke-width: 0px; }
  }
  .animate-sonar {
    animation: sonar-wave 3s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  .delay-1000 { animation-delay: 1s; }
  .delay-2000 { animation-delay: 2s; }

  @property --gradient-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
  @property --gradient-angle-offset { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
  @property --gradient-percent { syntax: "<percentage>"; initial-value: 20%; inherits: false; }
  @property --gradient-shine { syntax: "<color>"; initial-value: #38BDF8; inherits: false; }

  .shiny-cta {
    --gradient-angle: 0deg;
    --gradient-angle-offset: 0deg;
    --gradient-percent: 20%;
    --gradient-shine: #38BDF8;
    --shadow-size: 2px;
    position: relative;
    overflow: hidden;
    border-radius: 9999px;
    padding: 1.25rem 2.5rem;
    font-size: 1rem;
    line-height: 1.2;
    font-weight: 500;
    color: #ffffff;
    background: linear-gradient(#030303, #030303) padding-box,
    conic-gradient(from calc(var(--gradient-angle) - var(--gradient-angle-offset)), transparent 0%, #0ea5e9 5%, var(--gradient-shine) 15%, #0ea5e9 30%, transparent 40%, transparent 100%) border-box;
    border: 2px solid transparent;
    box-shadow: inset 0 0 0 1px #1a1818;
    outline: none;
    transition: --gradient-angle-offset 800ms cubic-bezier(0.25, 1, 0.5, 1), --gradient-percent 800ms cubic-bezier(0.25, 1, 0.5, 1), --gradient-shine 800ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s;
    cursor: pointer;
    isolation: isolate;
    outline-offset: 4px;
    font-family: 'Inter', 'Helvetica Neue', sans-serif;
    z-index: 0;
    animation: border-spin 2.5s linear infinite;
  }
  @keyframes border-spin { to { --gradient-angle: 360deg; } }
  .shiny-cta:active { transform: translateY(1px); }
  .shiny-cta::before {
    content: '';
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    --size: calc(100% - 6px);
    --position: 2px;
    --space: 4px;
    width: var(--size);
    height: var(--size);
    background: radial-gradient(circle at var(--position) var(--position), white 0.5px, transparent 0) padding-box;
    background-size: var(--space) var(--space);
    background-repeat: space;
    mask-image: conic-gradient(from calc(var(--gradient-angle) + 45deg), black, transparent 10% 90%, black);
    -webkit-mask-image: conic-gradient(from calc(var(--gradient-angle) + 45deg), black, transparent 10% 90%, black);
    border-radius: inherit;
    opacity: 0.4;
    pointer-events: none;
  }
  .shiny-cta::after {
    content: '';
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 100%;
    aspect-ratio: 1;
    background: linear-gradient(-50deg, transparent, #0ea5e9, transparent);
    mask-image: radial-gradient(circle at bottom, transparent 40%, black);
    -webkit-mask-image: radial-gradient(circle at bottom, transparent 40%, black);
    opacity: 0.6;
    animation: shimmer 4s linear infinite;
    animation-play-state: running;
  }
  .shiny-cta span { position: relative; z-index: 2; display: inline-block; }
  .shiny-cta span::before {
    content: '';
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    --size: calc(100% + 1rem);
    width: var(--size);
    height: var(--size);
    box-shadow: inset 0 -1ex 2rem 4px #0ea5e9;
    opacity: 0;
    border-radius: inherit;
    transition: opacity 800ms cubic-bezier(0.25, 1, 0.5, 1);
    animation: breathe 4.5s linear infinite;
  }
  @keyframes shimmer { to { transform: translate(-50%, -50%) rotate(360deg);} }
  @keyframes breathe {
    0%, 100% { transform: translate(-50%, -50%) scale(1);}
    50% { transform: translate(-50%, -50%) scale(1.20);}
  }

  [style*="--border-gradient"]::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: var(--border-radius-before, inherit);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    background: var(--border-gradient);
    pointer-events: none;
  }
`;

export default function SiteShell({children, showBackground = true}: SiteShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#38BDF8] selection:text-black relative bg-[#030303] text-white z-0">
      <style>{siteStyles}</style>
      {showBackground ? <UnicornBackground /> : null}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0"></div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
