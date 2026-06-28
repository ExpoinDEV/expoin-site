import React from 'react';
import {Eyebrow, PageSection, SectionShell, SpotlightCard} from '../components/pages/PagePrimitives';
import {usePageMetadata} from '../hooks/usePageMetadata';
import {createPageStructuredData} from '../lib/seo';

const pillars: [string, string][] = [
  ['Product', 'Wallet UX, execution reliability, analytics, and route visibility.'],
  ['Distribution', 'Mobile, desktop, ecosystem access, and partner touchpoints.'],
  ['Liquidity', 'MM tooling, intent routing, large-order execution, and treasury depth.'],
  ['Trust', 'Audits, resilience testing, monitoring, and post-launch quality gates.'],
];

type RoadmapItem = {
  title: string;
  bullets: string[];
};

type RoadmapQuarter = {
  id: string;
  title: string;
  subtitle: string;
  items: RoadmapItem[];
};

const quarters: RoadmapQuarter[] = [
  {
    id: 'q4-2025',
    title: 'Q4 2025',
    subtitle: 'Reliability, stress testing, growth, access, data, security.',
    items: [
      {title: 'Trading Protocol Upgrade', bullets: ['Automatic DEX-fee refunds for failed taker swaps', 'Improved order lifecycle visibility and retry handling', 'Cleaner swap finality states for users and integrators']},
      {title: 'Network Stress Test', bullets: ['High-load simulations across supported chains', 'Execution bottleneck analysis', 'Recovery playbooks and monitoring improvements']},
      {title: 'Marketing Campaigns', bullets: ['Point-based growth loops', 'Structured community activation', 'Performance dashboards for acquisition quality']},
      {title: 'Security Audit', bullets: ['DEX and supporting contract review', 'Remediation workflow', 'Public-facing trust narrative for launch']},
      {title: 'Wallet Integrations', bullets: ['MetaMask support', 'WalletConnect v2 support', 'Cleaner onboarding for new users']},
      {title: 'Ecosystem Data & Integrations', bullets: ['Bridge, CEX, and DEX quote discovery', 'Better rate intelligence without forcing bridge flows', 'Analytics feeds for future routing']},
    ],
  },
  {
    id: 'q1-2026',
    title: 'Q1 2026',
    subtitle: 'Mobile first, liquidity engine, web UX.',
    items: [
      {title: 'Expoin Mobile', bullets: ['iOS and Android launch scope', 'Secure wallet management', 'Swap-first mobile experience']},
      {title: 'In-House Market-Maker Bot', bullets: ['Open-source liquidity bot', 'Tighter spreads and treasury coordination', 'Health metrics for inventory and execution']},
      {title: 'Web UI/UX Redesign', bullets: ['Sharper dashboard UX', 'Route inspector and clearer errors', 'More legible execution details for new users']},
    ],
  },
  {
    id: 'q2-2026',
    title: 'Q2 2026',
    subtitle: 'Desktop pro and cross-chain execution.',
    items: [
      {title: 'Expoin Desktop', bullets: ['Mac, Windows, and Ubuntu apps', 'Advanced execution workspace', 'Persistent professional trading environment']},
      {title: 'Cross-Chain Intent Router Beta', bullets: ['Intent-based execution routing', 'Smarter path selection', 'Beta release for advanced users and partners']},
    ],
  },
  {
    id: 'q3-2026',
    title: 'Q3 2026',
    subtitle: 'Extensibility and large-order execution.',
    items: [
      {title: 'Expoin Core v2 GA', bullets: ['General availability milestone', 'Cleaner architecture for ecosystem extensions', 'Production hardening based on beta feedback']},
      {title: 'Streaming / TWAP Module', bullets: ['Large-order execution primitives', 'Reduced slippage over time', 'Institutional-grade order handling']},
    ],
  },
];

const title = 'Expoin Roadmap';
const description = 'See the product roadmap for the Expoin wallet, DEX, cross-chain infrastructure, and ecosystem rollout.';
const structuredData = createPageStructuredData({
  path: '/roadmap',
  title,
  description,
  breadcrumbs: [
    {name: 'Home', path: '/'},
    {name: 'Roadmap', path: '/roadmap'},
  ],
  article: {
    headline: title,
  },
});

export default function RoadmapPage() {
  usePageMetadata({
    title,
    description,
    path: '/roadmap',
    jsonLd: structuredData,
  });

  return (
      <div className="pt-32">
        <PageSection className="border-t-0 pb-14">
          <SectionShell>
            <div className="grid gap-12 xl:grid-cols-[0.8fr_1.2fr] xl:items-end">
              <div>
                <Eyebrow>Roadmap 2025-2026</Eyebrow>
                <h1 className="text-5xl font-semibold leading-[1.04] tracking-tight text-white md:text-6xl">
                  <span className="text-[#38BDF8] text-glow">Execution roadmap.</span>{' '}
                  <span className="text-white/40">From resilience to pro-grade cross-chain flow.</span>
                </h1>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/58">
                The roadmap prioritizes reliability first, then liquidity tooling, then professional
                execution surfaces. Each quarter compounds the previous one instead of chasing disconnected launches.
              </p>
            </div>
          </SectionShell>
        </PageSection>

        <PageSection className="pt-8">
          <SectionShell>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {pillars.map(([title, description]) => (
                <SpotlightCard key={title} className="p-6">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#38BDF8]">Pillar</span>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
                </SpotlightCard>
              ))}
            </div>
          </SectionShell>
        </PageSection>

        <PageSection className="bg-[#030303]/60 backdrop-blur-xl">
          <SectionShell>
            <div className="mb-12 flex flex-wrap gap-3">
              {quarters.map((quarter) => (
                <a
                  key={quarter.id}
                  href={`#${quarter.id}`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] text-white/65 transition-colors hover:border-[#38BDF8]/40 hover:text-[#38BDF8]"
                >
                  {quarter.title}
                </a>
              ))}
            </div>

            <div className="space-y-10">
              {quarters.map((quarter) => (
                <SpotlightCard key={quarter.id} className="p-8 lg:p-10" >
                  <div id={quarter.id} className="scroll-mt-32">
                    <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">{quarter.title}</div>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{quarter.subtitle}</h2>
                      </div>
                      <div className="text-sm text-white/45">Planned release stream</div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      {quarter.items.map((item) => (
                        <div key={item.title} className="rounded-[28px] border border-white/8 bg-white/[0.02] p-6">
                          <h3 className="text-xl font-medium tracking-tight text-white">{item.title}</h3>
                          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/55">
                            {item.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#38BDF8]" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </SectionShell>
        </PageSection>

        <PageSection>
          <SectionShell>
            <SpotlightCard className="p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Now</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Trading protocol upgrade, network stress test, points campaigns, security audit,
                    MetaMask, WalletConnect v2, and ecosystem data integrations.
                  </p>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Next</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Mobile launch, market-maker bot, redesigned web UX, desktop apps, and the first intent router beta.
                  </p>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Later</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Core v2 general availability, TWAP and streaming execution, then broader treasury and growth programs.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </SectionShell>
        </PageSection>
      </div>
  );
}
