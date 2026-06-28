import React from 'react';
import { useSwapData } from '../hooks/useSwapData';
import { trustColor } from '../lib/utils';
import { IcoArr, IcoDollar, IcoClock, IcoShieldOff, IcoTrendDown, IcoZap, IcoShieldCheck } from './ui/icons';

function TrustGauge({ score, label }: { score: number, label: string }) {
  const color = trustColor(score);
  const circumference = 2 * Math.PI * 28;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: circumference - dash, transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[10px] text-white/50 text-center uppercase tracking-wider font-mono">{label}</span>
    </div>
  );
}

function StatRow({ icon: Icon, label, cexValue, atomicValue, cexBad, savingBadge }: any) {
  return (
    <div className="grid grid-cols-3 gap-2 items-center py-3.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
        <Icon />
        {label}
      </div>
      <div className={`text-xs font-mono text-right ${cexBad ? "text-rose-400" : "text-white/70"}`}>
        {cexValue}
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs font-mono text-emerald-400">{atomicValue}</span>
        {savingBadge && (
          <span className="text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-1.5 py-0.5 rounded font-mono animate-[fadeIn_0.3s_ease-out]">
            {savingBadge}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SwapComparisonTool() {
  const {
    assetA, setAssetA,
    assetB, setAssetB,
    tradeSize, setTradeSize,
    data,
    cexTotalFeeUSD,
    atomicFeeUSD,
    savings,
    savingsPct,
    settlementHuman,
    sameAsset,
    pairKey,
    ASSETS
  } = useSwapData();

  return (
    <div className="w-full rounded-[24px] border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col shadow-2xl relative">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/5 px-6 py-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] mb-1">Live Comparison Tool</p>
          <h3 className="text-lg font-semibold text-white tracking-tight">Swap Simulator</h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Indicative Rates
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Asset toggles + trade size */}
        <div className="flex flex-wrap items-end gap-6">
          {/* Asset A */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">From</label>
            <div className="flex gap-2 flex-wrap">
              {ASSETS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAssetA(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    assetA === a
                      ? "bg-[#38BDF8] text-black border-[#38BDF8]"
                      : "bg-white/5 text-white/60 border-white/10 hover:border-[#38BDF8]/50"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Swap button */}
          <button
            onClick={() => { setAssetA(assetB); setAssetB(assetA); }}
            className="mb-0.5 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-[#38BDF8]/50 transition-colors"
          >
            <div className="text-white/50"><IcoArr /></div>
          </button>

          {/* Asset B */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">To</label>
            <div className="flex gap-2 flex-wrap">
              {ASSETS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAssetB(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    assetB === a
                      ? "bg-[#38BDF8] text-black border-[#38BDF8]"
                      : "bg-white/5 text-white/60 border-white/10 hover:border-[#38BDF8]/50"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Trade size */}
          <div className="flex flex-col gap-2 ml-auto w-full md:w-auto">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
              Trade Size: <span className="text-white">${tradeSize.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min={1000}
              max={500000}
              step={1000}
              value={tradeSize}
              onChange={(e) => setTradeSize(Number(e.target.value))}
              className="w-full md:w-48 accent-[#38BDF8]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30">
              <span>$1K</span>
              <span>$500K</span>
            </div>
          </div>
        </div>

        {sameAsset ? (
          <div className="text-center text-sm font-mono text-white/30 py-8 border border-white/5 rounded-xl bg-white/[0.02]">
            Select two different assets to compare.
          </div>
        ) : (
          <div className="space-y-6 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
            {/* Savings banner */}
            <div className="flex items-center justify-between bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-5 py-4">
              <div>
                <p className="text-[10px] text-emerald-400/80 font-mono uppercase tracking-widest mb-1">Estimated Savings with Expoin DEX</p>
                <p className="text-2xl font-bold text-emerald-400">${parseFloat(savings) > 0 ? savings : "0.00"}</p>
                <p className="text-[10px] font-mono text-emerald-400/60 mt-1">on a ${tradeSize.toLocaleString()} swap of {assetA} → {assetB}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-3xl font-black text-emerald-400">-{savingsPct}%</span>
                <span className="text-[10px] font-mono text-emerald-400/60">cheaper fees</span>
              </div>
            </div>

            {/* Main comparison grid */}
            <div className="grid md:grid-cols-3 gap-5">
              {/* Stats column */}
              <div className="md:col-span-2 border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
                <div className="grid grid-cols-3 bg-white/5 border-b border-white/5 px-5 py-2.5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Metric</span>
                  <span className="text-[10px] font-mono text-rose-400/80 uppercase tracking-wider text-right">CEX / Bridge</span>
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider text-right">Expoin DEX</span>
                </div>
                <div className="px-5 py-1">
                  <StatRow
                    icon={IcoDollar}
                    label="Total Fees"
                    cexValue={`$${cexTotalFeeUSD}`}
                    atomicValue={`$${atomicFeeUSD}`}
                    cexBad
                    savingBadge={`-${savingsPct}%`}
                  />
                  <StatRow
                    icon={IcoClock}
                    label="Settlement"
                    cexValue={settlementHuman}
                    atomicValue="< 60s"
                    cexBad={data.settlementMin > 5}
                  />
                  <StatRow
                    icon={IcoShieldOff}
                    label="Custody Risk"
                    cexValue={data.custodyRisk}
                    atomicValue="None"
                    cexBad
                  />
                  <StatRow
                    icon={IcoTrendDown}
                    label="Bridge Risk"
                    cexValue="Exploit risk"
                    atomicValue="No bridge"
                    cexBad
                  />
                  <StatRow
                    icon={IcoZap}
                    label="Gas (Atomic)"
                    cexValue="+ bridge fee"
                    atomicValue={`$${atomicFeeUSD}`}
                  />
                </div>
              </div>

              {/* Trust score column */}
              <div className="border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center gap-5 bg-white/[0.01]">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Trust Score</p>
                <div className="flex gap-5">
                  <TrustGauge score={data.trustScore.cex} label="CEX / Bridge" />
                  <TrustGauge score={data.trustScore.atomic} label="Expoin DEX" />
                </div>
                <div className="w-full bg-white/5 rounded-lg p-3 text-center border border-white/5">
                  <p className="text-[10px] text-white/50 leading-relaxed font-light">
                    Trust score is based on custody model, counterparty exposure, settlement finality, and exploit history.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-emerald-400"><IcoShieldCheck /></div>
                  <span className="text-xs font-mono text-emerald-400">+{data.trustScore.atomic - data.trustScore.cex} pts safer</span>
                </div>
              </div>
            </div>

            {/* Pair info footer */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-white/30 pt-2 border-t border-white/5">
              <span>Pair: <strong className="text-white/60">{assetA}/{assetB}</strong></span>
              {pairKey && <span>24h Volume: <strong className="text-white/60">{data.volume}</strong></span>}
              <span>CEX fee rate: <strong className="text-white/60">{data.cexFeesPct}%</strong></span>
              <span>Bridge fee: <strong className="text-white/60">${data.bridgeFeeUSD}</strong> est.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
