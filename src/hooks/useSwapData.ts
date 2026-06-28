import { useState, useMemo } from 'react';
import { ASSETS, PAIR_DATA } from '../lib/constants';
import { getPairKey, getFallbackData } from '../lib/utils';

export function useSwapData() {
  const [assetA, setAssetA] = useState("BTC");
  const [assetB, setAssetB] = useState("ETH");
  const [tradeSize, setTradeSize] = useState(10000);

  const pairKey = getPairKey(assetA, assetB);
  const data = pairKey ? PAIR_DATA[pairKey as keyof typeof PAIR_DATA] : getFallbackData(tradeSize);

  const cexTotalFeeUSD = useMemo(() => {
    const tradeFee = (tradeSize * data.cexFeesPct) / 100;
    return (tradeFee + data.bridgeFeeUSD).toFixed(2);
  }, [tradeSize, data]);

  const atomicFeeUSD = data.atomicGasUSD.toFixed(2);
  const savings = ((parseFloat(cexTotalFeeUSD) - parseFloat(atomicFeeUSD))).toFixed(2);
  const savingsPct = parseFloat(cexTotalFeeUSD) > 0 ? ((parseFloat(savings) / parseFloat(cexTotalFeeUSD)) * 100).toFixed(0) : "0";

  const settlementHuman = data.settlementMin >= 1440
    ? `~${(data.settlementMin / 1440).toFixed(0)}d`
    : data.settlementMin >= 60
    ? `~${(data.settlementMin / 60).toFixed(0)}h`
    : `~${data.settlementMin}m`;

  const sameAsset = assetA === assetB;

  return {
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
  };
}
