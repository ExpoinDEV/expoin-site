import {useEffect, useMemo, useState} from 'react';
import {ArrowRight, CheckCircle2, ShieldCheck, WalletCards} from 'lucide-react';
import {Link, useParams} from 'react-router-dom';
import PromoLiveSaleWidget from '../../components/sale/PromoLiveSaleWidget';
import {Eyebrow, PageSection, SectionShell, SpotlightCard} from '../../components/pages/PagePrimitives';
import {usePageMetadata} from '../../hooks/usePageMetadata';
import {type BonusRule, getPublicBonusSettings} from '../../lib/bonusApi';
import {createPageStructuredData} from '../../lib/seo';
import {pushToDataLayer} from '../../utils/analytics';
import './communityCampaign.css';

const slugAliases: Record<string, string> = {
  thena: 'the',
  chaingpt: 'cgpt',
  gtprotocol: 'gtai',
  kiloex: 'kilo',
};

const previewRules: BonusRule[] = [
  {id: 'genius', enabled: true, assetType: 'erc20', watchedTokenAddress: '0x1F12B85aAC097E43Aa1555b2881E98a51090e9A6', watchedTokenSymbol: 'GENIUS', tokenName: 'Genius', minimumBalance: '10', bonusMode: 'percent', bonusValue: '15'},
  {id: 'tag', enabled: true, assetType: 'erc20', watchedTokenAddress: '0x208bF3E7dA9639f1Eaefa2DE78c23396B0682025', watchedTokenSymbol: 'TAG', tokenName: 'Tagger', minimumBalance: '10', bonusMode: 'percent', bonusValue: '10'},
  {id: 'pieverse', enabled: true, assetType: 'erc20', watchedTokenAddress: '0x0E63B9C287E32A05E6b9AB8ee8dF88A2760225A9', watchedTokenSymbol: 'PIEVERSE', tokenName: 'Pieverse Token', minimumBalance: '10', bonusMode: 'percent', bonusValue: '20'},
  {id: 'cgpt', enabled: true, assetType: 'erc20', watchedTokenAddress: '0x9840652DC04fb9db2C43853633f0F62BE6f00f98', watchedTokenSymbol: 'CGPT', tokenName: 'ChainGPT', minimumBalance: '10', bonusMode: 'percent', bonusValue: '30'},
  {id: 'aitech', enabled: true, assetType: 'erc20', watchedTokenAddress: '0x2D060Ef4d6BF7f9e5edDe373Ab735513c0e4F944', watchedTokenSymbol: 'AITECH', tokenName: 'AITECH', minimumBalance: '10', bonusMode: 'percent', bonusValue: '15'},
  {id: 'gtai', enabled: true, assetType: 'erc20', watchedTokenAddress: '0x003d87d02A2A01E9E8a20f507C83E15DD83A33d1', watchedTokenSymbol: 'GTAI', tokenName: 'GT Protocol', minimumBalance: '10', bonusMode: 'percent', bonusValue: '15'},
  {id: 'the', enabled: true, assetType: 'erc20', watchedTokenAddress: '0xF4C8E32EaDEC4BFe97E0F595AdD0f4450a863a11', watchedTokenSymbol: 'THE', tokenName: 'THENA', minimumBalance: '10', bonusMode: 'percent', bonusValue: '30'},
  {id: 'apx', enabled: true, assetType: 'erc20', watchedTokenAddress: '0x78F5d389F5CDCcFc41594aBaB4B0Ed02F31398b3', watchedTokenSymbol: 'APX', tokenName: 'ApolloX Token', minimumBalance: '10', bonusMode: 'percent', bonusValue: '15'},
  {id: 'kilo', enabled: true, assetType: 'erc20', watchedTokenAddress: '0x503Fa24B7972677F00C4618e5FBe237780C1df53', watchedTokenSymbol: 'KILO', tokenName: 'KiloEx Token', minimumBalance: '10', bonusMode: 'percent', bonusValue: '20'},
];

