/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

// --- ICONS ---
const IcoArrDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
const IcoBnb = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 511.97 511.97"><path fill="currentColor" d="M156.56,215.14,256,115.71l99.47,99.47,57.86-57.85L256,0,98.71,157.28l57.85,57.85M0,256l57.86-57.87L115.71,256,57.85,313.83Zm156.56,40.85L256,396.27l99.47-99.47,57.89,57.82,0,0L256,512,98.71,354.7l-.08-.09,57.93-57.77M396.27,256l57.85-57.85L512,256l-57.85,57.85Z"/><path fill="currentColor" d="M314.66,256h0L256,197.25,212.6,240.63h0l-5,5L197.33,255.9l-.08.08.08.08L256,314.72l58.7-58.7,0,0-.05,0"/></svg>;
const IcoExpoin = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4.929 4.929c-3.905 3.905-3.905 10.237 0 14.142s10.237 3.905 14.142 0s3.905-10.237 0-14.142s-10.237-3.905-14.142 0"></path><path d="M18.521 4.418L4.418 18.521a10 10 0 0 0 1.06 1.061L19.583 5.479a10 10 0 0 0-1.06-1.06"></path></svg>;
const IcoCheck = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IcoCheckSmall = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IcoCopy = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1); // Отслеживает максимальный разблокированный шаг
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [purchaseState, setPurchaseState] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [copied, setCopied] = useState(false);

  const tokenPrice = 0.05; // $0.05 per EXN
  const listingPrice = 0.12; // $0.12 at Listing
  const usdtPrice = 1; // USDT is pegged to $1
  
  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPayAmount(val);
    if (val && !isNaN(Number(val))) {
      const usdValue = parseFloat(val) * usdtPrice;
      setReceiveAmount((usdValue / tokenPrice).toFixed(2));
    } else {
      setReceiveAmount('');
    }
  };

  const handlePurchase = () => {
    if (!payAmount || isNaN(Number(payAmount)) || parseFloat(payAmount) <= 0) return;
    
    setPurchaseState('loading');
    
    // Simulate Blockchain Transaction
    setTimeout(() => {
      setPurchaseState('success');
    }, 2500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("https://expoin.dex/ref/0x7A...9f");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Функция для безопасного перехода по кнопкам с разблокировкой этапов
  const goToStep = (step: number) => {
    setHighestStep(prev => Math.max(prev, step));
    setCurrentStep(step);
  };

  const steps = [
    { id: 1, label: "Curious Stranger", desc: "Learn the concept & alpha" },
    { id: 2, label: "Early Insider", desc: "Private round at $0.05" },
    { id: 3, label: "The 2x Jump", desc: "Value hits 2.4x at TGE" },
    { id: 4, label: "Dividends & Chill", desc: "Collect trading dividends" }
  ];

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@1,6..72,300;1,6..72,400&display=swap');

    body {
      background-color: #030303;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
      font-family: 'Inter', sans-serif;
    }
    .text-glow {
      text-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
    }
    .grid-bg {
      background-size: 100px 200px;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      mask-image: radial-gradient(circle at top, black 40%, transparent 100%);
      -webkit-mask-image: radial-gradient(circle at top, black 40%, transparent 100%);
    }
    
    @keyframes fadeInStep { 
      from { opacity: 0; transform: translateY(15px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    .animate-step {
      animation: fadeInStep 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }

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
      padding: 1.1rem 2.5rem;
      font-size: 1rem;
      line-height: 1.2;
      font-weight: 600;
      color: #000000;
      background: linear-gradient(#38BDF8, #38BDF8) padding-box,
      conic-gradient( from calc(var(--gradient-angle) - var(--gradient-angle-offset)), transparent 0%, #ffffff 5%, var(--gradient-shine) 15%, #ffffff 30%, transparent 40%, transparent 100% ) border-box;
      border: 2px solid transparent;
      box-shadow: 0 0 30px rgba(56,189,248,0.3);
      outline: none;
      transition: --gradient-angle-offset 800ms cubic-bezier(0.25, 1, 0.5, 1), --gradient-percent 800ms cubic-bezier(0.25, 1, 0.5, 1), --gradient-shine 800ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s, transform 0.2s, opacity 0.3s;
      cursor: pointer;
      isolation: isolate;
      outline-offset: 4px;
      z-index: 0;
      animation: border-spin 2.5s linear infinite;
    }
    @keyframes border-spin { to { --gradient-angle: 360deg; } }
    .shiny-cta:active:not(:disabled) { transform: translateY(2px); }
    .shiny-cta:disabled { opacity: 0.5; cursor: not-allowed; animation: none; background: #38BDF8; box-shadow: none;}
    .shiny-cta span { position: relative; z-index: 2; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%;}
    
    .outline-cta {
      padding: 1.1rem 2.5rem;
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.03);
      color: #ffffff;
      border-radius: 9999px;
      font-weight: 500;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .outline-cta:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.3);
    }
    .outline-cta:active { transform: translateY(2px); }

    /* Spinner */
    .loader {
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #38BDF8;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;

  // Extracted Timeline Component
  const timelineElement = (
    <div className="w-full max-w-5xl mx-auto mb-12 mt-6 relative px-2 sm:px-0">
      {/* Track Background */}
      <div className="absolute top-[16px] sm:top-[20px] left-[12.5%] right-[12.5%] h-[2px] bg-white/10 z-0"></div>
      {/* Active Track (показывает прогресс до максимально открытого шага) */}
      <div className="absolute top-[16px] sm:top-[20px] left-[12.5%] h-[2px] bg-[#38BDF8] transition-all duration-700 ease-out z-0" style={{ width: `${Math.min(highestStep - 1, 3) * 33.333}%` }}></div>
      
      <div className="flex justify-between relative z-10 w-full">
        {steps.map(s => {
          const isLocked = s.id > highestStep;
          const isCompleted = s.id < currentStep && !isLocked;
          const isCurrent = currentStep === s.id || (currentStep === 5 && s.id === 4);
          
          return (
            <div 
              key={s.id} 
              className={`flex flex-col items-center w-1/4 px-1 sm:px-4 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer group'}`} 
              onClick={() => { if(purchaseState === 'idle' && !isLocked) setCurrentStep(s.id) }}
            >
              {/* Node Circle */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[11px] sm:text-sm font-mono font-bold border-[2px] transition-all duration-500 bg-[#030303] 
                ${isCurrent ? 'border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 
                  isCompleted ? 'border-[#38BDF8] bg-[#38BDF8] text-black shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 
                  isLocked ? 'border-white/10 text-white/20' : 
                  'border-[#38BDF8]/50 text-[#38BDF8]/80 group-hover:border-[#38BDF8] group-hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]'}
              `}>
                {isCurrent ? (
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
                ) : isCompleted ? (
                  <IcoCheckSmall />
                ) : (
                  s.id
                )}
              </div>
              {/* Node Text */}
              <div className="mt-3 sm:mt-4 text-center">
                <span className={`block text-[9px] sm:text-xs font-mono uppercase tracking-wider mb-1.5 transition-colors duration-300 
                  ${isCurrent ? 'text-white' : 
                    isCompleted ? 'text-white/80' : 
                    isLocked ? 'text-white/20' : 
                    'text-[#38BDF8]/80 group-hover:text-[#38BDF8]'}
                `}>
                  {s.label}
                </span>
                <span className={`hidden sm:block text-[11px] sm:text-[13px] font-light leading-snug transition-colors duration-300 
                  ${isCurrent ? 'text-white/60' : 
                    isCompleted ? 'text-white/50' : 
                    isLocked ? 'text-white/20' : 
                    'text-white/40 group-hover:text-white/60'}
                `}>
                  {s.desc}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#38BDF8] selection:text-black relative bg-[#030303] text-white z-0">
      <style>{customStyles}</style>

      {/* Static Background Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0"></div>

      {/* NAVIGATION */}
      <nav className="fixed -translate-x-1/2 flex shadow-black/50 transition-all duration-300 hover:border-white/20 hover:shadow-[#38BDF8]/5 bg-gradient-to-br from-white/10 to-white/0 w-full lg:w-fit max-w-[90vw] z-50 rounded-full ring-white/10 ring-1 pt-1.5 pr-1.5 pb-1.5 pl-4 top-6 left-1/2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] backdrop-blur-xl items-center justify-between">
        <div className="flex gap-2.5 items-center mr-8">
          <div className="relative flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: 'rgb(56, 189, 248)' }} className="iconify w-[24px] h-[24px]" aria-hidden="true" role="img" strokeWidth="2">
              <path fill="#38bdf8" d="M4.929 4.929c-3.905 3.905-3.905 10.237 0 14.142s10.237 3.905 14.142 0s3.905-10.237 0-14.142s-10.237-3.905-14.142 0" opacity=".5"></path>
              <path fill="#38bdf8" d="M18.521 4.418L4.418 18.521a10 10 0 0 0 1.06 1.061L19.583 5.479a10 10 0 0 0-1.06-1.06"></path>
            </svg>
          </div>
          <span className="font-sans font-medium text-base tracking-tight text-white">Expoin</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 mr-2 sm:mr-8">
          <a href="#" className="text-[10px] sm:text-xs font-medium text-white hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Buy $EXN</a>
          <a href="#" className="text-[10px] sm:text-xs font-medium text-white/60 hover:text-white transition-colors">Earn</a>
          <a href="#" className="text-[10px] sm:text-xs font-medium text-white/60 hover:text-white transition-colors">About</a>
          <a href="#" className="text-[10px] sm:text-xs font-medium text-white/60 hover:text-white transition-colors">Blog</a>
        </div>

        <button className="flex gap-2 hover:bg-[#38BDF8] transition-colors group text-xs font-semibold text-black bg-white rounded-full pt-2 pr-4 pb-2 pl-4 gap-x-2 gap-y-2 items-center flex-none">
          Connect Wallet
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify group-hover:translate-x-0.5 transition-transform"><path fill="currentColor" d="M13.25 12.75V18a.75.75 0 0 0 1.28.53l6-6a.75.75 0 0 0 0-1.06l-6-6a.75.75 0 0 0-1.28.53z"></path></svg>
        </button>
      </nav>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-36 pb-24 min-h-[90vh] flex flex-col">
        
        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          
          {/* STEP 1: The Fork in the Road */}
          {currentStep === 1 && (
            <div className="w-full flex flex-col items-center animate-step" key="step1">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 backdrop-blur-sm">
                <span>🟢</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Step 1: Just Looking</span>
              </div>
              <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-white mb-6 max-w-3xl mx-auto">
                You’re here because <br className="hidden md:block"/>
                <span className="text-[#38BDF8] text-glow">you see the loop.</span>
              </h1>

              {timelineElement}

              <p className="text-center text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                You clicked because you know DEX protocols are the backbone of Web3. You can skip the long talk and secure your spot right now, or we can take a 2-minute walk through why this is the smartest move you’ll make this quarter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
                <button onClick={() => goToStep(4)} className="shiny-cta flex-1 w-full">
                  <span>I’m Ready. Buy EXN.</span>
                </button>
                <button onClick={() => goToStep(2)} className="outline-cta flex-1 w-full">
                  <span>Wait, tell me more →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: The Alpha */}
          {currentStep === 2 && (
            <div className="w-full flex flex-col items-center animate-step" key="step2">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 backdrop-blur-sm">
                <span>🟡</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Step 2: Getting the Alpha</span>
              </div>
              <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-white mb-6 max-w-4xl mx-auto">
                The <span className="text-[#38BDF8] text-glow">"6-Month Headstart"</span> Advantage.
              </h1>
              
              {timelineElement}

              <p className="text-center text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-8">
                You’re catching Expoin in a rare window. You’re entering the private round exactly 6 months before the real fun starts (passive income).
              </p>
              
              <div className="bg-white/[0.02] border border-[#38BDF8]/20 rounded-2xl p-6 md:p-8 text-left mb-10 max-w-2xl mx-auto relative overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#38BDF8]"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#38BDF8]/10 blur-3xl rounded-full"></div>
                <h4 className="text-[#38BDF8] font-mono uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  The Math
                </h4>
                <p className="text-white/80 font-light leading-relaxed text-sm md:text-base relative z-10">
                  The next public round is already priced higher. By the time the first token burn hits, your position is effectively a <strong>2x before the rest of the world even wakes up.</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
                <button onClick={() => goToStep(4)} className="shiny-cta flex-1 w-full">
                  <span>Got it. Let’s invest.</span>
                </button>
                <button onClick={() => goToStep(3)} className="outline-cta flex-1 w-full">
                  <span>And then what? (The Payout) →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: The End Game */}
          {currentStep === 3 && (
            <div className="w-full flex flex-col items-center animate-step" key="step3">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 backdrop-blur-sm">
                <span>🟠</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Step 3: The Exit Strategy</span>
              </div>
              <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-white mb-6 max-w-3xl mx-auto">
                Mailbox money. <br className="hidden md:block"/>
                <span className="text-[#38BDF8] text-glow">No, seriously.</span>
              </h1>

              {timelineElement}

              <p className="text-center text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                This isn’t just about "buying low, selling high." Once the unlock happens, you’ve got a choice: flip for a profit or stay for the dividends. As an early backer, you’ll be collecting a slice of every trade made on Expoin. While others are chasing the next pump, you’re just checking your balance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
                <button onClick={() => goToStep(4)} className="shiny-cta flex-1 w-full">
                  <span>Secure My Future Revenue</span>
                </button>
                <button onClick={() => goToStep(5)} className="outline-cta flex-1 w-full">
                  <span>Maybe later</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: The Final Checkout */}
          {currentStep === 4 && (
            <div className="w-full flex flex-col items-center animate-step" key="step4">
              
              {purchaseState === 'idle' && (
                <div className="w-full flex flex-col items-center text-center mx-auto mb-8 animate-step">
                  <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 backdrop-blur-sm">
                    <span>💎</span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Step 4: Legend Status</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-white max-w-3xl mx-auto">
                    Welcome to the <br className="hidden md:block"/>
                    <span className="text-[#38BDF8] text-glow">Inner Circle.</span>
                  </h1>
                </div>
              )}

              {/* Minimal Line instead of full Timeline to keep focus on purchase */}
              <div className="w-full max-w-5xl mx-auto mb-12 mt-2 relative px-2 sm:px-0 h-[2px] animate-step">
                <div className="absolute top-0 left-[12.5%] right-[12.5%] h-[2px] bg-white/10 z-0"></div>
                <div className="absolute top-0 left-[12.5%] h-[2px] bg-[#38BDF8] transition-all duration-700 ease-out z-10 shadow-[0_0_15px_rgba(56,189,248,0.5)]" style={{ width: '75%' }}></div>
              </div>

              {/* Token Sale Widget Layout */}
              <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
                
                {/* LEFT: Token Sale Widget */}
                <div 
                  className="w-full lg:w-[480px] spotlight-card relative rounded-[32px] border border-white/10 bg-[#080808]/80 backdrop-blur-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden group"
                  onMouseMove={handleMouseMove}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.05), transparent 40%)' }}></div>
                  
                  <div className="relative z-10">
                    
                    {/* STATE: IDLE (BUY INTERFACE) */}
                    {purchaseState === 'idle' && (
                      <div className="animate-step">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-2xl font-semibold text-white tracking-tight mb-1">Buy EXN</h3>
                            <p className="text-xs text-[#38BDF8] font-medium">You are purchasing EXN at the Private Round price.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Next Phase In</p>
                            <p className="text-white font-mono font-medium">2d 14h 30m</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                          <div className="flex justify-between text-xs font-mono text-white/60 mb-2">
                            <span>Raised: <strong className="text-white">$1,850,000</strong></span>
                            <span>Target: $2,500,000</span>
                          </div>
                          <div className="w-full bg-white/5 border border-white/10 rounded-full h-3 overflow-hidden">
                            <div className="bg-[#38BDF8] h-full w-[74%] relative rounded-full">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/40 animate-[pulse_2s_infinite]"></div>
                            </div>
                          </div>
                        </div>

                        {/* Pay Interface */}
                        <div className="flex flex-col gap-2 relative">
                          {/* Pay Input */}
                          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 transition-colors focus-within:border-white/20">
                            <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest mb-3 font-mono">
                              <span>You Pay</span>
                              <span>Balance: 1,245.00 USDT</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 cursor-default">
                                <div className="w-6 h-6 rounded-full bg-[#F3BA2F]/20 text-[#F3BA2F] flex items-center justify-center"><IcoBnb /></div>
                                <span className="font-semibold text-sm">USDT</span>
                              </div>
                              <input 
                                type="text" 
                                placeholder="0.0" 
                                value={payAmount}
                                onChange={handlePayChange}
                                className="bg-transparent text-right outline-none text-2xl font-mono text-white w-full placeholder-white/20" 
                              />
                            </div>
                          </div>

                          {/* Arrow Divider */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-white/40 z-10">
                            <IcoArrDown />
                          </div>

                          {/* Receive Input */}
                          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 transition-colors relative overflow-hidden">
                            <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest mb-3 font-mono relative z-10">
                              <span>You Receive</span>
                            </div>
                            <div className="flex justify-between items-center gap-4 relative z-10">
                              <div className="flex items-center gap-2 px-1">
                                <div className="w-6 h-6 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center"><IcoExpoin /></div>
                                <span className="font-semibold text-sm">EXN</span>
                              </div>
                              <input 
                                type="text" 
                                placeholder="0.0" 
                                value={receiveAmount}
                                readOnly
                                className="bg-transparent text-right outline-none text-2xl font-mono text-[#38BDF8] w-full placeholder-white/20" 
                              />
                            </div>
                          </div>
                        </div>

                        {/* AMAZON / BOOKING STYLE BONUS UPSELL */}
                        {parseFloat(receiveAmount) > 0 && (
                          <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 animate-step shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-mono">Guaranteed Value at TGE</span>
                              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">Listing @ $0.12</span>
                            </div>
                            <div className="flex justify-between items-end">
                              <span className="text-2xl font-mono font-bold text-emerald-400">
                                ${(parseFloat(receiveAmount) * listingPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </span>
                              <span className="text-sm text-emerald-400/80 mb-0.5">
                                Profit: <strong className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">+${(parseFloat(receiveAmount) * (listingPrice - tokenPrice)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> 🔥
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action */}
                        <div className="mt-6">
                          <button 
                            onClick={handlePurchase}
                            disabled={!payAmount || parseFloat(payAmount) <= 0}
                            className="shiny-cta"
                          >
                            <span>{parseFloat(payAmount) > 0 ? 'Confirm Swap' : 'Enter Amount'}</span>
                          </button>
                        </div>

                        <p className="text-center text-[10px] text-white/30 font-mono mt-4">Transactions are processed on BNB Chain.</p>
                      </div>
                    )}

                    {/* STATE: LOADING */}
                    {purchaseState === 'loading' && (
                      <div className="h-[450px] flex flex-col items-center justify-center animate-step">
                        <div className="loader mb-6"></div>
                        <h3 className="text-xl font-medium text-white mb-2">Processing Swap...</h3>
                        <p className="text-sm text-white/50 font-mono">Confirming transaction on BNB Chain</p>
                      </div>
                    )}

                    {/* STATE: SUCCESS & REFERRAL UPSELL */}
                    {purchaseState === 'success' && (
                      <div className="flex flex-col items-center text-center animate-step pt-4">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                          <IcoCheck />
                        </div>
                        <h3 className="text-3xl font-semibold tracking-tight text-white mb-2">Allocation Secured!</h3>
                        <p className="text-white/60 text-sm mb-8">You successfully locked in <strong className="text-white font-mono">{receiveAmount} EXN</strong>.</p>

                        {/* Referral Upsell Box */}
                        <div className="w-full bg-gradient-to-b from-[#38BDF8]/10 to-[#38BDF8]/5 border border-[#38BDF8]/20 rounded-2xl p-6 text-left relative overflow-hidden shadow-[0_0_40px_rgba(56,189,248,0.1)]">
                          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#38BDF8]/20 blur-2xl rounded-full"></div>
                          
                          <h4 className="text-[#38BDF8] font-semibold text-lg mb-2 relative z-10">Want to multiply your bag? 🚀</h4>
                          <p className="text-white/70 text-sm mb-5 leading-relaxed relative z-10">
                            Invite friends to our crew and earn <strong className="text-white">10%</strong> of their purchases in EXN instantly. Our active referrers average <strong className="text-[#38BDF8] drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">$450 extra</strong> per week!
                          </p>

                          <div className="flex items-center gap-2 relative z-10">
                            <input 
                              type="text" 
                              readOnly 
                              value="https://expoin.dex/ref/0x7A...9f" 
                              className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 w-full outline-none font-mono" 
                            />
                            <button 
                              onClick={copyToClipboard}
                              className="bg-[#38BDF8] text-black px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#38BDF8]/90 transition-colors flex items-center gap-2"
                            >
                              {copied ? 'Copied!' : <><IcoCopy /> Copy</>}
                            </button>
                          </div>
                        </div>

                        <button onClick={() => goToStep(5)} className="mt-8 text-white/40 hover:text-white text-sm transition-colors font-medium">
                          Continue to Dashboard →
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                {/* RIGHT: Info Grid (Only show if not success state, keeps UI clean) */}
                {purchaseState === 'idle' && (
                  <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 lg:mt-4 animate-step">
                    
                    {/* Info Card 1 */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                      <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Token Price</span>
                      <span className="text-3xl font-semibold text-white tracking-tight">${tokenPrice} <span className="text-sm text-white/30 font-normal">/ EXN</span></span>
                    </div>

                    {/* Info Card 2 */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                      <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Listing Price</span>
                      <span className="text-3xl font-semibold text-[#38BDF8] tracking-tight">${listingPrice} <span className="text-sm text-[#38BDF8]/50 font-normal">/ EXN</span></span>
                    </div>

                    {/* Info Card 3 */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-center sm:col-span-2">
                      <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-4">Vesting Schedule</span>
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                          <span className="text-white/80 text-sm">TGE Unlock</span>
                          <span className="font-mono text-white font-medium">20%</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                          <span className="text-white/80 text-sm">Cliff Period</span>
                          <span className="font-mono text-white font-medium">3 Months</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80 text-sm">Linear Vesting</span>
                          <span className="font-mono text-white font-medium">9 Months</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Card 4 */}
                    <div className="bg-gradient-to-br from-[#38BDF8]/10 to-transparent border border-[#38BDF8]/20 rounded-2xl p-6 flex flex-col justify-center sm:col-span-2 relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#38BDF8]/10 blur-3xl rounded-full"></div>
                      <span className="text-[#38BDF8]/80 text-xs font-mono uppercase tracking-wider mb-2 relative z-10">Smart Contract Audit</span>
                      <span className="text-lg font-medium text-white relative z-10">Audited by Hacken & CertiK.</span>
                      <a href="#" className="text-sm text-[#38BDF8] hover:text-white mt-2 flex items-center gap-1 transition-colors relative z-10">
                        View Reports <IcoArrDown className="-rotate-90 w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                )}
              </div>

              {/* Gray Text Moved to Bottom */}
              {purchaseState === 'idle' && (
                <div className="w-full mt-10 animate-step px-4">
                  <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto text-center">
                    You're moving from "Stranger" to "Stakeholder." Pick your amount, confirm the swap, and let’s start the 6-month countdown to your first dividend.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Thanks / Socials */}
          {currentStep === 5 && (
            <div className="w-full flex flex-col items-center animate-step" key="step5">
              <div className="text-center w-full mx-auto animate-step">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 text-slate-400 backdrop-blur-sm">
                  <span>👋</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Stay in Touch</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-white mb-6 max-w-3xl mx-auto">
                  Alright, thanks for <br className="hidden md:block"/>
                  <span className="text-[#38BDF8] text-glow">your time.</span>
                </h1>

                {timelineElement}

                <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                  We appreciate you taking the time to learn about the Expoin ecosystem. If you want to keep following our progress and catch future updates, subscribe to our social channels.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
                  <a href="#" className="outline-cta flex-1 w-full hover:border-[#38BDF8]/50 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:text-[#38BDF8] transition-colors"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <span>Twitter / X</span>
                  </a>
                  <a href="#" className="outline-cta flex-1 w-full hover:border-[#38BDF8]/50 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#38BDF8] transition-colors"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    <span>Telegram</span>
                  </a>
                </div>
                <div className="mt-12">
                  <button onClick={() => { goToStep(1); setPurchaseState('idle'); setPayAmount(''); setReceiveAmount(''); }} className="text-sm text-white/30 hover:text-[#38BDF8] transition-colors">
                    ← Back to beginning
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* FOOTER */}
      <footer className="lg:px-12 flex flex-col z-10 overflow-hidden bg-[#030303] w-full border-white/5 border-t pt-12 pr-6 pb-12 pl-6 relative items-center mt-auto">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 relative z-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:w-3/12 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 bg-white/5 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', color: 'rgb(56, 189, 248)' }} className="iconify w-[24px] h-[24px]" aria-hidden="true" role="img" strokeWidth="2">
                  <path fill="#38bdf8" d="M4.929 4.929c-3.905 3.905-3.905 10.237 0 14.142s10.237 3.905 14.142 0s3.905-10.237 0-14.142s-10.237-3.905-14.142 0" opacity=".5"></path>
                  <path fill="#38bdf8" d="M18.521 4.418L4.418 18.521a10 10 0 0 0 1.06 1.061L19.583 5.479a10 10 0 0 0-1.06-1.06"></path>
                </svg>
              </div>
              <span className="font-sans font-medium text-2xl tracking-tight text-white">Expoin DEX</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-white font-semibold text-base tracking-wide">DeFi, finally fixed.</h4>
              <p className="text-white/40 text-sm leading-relaxed max-w-[280px] font-light">
                No more bridge drama or centralized bottlenecks. Trade 99% of the market directly from your wallet with absolute precision.
              </p>
            </div>
          </div>

          {/* Column 2: Navigation Links Grid */}
          <div className="lg:w-4/12 grid grid-cols-2 gap-8 pt-2">
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-medium text-sm tracking-wide">Expoin</h4>
              <ul className="flex flex-col gap-3.5">
                <li><a href="#" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Docs</a></li>
                <li><a href="#" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Tokenomics</a></li>
                <li><a href="#" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Roadmap</a></li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">
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
                <li><a href="#" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Vibe</a></li>
                <li><a href="#" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Ambassadors</a></li>
                <li><a href="#" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Press Kit</a></li>
                <li><a href="#" className="text-white/40 hover:text-[#38BDF8] text-sm transition-colors font-light">Legal Info</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <span className="text-white/20 text-xs font-mono tracking-wide">© 2024 Expoin DEX Technologies. All rights reserved.</span>

          <div className="flex items-center gap-8">
            <span className="text-white/20 text-xs font-mono border-l border-white/10 pl-8">Security Audited</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

