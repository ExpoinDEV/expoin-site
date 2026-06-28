import React from 'react';

export default function Consultation() {
  return (
    <section className="flex lg:px-12 bg-[#030303]/80 w-full z-10 border-white/5 border-t px-6 py-32 relative backdrop-blur-xl justify-center">
      <div className="w-full max-w-7xl bg-[#38BDF8] rounded-[32px] relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-end justify-between p-10 lg:p-24 group">
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light bg-cover bg-center bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c55b9091-b0ca-4842-92d7-7be239f76440_1600w.webp)]"></div>
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-white/20 blur-[120px] rounded-full pointer-events-none opacity-60 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col max-w-2xl mb-12 lg:mb-0">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-[#030303] mb-8 leading-[1.05]">
            Need a hand getting started?
          </h2>

          <a href="mailto:contact@expoin.net" className="group/card relative mt-4 w-full sm:w-80 h-36 bg-[#030303]/5 border border-[#030303]/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-[#030303]/10 hover:border-[#030303]/20 hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify text-[#030303] w-8 h-8 opacity-80">
                <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.63 1.63 0 0 1 1.149.133A9.96 9.96 0 0 0 12 22" opacity=".5"></path>
                <path fill="currentColor" d="M7.825 12.85a.825.825 0 0 0 0 1.65h6.05a.825.825 0 0 0 0-1.65zm0-3.85a.825.825 0 0 0 0 1.65h8.8a.825.825 0 0 0 0-1.65z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify text-[#030303] w-6 h-6 opacity-40 group-hover/card:opacity-100 group-hover/card:translate-x-1 group-hover/card:-translate-y-1 transition-all">
                <path fill="currentColor" fillRule="evenodd" d="M17.47 15.53a.75.75 0 0 0 1.28-.53V6a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.53 1.28z" clipRule="evenodd"></path>
                <path fill="currentColor" d="M5.47 17.47a.75.75 0 1 0 1.06 1.06l6.97-6.97l-1.06-1.06z" opacity=".5"></path>
              </svg>
            </div>
            <div>
              <span className="block text-[#030303] font-semibold text-lg tracking-tight">Say Hello to the Team</span>
              <span className="text-[#030303]/60 text-xs font-medium uppercase tracking-wider">WE’RE HERE TO HELP</span>
            </div>
          </a>
        </div>

        <div className="relative z-10 max-w-md pb-2 lg:text-right flex flex-col items-start lg:items-end gap-6">
          <p className="text-[#030303]/70 text-lg lg:text-xl font-medium leading-relaxed">
            Moving to a DEX shouldn't be a leap of faith. Our support specialists are just a click away to help you set up your wallet, navigate the chains, and move your capital with zero stress.
          </p>
          <div className="hidden lg:flex gap-1.5 opacity-30">
            <div className="w-1.5 h-1.5 rounded-full bg-[#030303]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#030303]"></div>
            <div className="w-12 h-1.5 rounded-full bg-[#030303]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