const fallbackRule: BonusRule = {
  id: 'community',
  enabled: true,
  assetType: 'erc20',
  watchedTokenAddress: '',
  watchedTokenSymbol: 'TOKEN',
  tokenName: 'Community',
  minimumBalance: '10',
  bonusMode: 'percent',
  bonusValue: '20',
};

const localLogos = new Set(['tag', 'cgpt', 'aitech', 'gtai', 'apx', 'kilo']);

function normalizeSlug(value = 'community') {
  const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return slugAliases[clean] || clean;
}

function formatBonus(rule: BonusRule) {
  return rule.bonusMode === 'percent' ? `${rule.bonusValue}%` : `${rule.bonusValue} EXN`;
}

function TokenBadge({rule}: {rule: BonusRule}) {
  const logoUrl = localLogos.has(rule.id) ? `/partners/${rule.id}.png` : '';

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-sm font-semibold text-[#38BDF8]">
        {logoUrl ? <img src={logoUrl} alt="" className="h-8 w-8 object-contain" /> : rule.watchedTokenSymbol.slice(0, 4)}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{rule.tokenName || rule.watchedTokenSymbol}</div>
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-white/35">{rule.watchedTokenSymbol}</div>
      </div>
    </div>
  );
}

function scrollToCheckout(source: string, rule: BonusRule) {
  pushToDataLayer('community_sale_cta', {
    action: 'scroll_to_checkout',
    source,
    community_slug: rule.id,
    token_symbol: rule.watchedTokenSymbol,
  });
  document.getElementById('campaign-checkout')?.scrollIntoView({behavior: 'smooth', block: 'start'});
}

