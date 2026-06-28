import {useEffect, useState} from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Code2,
  Globe2,
  Layers3,
  LockKeyhole,
  Menu,
  Network,
  Repeat2,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {usePageMetadata} from '../../hooks/usePageMetadata';
import {createPageStructuredData} from '../../lib/seo';
import './promoLanding.css';

const architecture = [
  {
    id: 'intent',
    icon: Code2,
    eyebrow: '01 / Agent API',
    title: 'Agents express intent',
    copy: 'Trading agents submit what they want to exchange, their limits, and settlement preferences through one predictable interface.',
    stat: '< 2 ms',
    statLabel: 'API latency',
  },
  {
    id: 'match',
    icon: Network,
    eyebrow: '02 / Matching',
    title: 'Liquidity finds its pair',
    copy: 'The matching layer finds complementary intents across connected networks without taking custody of user funds.',
    stat: '100k+',
    statLabel: 'intents / sec',
  },
  {
    id: 'lock',
    icon: LockKeyhole,
    eyebrow: '03 / HTLC',
    title: 'Both sides lock',
    copy: 'Hash Time-Locked Contracts commit both parties to the trade. A swap completes on both chains or safely refunds on both chains.',
    stat: '0',
    statLabel: 'custodians',
  },
  {
    id: 'settle',
    icon: Layers3,
    eyebrow: '04 / Settlement',
    title: 'Native assets settle',
    copy: 'Each asset arrives natively in the destination wallet. No wrapped representation and no bridge balance sheet are required.',
    stat: '24+',
    statLabel: 'target chains',
  },
];

const useCases = [
  {
    icon: Bot,
    title: 'Autonomous trading',
    copy: 'Agents can execute cross-chain strategies continuously while keeping assets inside user-controlled wallets.',
  },
  {
    icon: Repeat2,
    title: 'Portfolio rebalancing',
    copy: 'Rules-based agents rebalance allocations across ecosystems without sending capital to a centralized venue.',
  },
  {
    icon: Globe2,
    title: 'Cross-chain routing',
    copy: 'Solvers evaluate multiple routes and settle the selected exchange directly between counterparties.',
  },
];

const promoStructuredData = createPageStructuredData({
  path: '/promo',
  title: 'Expoin Atomic Exchange for AI Agents',
  description: 'A non-custodial settlement layer for autonomous agents to exchange native digital assets across chains.',
  breadcrumbs: [
    {name: 'Home', path: '/'},
    {name: 'Atomic Exchange', path: '/promo'},
  ],
});

function BrandMark() {
  return (
    <a className="promo-brand" href="/" aria-label="Expoin home">
      <img src="/tokenicon.svg" alt="" />
      <span>expoin</span>
    </a>
  );
}

