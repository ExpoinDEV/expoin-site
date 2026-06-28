import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, Network, Code2, Lock, ChevronRight } from "lucide-react";

const LAYERS = [
  {
    id: "api",
    label: "Agent API Layer",
    sublabel: "REST · WebSocket · gRPC",
    icon: Code2,
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    y: 0,
    detail: {
      title: "Agent API Layer",
      description: "The entry point for all participants — human traders, bots, and AI agents. Exposes a unified interface across REST, WebSocket, and gRPC transports. Handles authentication via cryptographic key signatures, rate limiting, and intent normalization before handing off to the Order Book.",
      specs: [
        { label: "Latency", value: "< 2ms p99" },
        { label: "Auth", value: "ECDSA / Ed25519" },
        { label: "Protocols", value: "REST, WS, gRPC" },
        { label: "SDKs", value: "Python, JS, Rust" },
      ],
      code: `// Submit Swap Intent
client.ws.send({
  op: "INTENT",
  asset_give: "ETH",
  asset_take: "BTC",
  amount: "1.5",
  spread_bps: 12
});`
    }
  },
  {
    id: "market",
    label: "Matching Engine",
    sublabel: "Global Order Book · Intent Solver",
    icon: Network,
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ede9fe",
    y: 1,
    detail: {
      title: "Matching Engine",
      description: "A highly optimized, off-chain matching engine that pairs complementary intents. It does not execute swaps, but rather finds exact overlaps in liquidity. Utilizes advanced graph-search algorithms to identify multi-hop arbitrage paths and cross-chain routing opportunities.",
      specs: [
        { label: "Throughput", value: "100k+ TPS" },
        { label: "Matching", value: "Strict Price-Time" },
        { label: "Routing", value: "Dijkstra Multi-Hop" },
        { label: "State", value: "In-Memory (Redis)" },
      ],
      code: `// Match Found
event OnMatch(
  MakerId   bytes32,
  TakerId   bytes32,
  GiveHash  bytes32,
  TakeHash  bytes32,
  Timestamp uint64
)`
    }
  },
  {
    id: "htlc",
    label: "HTLC Settlement",
    sublabel: "Hash Time-Locked Contracts",
    icon: Lock,
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fce7f3",
    y: 2,
    detail: {
      title: "HTLC Settlement",
      description: "The core cryptographic primitive ensuring atomicity. Once a match is found, both parties deploy HTLCs on their respective chains. Funds are locked with a shared hash. If the secret is revealed, both parties get paid. If time expires, both parties are refunded. Zero counterparty risk.",
      specs: [
        { label: "Mechanism", value: "SHA-256 Hashlock" },
        { label: "Time-Lock", value: "Block Height / Timestamps" },
        { label: "Atomicity", value: "100% Guaranteed" },
        { label: "Fallback", value: "Auto-Refund" },
      ],
      code: `// HTLC Spend Condition
require(
  sha256(secret) == hashlock,
  "Invalid secret"
);
transfer(recipient, amount);`
    }
  },
  {
    id: "chain",
    label: "Base Layer",
    sublabel: "Ethereum · Bitcoin · Solana · L2s",
    icon: Layers,
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#d1fae5",
    y: 3,
    detail: {
      title: "Base Layer Execution",
      description: "The final layer where actual state transitions occur. Transactions are broadcasted to the respective blockchains. Atomic DEX is entirely agnostic to the underlying consensus mechanism, executing cleanly across EVM, UTXO, and SVM architectures.",
      specs: [
        { label: "Supported", value: "24+ Chains" },
        { label: "Custody", value: "Self-Custodial (Your Keys)" },
        { label: "Bridges", value: "None Required" },
        { label: "Liquidity", value: "Native Assets Only" },
      ],
      code: `// Transaction Broadcast
node.rpc.sendTransaction(
  signedPayload,
  chain_id="solana-mainnet"
);`
    }
  }
];