export default function CommunityCampaignPage() {
  const {slug: rawSlug = 'community'} = useParams();
  const slug = normalizeSlug(rawSlug);
  const [rules, setRules] = useState<BonusRule[]>(previewRules);

  const activeRules = useMemo(() => rules.filter((rule) => rule.enabled), [rules]);
  const rule = useMemo(() => {
    return activeRules.find((item) => item.id === slug || item.watchedTokenSymbol.toLowerCase() === slug) || activeRules[0] || fallbackRule;
  }, [activeRules, slug]);

  const projectName = rule.tokenName || rule.watchedTokenSymbol;
  const bonusLabel = formatBonus(rule);
  const canonicalPath = `/sale/community/${rule.id}`;
  const analyticsSource = `community_sale_${rule.id}`;
  const title = `${rule.watchedTokenSymbol} Holder Bonus | EXN Community OG Sale`;
  const description = `${projectName} holders can verify wallet eligibility and buy EXN with a ${bonusLabel} community bonus.`;

  usePageMetadata({
    title,
    description,
    path: canonicalPath,
    jsonLd: createPageStructuredData({
      path: canonicalPath,
      title,
      description,
      breadcrumbs: [
        {name: 'Home', path: '/'},
        {name: 'Buy EXN', path: '/sale'},
        {name: `${rule.watchedTokenSymbol} Holder Bonus`, path: canonicalPath},
      ],
    }),
  });

  useEffect(() => {
    getPublicBonusSettings()
      .then((settings) => {
        const enabledRules = (settings.bonusRules || []).filter((item) => item.enabled);
        if (enabledRules.length) setRules(enabledRules);
      })
      .catch((error) => console.error('Failed to load community campaign rules', error));
  }, []);

  useEffect(() => {
    pushToDataLayer('funnel_step_view', {
      step_name: 'community_sale_landing',
      community_slug: rule.id,
      token_symbol: rule.watchedTokenSymbol,
      source: analyticsSource,
    });
  }, [analyticsSource, rule.id, rule.watchedTokenSymbol]);

  return (
    <div className="pt-20 sm:pt-24">
      <PageSection className="border-t-0 overflow-hidden pb-10 pt-8 sm:pt-10">
        <SectionShell>
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-center lg:text-left">
              <Eyebrow>{projectName} holder campaign</Eyebrow>
              <h1 className="mt-5 text-5xl font-semibold leading-[1.04] tracking-tight text-white md:text-6xl lg:text-7xl">
                Buy EXN with a <span className="text-[#38BDF8] text-glow">{bonusLabel} holder bonus.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl lg:mx-0">
                If your wallet holds at least {rule.minimumBalance} {rule.watchedTokenSymbol}, the bonus system can unlock extra EXN during the Community OG sale.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <button type="button" onClick={() => scrollToCheckout('hero', rule)} className="shiny-cta">
                  <span>Check {rule.watchedTokenSymbol} Bonus</span>
                </button>
                <Link
                  to="/sale"
                  className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-center text-sm font-medium text-white/75 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Main sale page
                </Link>
              </div>
            </div>

            <SpotlightCard className="p-7 lg:p-8">
              <div className="flex flex-col gap-6">
                <TokenBadge rule={rule} />
                <div className="rounded-[26px] border border-[#38BDF8]/20 bg-[#38BDF8]/10 p-5">
                  <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Campaign bonus</div>
                  <div className="mt-3 text-5xl font-semibold tracking-tight text-white">{bonusLabel}</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    Eligibility is checked by the same live bonus system used on the main sale page.
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-white/60">
                  <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#38BDF8]" /> No token deposit required.</div>
                  <div className="flex items-center gap-3"><WalletCards className="h-5 w-5 text-[#38BDF8]" /> Connect the wallet that holds {rule.watchedTokenSymbol}.</div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-[#38BDF8]" /> Bonus is calculated before purchase.</div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Token checked', rule.watchedTokenSymbol],
              ['Minimum holding', `${rule.minimumBalance} ${rule.watchedTokenSymbol}`],
              ['Entry price', '$0.025'],
              ['Network', 'BNB Chain'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-white/8 bg-white/[0.03] px-6 py-5">
                <div className="text-xs uppercase tracking-[0.18em] text-white/35">{label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</div>
              </div>
            ))}
          </div>
        </SectionShell>
      </PageSection>

      <PageSection className="bg-[#030303]/60 backdrop-blur-xl">
        <SectionShell>
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">How this campaign works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              The page changes by URL slug, but the checkout, sale contract, and bonus rules stay shared with the live sale system.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['1', `Hold ${rule.watchedTokenSymbol}`, `Keep at least ${rule.minimumBalance} ${rule.watchedTokenSymbol} in your wallet.`],
              ['2', 'Connect wallet', 'We check eligibility through the bonus system without taking custody of your tokens.'],
              ['3', 'Buy EXN', `If eligible, your ${bonusLabel} bonus is shown in the checkout flow.`],
            ].map(([number, heading, copy]) => (
              <SpotlightCard key={heading} className="h-full p-7">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/10 text-xl font-semibold text-[#38BDF8]">
                  {number}
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-white">{heading}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/58">{copy}</p>
              </SpotlightCard>
            ))}
          </div>
        </SectionShell>
      </PageSection>

      <PageSection id="campaign-checkout">
        <SectionShell>
          <SpotlightCard className="p-5 sm:p-8 lg:p-10">
            <div className="mb-8 text-center">
              <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#38BDF8]">Live Community OG Checkout</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Same sale block. Campaign-aware bonus.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                This checkout uses live sale data and tracks analytics separately as <span className="font-mono text-white/75">{analyticsSource}</span>.
              </p>
            </div>
            <PromoLiveSaleWidget analyticsSource={analyticsSource} enableCommunityBonus communityRuleId={rule.id === 'community' ? undefined : rule.id} />
          </SpotlightCard>
        </SectionShell>
      </PageSection>

      <PageSection>
        <SectionShell>
          <SpotlightCard className="p-8 text-center lg:p-10">
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">Ready to test the funnel?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              Start with the active campaign URL, connect a wallet that holds {rule.watchedTokenSymbol}, and confirm the bonus status in the checkout.
            </p>
            <button type="button" onClick={() => scrollToCheckout('final_cta', rule)} className="shiny-cta mt-8">
              <span>Open Checkout <ArrowRight className="h-4 w-4" /></span>
            </button>
          </SpotlightCard>
        </SectionShell>
      </PageSection>
    </div>
  );
}
