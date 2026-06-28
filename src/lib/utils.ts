import { PAIR_DATA } from './constants';

export function getPairKey(a: string, b: string) {
  const key = `${a}/${b}`;
  if (key in PAIR_DATA) return key;
  const rev = `${b}/${a}`;
  if (rev in PAIR_DATA) return rev;
  return null;
}

export function getFallbackData(tradeSize: number) {
  return {
    cexFeesPct: 0.40,
    bridgeFeeUSD: 15,
    custodyRisk: "High",
    settlementMin: 60,
    trustScore: { cex: 50, atomic: 98 },
    atomicGasUSD: 2.0,
    volume: "N/A",
  };
}

export function trustColor(score: number) {
  if (score >= 80) return "#10b981"; // Emerald
  if (score >= 60) return "#3b82f6"; // Blue
  if (score >= 40) return "#f59e0b"; // Amber
  return "#ef4444"; // Red
}