function MarketTerminal() {
  const [activePair, setActivePair] = useState('ETH / BTC');
  const pairs = ['ETH / BTC', 'SOL / ETH', 'BNB / USDT'];

  return (
    <div className="promo-terminal" aria-label="Atomic settlement preview">
      <div className="promo-terminal__top">
        <div>
          <span className="promo-kicker promo-kicker--dark">Live settlement</span>
          <h2>Atomic exchange, visible end to end.</h2>
        </div>
        <span className="promo-live"><i /> Network online</span>
      </div>

      <div className="promo-terminal__grid">
        <div className="promo-terminal__main">
          <div className="promo-pair-tabs" aria-label="Select trading pair">
            {pairs.map((pair) => (
              <button key={pair} className={activePair === pair ? 'is-active' : ''} onClick={() => setActivePair(pair)}>
                {pair}
              </button>
            ))}
          </div>
          <div className="promo-price-row">
            <div>
              <span>Indicative rate</span>
              <strong>{activePair === 'ETH / BTC' ? '0.05384' : activePair === 'SOL / ETH' ? '0.04112' : '644.21'}</strong>
            </div>
            <span className="promo-up">+1.84%</span>
          </div>
          <div className="promo-chart" aria-hidden="true">
            <svg viewBox="0 0 760 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="promo-chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0052ff" stopOpacity=".38" />
                  <stop offset="1" stopColor="#0052ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="promo-chart__grid" d="M0 40H760M0 100H760M0 160H760" />
              <path className="promo-chart__area" d="M0 181 C80 171 84 122 151 137 S254 169 303 112 S389 80 441 97 S522 54 579 73 S676 31 760 24 V220 H0 Z" />
              <path className="promo-chart__line" d="M0 181 C80 171 84 122 151 137 S254 169 303 112 S389 80 441 97 S522 54 579 73 S676 31 760 24" />
            </svg>
          </div>
          <div className="promo-terminal__labels"><span>12:00</span><span>12:15</span><span>12:30</span><span>12:45</span></div>
        </div>

        <aside className="promo-settlement-card">
          <div className="promo-settlement-card__head">
            <span>Settlement #8F2A</span>
            <span className="promo-status"><Check size={13} /> Complete</span>
          </div>
          <div className="promo-asset-flow">
            <div><i className="promo-coin promo-coin--eth">Ξ</i><span>Agent 7F</span><strong>2.00 ETH</strong></div>
            <ArrowRight size={18} />
            <div><i className="promo-coin promo-coin--btc">₿</i><span>Agent 3A</span><strong>0.1077 BTC</strong></div>
          </div>
          <dl className="promo-facts">
            <div><dt>Execution</dt><dd>38 ms</dd></div>
            <div><dt>Counterparty risk</dt><dd>None</dd></div>
            <div><dt>Custody</dt><dd>Self-custody</dd></div>
            <div><dt>Finality</dt><dd>On-chain</dd></div>
          </dl>
          <div className="promo-proof"><ShieldCheck size={18} /><span><strong>HTLC verified</strong>Both legs completed atomically.</span></div>
        </aside>
      </div>
    </div>
  );
}