export default function ProtocolArchitecture() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"stacked" | "flat">("stacked");

  const activeData = LAYERS.find(l => l.id === activeLayer);

  return (
    <section className="py-32 px-6 bg-[#111111] overflow-hidden relative border-t border-white/5">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 md:text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-6">
             <span className="w-2 h-2 bg-[#00E5FF] rounded-full" />
             <p className="text-[#00E5FF] text-[10px] font-bold uppercase tracking-[0.2em]">Architecture</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-white leading-[1] tracking-tight uppercase mb-6">
            The Protocol Stack
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base font-mono uppercase tracking-wide">
            Explore the technology enabling trustless cross-chain swaps.
          </p>
        </div>

        <div className="flex justify-end mb-8">
           <div className="bg-[#050507] p-1 border border-white/10 rounded-sm inline-flex">
              <button 
                onClick={() => setViewMode("stacked")}
                className={`p-2 rounded-sm transition-colors ${viewMode === 'stacked' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-white/40 hover:text-white'}`}
              >
                 <Layers className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("flat")}
                className={`p-2 rounded-sm transition-colors ${viewMode === 'flat' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'text-white/40 hover:text-white'}`}
              >
                 <Network className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="w-full lg:w-1/2 relative min-h-[500px] flex items-center justify-center">
             
             <div className={`relative w-full max-w-md transition-all duration-700 ${viewMode === 'stacked' ? 'h-[450px]' : 'h-auto flex flex-col gap-4'}`}>
               {LAYERS.map((layer) => {
                 const Icon = layer.icon;
                 const isActive = activeLayer === layer.id;
                 const isStacked = viewMode === "stacked";
                 
                 return (
                   <motion.div
                     key={layer.id}
                     layout
                     onClick={() => setActiveLayer(isActive ? null : layer.id)}
                     animate={{ 
                       y: isStacked ? layer.y * 80 : 0,
                       scale: isStacked ? 1 - (layer.y * 0.05) : 1,
                       zIndex: isStacked ? 10 - layer.y : 1,
                       opacity: (activeLayer && !isActive) ? 0.3 : 1
                     }}
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     className={`cursor-pointer outline-none w-full border border-white/10 bg-[#050507] rounded-sm p-6 flex flex-col group hover:border-[#00E5FF]/40 transition-colors shadow-2xl ${isStacked ? 'absolute top-0' : 'relative'}`}
                   >
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-sm bg-white/5 flex items-center justify-center group-hover:bg-[#00E5FF]/10 transition-colors">
                         <Icon className="w-6 h-6 text-white group-hover:text-[#00E5FF] transition-colors" />
                       </div>
                       <div className="flex-1">
                         <h3 className="text-lg font-bold text-white uppercase tracking-wide group-hover:text-[#00E5FF] transition-colors">{layer.label}</h3>
                         <p className="text-xs text-white/50 font-mono uppercase">{layer.sublabel}</p>
                       </div>
                       <ChevronRight className={`w-5 h-5 text-white/30 transition-transform ${isActive ? 'rotate-90 text-[#00E5FF]' : ''}`} />
                     </div>
                   </motion.div>
                 );
               })}
             </div>
          </div>

          <div className="w-full lg:w-1/2 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeData ? (
                <motion.div
                  key={activeData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#050507] border border-white/10 rounded-sm p-8 lg:p-12 h-full flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-sm bg-white/5 flex items-center justify-center">
                      <activeData.icon className="w-8 h-8 text-[#00E5FF]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-wide">{activeData.detail.title}</h3>
                      <p className="text-xs text-white/50 font-mono uppercase">Architecture Detail</p>
                    </div>
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed font-mono uppercase mb-10">
                    {activeData.detail.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                     {activeData.detail.specs.map((spec, i) => (
                       <div key={i} className="bg-white/5 p-4 rounded-sm border border-white/5">
                         <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">{spec.label}</p>
                         <p className="text-sm font-bold text-white">{spec.value}</p>
                       </div>
                     ))}
                  </div>

                  <div className="mt-auto bg-[#111111] p-4 rounded-sm border border-white/5 overflow-x-auto">
                    <div className="flex items-center gap-2 mb-3 px-2">
                       <span className="w-2 h-2 rounded-full bg-red-400/50" />
                       <span className="w-2 h-2 rounded-full bg-amber-400/50" />
                       <span className="w-2 h-2 rounded-full bg-green-400/50" />
                    </div>
                    <pre className="text-xs font-mono text-[#00E5FF] leading-relaxed">
                      {activeData.detail.code}
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-sm p-12 text-center bg-white/[0.01]"
                >
                  <Layers className="w-16 h-16 text-white/10 mb-6" />
                  <p className="text-white/40 font-mono uppercase tracking-wide">Select a layer from the stack<br/>to view details.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
