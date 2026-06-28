import React from 'react';
import {Eyebrow, PageSection, SectionShell, SpotlightCard} from '../components/pages/PagePrimitives';
import {usePageMetadata} from '../hooks/usePageMetadata';
import {createPageStructuredData} from '../lib/seo';

const rounds = [
  {name: 'Community OG', price: '$0.025', badge: 'Best Possible Price', lockup: '12 months', vesting: '18 months', tone: 'cyan'},
  {name: 'Presale Round', price: '$0.045', badge: 'Main Sale Phase', lockup: '6 months', vesting: '12 months', tone: 'blue'},
  {name: 'Public IDO', price: '$0.060', badge: 'Listing Price Target', lockup: 'None', vesting: '100% TGE', tone: 'indigo'},
  {name: 'Fixed Supply', price: '200M', badge: 'Hard capped issuance', lockup: 'Deflationary', vesting: 'Long-term model', tone: 'emerald'},
];

const allocations = [
  {name: 'Staking Rewards', value: 25, color: '#3B82F6'},
  {name: 'Presale Round', value: 15, color: '#6366F1'},
  {name: 'Team', value: 12, color: '#8B5CF6'},
  {name: 'Ecosystem Development', value: 10, color: '#0EA5E9'},
  {name: 'Community OG Sale', value: 10, color: '#06B6D4'},
  {name: 'Liquidity', value: 8, color: '#14B8A6'},
  {name: 'Strategic Partners', value: 8, color: '#EC4899'},
  {name: 'Marketing', value: 8, color: '#64748B'},
  {name: 'Reserve', value: 7, color: '#D946EF'},
  {name: 'Public IDO', value: 5, color: '#F43F5E'},
];

const vestingRows = [
  ['Staking Rewards', '25%', '-', '60 months linear', '0%'],
  ['Presale Round', '15%', '6 months', '12 months linear', '10%'],
  ['Team', '12%', '12 months cliff', '36 months linear', '0%'],
  ['Ecosystem Dev', '10%', '-', '36 months linear', '5%'],
  ['Strategic Partners', '8%', '6 months', '18 months linear', '0%'],
  ['Marketing', '8%', '-', '24 months linear', '0%'],
  ['Reserve', '7%', '12 months', 'Full unlock', '0%'],
  ['Community OG', '10%', '12 months', '18 months linear', '0%'],
  ['Liquidity', '8%', 'At launch', 'Managed treasury schedule', '100%'],
  ['Public IDO', '5%', '-', '100% at TGE', '100%'],
];

const title = 'EXN Tokenomics | Expoin';
const description = 'Explore EXN supply structure, allocation, vesting mechanics, and long-term incentive design.';
const structuredData = createPageStructuredData({
  path: '/tokenomics',
  title,
  description,
  breadcrumbs: [
    {name: 'Home', path: '/'},
    {name: 'Tokenomics', path: '/tokenomics'},
  ],
  article: {
    headline: title,
  },
});

function DonutChart() {
  const total = allocations.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const segments = allocations.map((item) => {
    const start = (offset / total) * 100;
    offset += item.value;
    const end = (offset / total) * 100;
    return `${item.color} ${start}% ${end}%`;
  });

  return (
    <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center rounded-full border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(56,189,248,0.08)]">
      <div
        className="h-[260px] w-[260px] rounded-full"
        style={{background: `conic-gradient(${segments.join(', ')})`}}
      />
      <div className="absolute flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border border-white/10 bg-[#030303]">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/40">EXN Supply</span>
        <span className="mt-2 text-4xl font-semibold text-white">200M</span>
        <span className="mt-1 text-sm text-[#38BDF8]">Fixed cap</span>
      </div>
    </div>
  );
}

export default function TokenomicsPage() {
  usePageMetadata({
    title,
    description,
    path: '/tokenomics',
    jsonLd: structuredData,
  });

  return (
      <div className="pt-32">
        <PageSection className="border-t-0 pb-16">
          <SectionShell className="text-center">
            <Eyebrow>Official Tokenomics</Eyebrow>
            <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              <span className="text-[#38BDF8] text-glow">EXN token distribution.</span>{' '}
              <span className="text-white/40">Built for scarcity, staking, and aligned unlocks.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl">
              A fixed supply of 200M EXN with long-range vesting, community-first allocation,
              and emissions aimed at sustainable liquidity instead of short-term extraction.
            </p>
          </SectionShell>
        </PageSection>

        <PageSection className="pt-10">
          <SectionShell>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {rounds.map((round) => (
                <SpotlightCard key={round.name} className="h-full p-7">
                  <div className="flex h-full flex-col">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/45">{round.name}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-[#38BDF8]">
                        {round.badge}
                      </span>
                    </div>
                    <div className="text-4xl font-semibold tracking-tight text-white">{round.price}</div>
                    <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-white/55">
                      <div className="flex items-center justify-between">
                        <span>Lockup</span>
                        <span className="text-white/85">{round.lockup}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Vesting</span>
                        <span className="text-white/85">{round.vesting}</span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </SectionShell>
        </PageSection>

        <PageSection className="bg-[#030303]/60 backdrop-blur-xl">
          <SectionShell>
            <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-mono uppercase tracking-[0.2em] text-[#38BDF8]">
                  Allocation Breakdown
                </span>
                <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Capital formation with visible unlock logic.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/50">
                The supply model prioritizes staking depth, ecosystem funding, and long cliffs
                for insiders. The result is a cleaner unlock curve and stronger market structure.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <SpotlightCard className="p-8 lg:p-10">
                <DonutChart />
                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {allocations.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{backgroundColor: item.color}} />
                        <span className="text-sm text-white/75">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-8 lg:p-10">
                <h3 className="text-2xl font-semibold tracking-tight text-white">Key distribution notes</h3>
                <div className="mt-8 grid gap-4">
                  {[
                    ['Community alignment', 'The Community OG round sits at 10% with the deepest discount and a 12-month lockup for long-term holders.'],
                    ['Emission discipline', 'Staking rewards unlock over 60 months to avoid a short, inflation-heavy front-loaded cycle.'],
                    ['Team cliffs', 'Core contributors remain locked for 12 months and vest over 36 months after the cliff.'],
                    ['Launch liquidity', 'Liquidity receives reserved inventory so the market opens with usable depth instead of artificial scarcity.'],
                  ].map(([title, description]) => (
                    <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
                      <div className="text-sm font-medium tracking-tight text-[#38BDF8]">{title}</div>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </SectionShell>
        </PageSection>

        <PageSection>
          <SectionShell>
            <div className="mb-10 max-w-3xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-mono uppercase tracking-[0.2em] text-[#38BDF8]">
                Vesting Schedule
              </span>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Unlocks designed to reduce reflexive sell pressure.
              </h2>
            </div>

            <SpotlightCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.24em] text-white/40">
                    <tr>
                      <th className="px-6 py-5">Allocation</th>
                      <th className="px-6 py-5">%</th>
                      <th className="px-6 py-5">Cliff</th>
                      <th className="px-6 py-5">Vesting</th>
                      <th className="px-6 py-5 text-right">TGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vestingRows.map((row) => (
                      <tr key={row[0]} className="border-t border-white/8 text-white/65">
                        <td className="px-6 py-5 font-medium text-white">{row[0]}</td>
                        <td className="px-6 py-5">{row[1]}</td>
                        <td className="px-6 py-5">{row[2]}</td>
                        <td className="px-6 py-5">{row[3]}</td>
                        <td className="px-6 py-5 text-right font-medium text-[#38BDF8]">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SpotlightCard>
          </SectionShell>
        </PageSection>
      </div>
  );
}