export default function PromoLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(architecture[0].id);
  const active = architecture.find((layer) => layer.id === activeLayer) ?? architecture[0];

  usePageMetadata({
    title: 'Expoin Atomic Exchange for AI Agents',
    description: 'A non-custodial settlement layer for autonomous agents to exchange native digital assets across chains.',
    path: '/promo',
    jsonLd: promoStructuredData,
  });

  useEffect(() => {
    document.body.classList.add('promo-page-active');
    return () => document.body.classList.remove('promo-page-active');
  }, []);

  return (
    <main className="promo-page">
      <header className="promo-nav">
        <div className="promo-shell promo-nav__inner">
          <BrandMark />
          <nav className={menuOpen ? 'is-open' : ''} aria-label="Promo navigation">
            <a href="#protocol" onClick={() => setMenuOpen(false)}>Protocol</a>
            <a href="#use-cases" onClick={() => setMenuOpen(false)}>Use cases</a>
            <a href="#architecture" onClick={() => setMenuOpen(false)}>Architecture</a>
          </nav>
          <div className="promo-nav__actions">
            <a className="promo-signin" href="/tokenomics">Tokenomics</a>
            <a className="promo-button promo-button--small" href="/sale">Buy EXN <ArrowRight size={16} /></a>
          </div>
          <button className="promo-menu" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="promo-hero">
        <div className="promo-shell promo-hero__grid">
          <div className="promo-hero__copy">
            <span className="promo-badge"><Sparkles size={14} /> Settlement for the agent economy</span>
            <h1>Agents exchange value.<br /><em>Expoin settles it.</em></h1>
            <p>Expoin is a non-custodial exchange protocol for autonomous AI agents. It coordinates native, cross-chain swaps without bridges, custodians, or counterparty exposure.</p>
            <div className="promo-hero__actions">
              <a className="promo-button" href="/sale">Get EXN <ArrowRight size={18} /></a>
              <a className="promo-button promo-button--secondary" href="#protocol">Explore protocol</a>
            </div>
          </div>
          <div className="promo-hero__aside">
            <div className="promo-orbit" aria-hidden="true">
              <div className="promo-orbit__core">EXN</div>
              <span className="promo-node promo-node--one">AI</span>
              <span className="promo-node promo-node--two">BTC</span>
              <span className="promo-node promo-node--three">ETH</span>
              <span className="promo-node promo-node--four">BNB</span>
            </div>
            <div className="promo-hero__metric"><span>Settlement model</span><strong>Atomic</strong></div>
            <div className="promo-hero__metric"><span>Asset control</span><strong>Always yours</strong></div>
          </div>
        </div>
        <div className="promo-shell promo-trust-row">
          <span><ShieldCheck size={18} /> Non-custodial</span>
          <span><Zap size={18} /> Atomic execution</span>
          <span><Globe2 size={18} /> Cross-chain native</span>
          <span><LockKeyhole size={18} /> Cryptographic guarantees</span>
        </div>
      </section>

      <section className="promo-dark-band" id="protocol">
        <div className="promo-shell"><MarketTerminal /></div>
      </section>

      <section className="promo-section" id="use-cases">
        <div className="promo-shell">
          <div className="promo-section__heading">
            <div><span className="promo-kicker">Built for autonomous systems</span><h2>Infrastructure that works at machine speed.</h2></div>
            <p>Expoin gives software agents a settlement primitive designed for continuous operation, verifiable execution, and direct wallet ownership.</p>
          </div>
          <div className="promo-use-grid">
            {useCases.map(({icon: Icon, title, copy}) => (
              <article className="promo-use-card" key={title}>
                <span className="promo-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <a href="#architecture">See how it works <ArrowRight size={16} /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="promo-section promo-section--soft" id="architecture">
        <div className="promo-shell">
          <div className="promo-section__heading">
            <div><span className="promo-kicker">Protocol architecture</span><h2>One flow. Four verifiable layers.</h2></div>
            <p>Each layer has one job, making the path from agent intent to on-chain settlement clear and inspectable.</p>
          </div>
          <div className="promo-architecture">
            <div className="promo-layer-list" role="tablist" aria-label="Protocol layers">
              {architecture.map((layer) => {
                const Icon = layer.icon;
                const selected = layer.id === active.id;
                return (
                  <button key={layer.id} role="tab" aria-selected={selected} className={selected ? 'is-active' : ''} onClick={() => setActiveLayer(layer.id)}>
                    <span><Icon /></span><div><small>{layer.eyebrow}</small><strong>{layer.title}</strong></div><ChevronDown />
                  </button>
                );
              })}
            </div>
            <div className="promo-layer-detail" role="tabpanel" key={active.id}>
              <span className="promo-layer-detail__icon"><active.icon /></span>
              <small>{active.eyebrow}</small>
              <h3>{active.title}</h3>
              <p>{active.copy}</p>
              <div className="promo-layer-stat"><strong>{active.stat}</strong><span>{active.statLabel}</span></div>
              <div className="promo-code-line"><i /><code>status: verified / settlement: atomic</code></div>
            </div>
          </div>
        </div>
      </section>

      <section className="promo-cta">
        <div className="promo-shell promo-cta__inner">
          <span className="promo-kicker promo-kicker--dark">The network starts with EXN</span>
          <h2>Own the asset powering the Expoin ecosystem.</h2>
          <p>Join the Community OG round and participate in the settlement economy being built for autonomous agents.</p>
          <div><a className="promo-button promo-button--light" href="/sale">Enter the sale <ArrowRight size={18} /></a><a href="/tokenomics">View tokenomics</a></div>
        </div>
      </section>

      <footer className="promo-footer">
        <div className="promo-shell promo-footer__inner">
          <BrandMark />
          <p>Non-custodial infrastructure for autonomous value exchange.</p>
          <div><a href="/roadmap">Roadmap</a><a href="/faq">FAQ</a><a href="/facts">Facts</a></div>
          <span>© 2026 Expoin</span>
        </div>
      </footer>
    </main>
  );
}
