import { motion } from "motion/react";
import { Bot, Cpu, TrendingUp, Globe, Repeat, Briefcase } from "lucide-react";

const cases = [
  {
    icon: Bot,
    title: "Autonomous AI Traders",
    description:
      "AI trading agents execute cross-chain arbitrage strategies in milliseconds — swapping assets atomically across 24 chains without any human or custodial intervention.",
    tag: "Trading",
  },
  {
    icon: Cpu,
    title: "Agent-to-Agent Payments",
    description:
      "AI agents pay each other for compute, data, or services natively on-chain. No payment processor, no stablecoin intermediary — direct atomic settlement.",
    tag: "A2A Economy",
  },
  {
    icon: TrendingUp,
    title: "Algorithmic Market Making",
    description:
      "Algo agents provide liquidity across chains by posting two-sided atomic swap offers, earning spreads without ever relinquishing custody of their assets.",
    tag: "Liquidity",
  },
  {
    icon: Globe,
    title: "Cross-Chain DeFi Routing",
    description:
      "Intelligent routers find the optimal path across various Layer 1s and Layer 2s, executing multiple atomic swaps in a single intent to achieve the best price.",
    tag: "Routing",
  },
  {
    icon: Repeat,
    title: "Continuous Rebalancing",
    description:
      "Agents automatically rebalance portfolio allocations across different ecosystems, responding to market volatility through trustless atomic execution.",
    tag: "Portfolio",
  },
  {
    icon: Briefcase,
    title: "Institutional OTC Desks",
    description:
      "Large-volume OTC trades executed atomically via AI agents. Counterparties match size and price off-book, and settle directly on-chain without slippage.",
    tag: "OTC Options",
  },
];

export default function AgentUseCases() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#050505] border-t border-white/5">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-sm font-medium mb-6 uppercase tracking-wider"
          >
            <Bot className="w-4 h-4" /> Agentic Future
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00E5FF]/50">Machine Economy</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            AuraCore provides the definitive settlement layer for AI agents. Purely atomic, fully scalable, and inherently cross-chain.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map(({ icon: Icon, title, description, tag }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#00E5FF]/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/20 group-hover:border-[#00E5FF]/40 transition-colors">
                  <Icon className="w-6 h-6 text-[#00E5FF]" />
                </div>
                <span className="text-xs font-mono text-slate-500 px-2 py-1 bg-white/5 rounded-md border border-white/10">
                  {tag}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00E5FF] transition-colors">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
