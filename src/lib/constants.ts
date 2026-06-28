export const ASSETS = ["BTC", "ETH", "SOL", "USDC", "MATIC", "AVAX"];

export const PAIR_DATA = {
  "BTC/ETH": {
    cexFeesPct: 0.50,
    bridgeFeeUSD: 24,
    custodyRisk: "High",
    settlementMin: 1440,
    trustScore: { cex: 41, atomic: 98 },
    atomicGasUSD: 3.2,
    volume: "$2.4B",
  },
  "ETH/USDC": {
    cexFeesPct: 0.30,
    bridgeFeeUSD: 8,
    custodyRisk: "Medium",
    settlementMin: 1,
    trustScore: { cex: 55, atomic: 98 },
    atomicGasUSD: 1.8,
    volume: "$8.1B",
  },
  "BTC/USDC": {
    cexFeesPct: 0.50,
    bridgeFeeUSD: 22,
    custodyRisk: "High",
    settlementMin: 1440,
    trustScore: { cex: 40, atomic: 98 },
    atomicGasUSD: 3.0,
    volume: "$5.6B",
  },
  "SOL/ETH": {
    cexFeesPct: 0.35,
    bridgeFeeUSD: 12,
    custodyRisk: "High",
    settlementMin: 720,
    trustScore: { cex: 48, atomic: 98 },
    atomicGasUSD: 0.9,
    volume: "$1.2B",
  },
  "MATIC/ETH": {
    cexFeesPct: 0.30,
    bridgeFeeUSD: 7,
    custodyRisk: "Medium",
    settlementMin: 60,
    trustScore: { cex: 56, atomic: 98 },
    atomicGasUSD: 0.6,
    volume: "$420M",
  },
  "AVAX/USDC": {
    cexFeesPct: 0.30,
    bridgeFeeUSD: 10,
    custodyRisk: "Medium",
    settlementMin: 30,
    trustScore: { cex: 54, atomic: 98 },
    atomicGasUSD: 1.1,
    volume: "$780M",
  },
};

export const DASHBOARD_ASSETS = [
  { name: "1Inch", ticker: "1INCH", color: "#EF4444", char: "1", type: "mix1" },
  { name: "AAVE", ticker: "AAVE", color: "#06B6D4", char: "A", type: "mix2" },
  { name: "ArtByte", ticker: "ABY", color: "#F87171", char: "A", type: "flat" },
  { name: "Action Coin", ticker: "ACTN", color: "#F97316", char: "A", type: "flat" },
  { name: "Cardano", ticker: "ADA", color: "#3B82F6", char: "A", type: "mix1" },
  { name: "AdEx", ticker: "ADX", color: "#3B82F6", char: "A", type: "mix2" },
];

export const atomicSteps = [
  {
    a: { title: 'Order creation', desc: 'The maker creates an order.' },
    b: { title: 'The taker confirms the order', desc: 'The taker accepts the order and pays DEX fee.' }
  },
  {
    a: { title: 'The maker sends the digital asset', desc: 'The maker sends a payment blocked by a secret hash and timestamp.' },
    b: { title: 'The taker sends the digital asset', desc: 'The taker sends his payment. If the maker has not taken the payment within the blocking time, the assets are returned to the taker.' }
  },
  {
    a: { title: 'Obtaining by the maker', desc: 'The maker receives the taker’s payment to his wallet. This transaction is publicly visible on the blockchain.' },
    b: { title: 'Obtaining by the taker', desc: 'The taker sees that his payment is accepted, so he extracts the secret hash from the withdrawal transaction and receives the maker’s payment to his wallet.' }
  }
];

export const unicornHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <style>
      body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: transparent; }
    </style>
  </head>
  <body>
    <div data-us-project="FixNvEwvWwbu3QX9qC3F" style="width: 100vw; height: 100vh; position: absolute; left: 0; top: 0;"></div>
    <script>
      !function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();
    </script>
  </body>
  </html>
`;
