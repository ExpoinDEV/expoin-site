import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

const siteUrl = 'https://expoin.net';
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const datePublished = '2026-04-21T00:00:00+04:00';
const dateModified = '2026-04-30T00:00:00+04:00';

const organization = {
  '@type': 'Organization',
  '@id': organizationId,
  name: 'Expoin',
  url: siteUrl,
  logo: `${siteUrl}/expoin-logo.svg`,
  email: 'contact@expoin.net',
  description: 'Expoin is a multi-chain DEX and wallet platform focused on cross-chain trading, atomic swaps, and direct wallet-based execution.',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'contact@expoin.net',
      contactType: 'customer support',
      availableLanguage: ['en'],
    },
  ],
};

const website = {
  '@type': 'WebSite',
  '@id': websiteId,
  name: 'Expoin',
  url: siteUrl,
  publisher: {'@id': organizationId},
  inLanguage: 'en',
};

const saleFaqs = [
  ['What is the EXN Token Sale?', "The EXN Token Sale is the initial offering of Expoin's native token (EXN) to early supporters and investors. EXN powers the Expoin ecosystem, a multi-chain DEX and wallet platform connecting over 50 cross-chain bridges."],
  ['What is Expoin?', 'Expoin is a comprehensive crypto platform featuring a multi-chain wallet and DEX. It is focused on broad cross-chain trading support and atomic swap technology.'],
  ['Which network should I use?', 'The token sale operates on Binance Smart Chain (BSC) mainnet. Make sure your wallet is connected to BSC before purchasing.'],
  ['What payment methods are accepted?', 'The Community OG sale flow currently accepts USDT on BSC (BEP-20).'],
  ['How do I participate in the token sale?', 'Connect your wallet, ensure you are on BSC, enter a USDT amount, confirm the approval transaction, and then confirm the purchase transaction.'],
  ['What is the current token price?', 'The current Community OG price is $0.0250 per EXN token.'],
  ['Is there a vesting period?', 'Community OG tokens follow a long-term alignment schedule with a 12-month lockup and 18-month linear vesting.'],
  ['What are the risks?', 'Cryptocurrency participation carries risks including volatility, smart contract risk, and regulatory uncertainty. Participants should do their own research before purchasing.'],
];

const pages = [
  {
    route: '/',
    title: 'Expoin DEX and Wallet',
    description: 'Trade across chains from one wallet with atomic swaps, deep liquidity, and zero intermediaries.',
    breadcrumbs: [['Home', '/']],
  },
  {
    route: '/sale',
    title: 'Buy EXN | Expoin Community OG Sale',
    description: 'Join the EXN Community OG round, review vesting terms, and purchase with USDT on BNB Smart Chain.',
    breadcrumbs: [['Home', '/'], ['Buy EXN', '/sale']],
    article: true,
    faqs: saleFaqs,
  },
  {
    route: '/tokenomics',
    title: 'EXN Tokenomics | Expoin',
    description: 'Explore EXN supply structure, allocation, vesting mechanics, and long-term incentive design.',
    breadcrumbs: [['Home', '/'], ['Tokenomics', '/tokenomics']],
    article: true,
  },
  {
    route: '/roadmap',
    title: 'Expoin Roadmap',
    description: 'See the product roadmap for the Expoin wallet, DEX, cross-chain infrastructure, and ecosystem rollout.',
    breadcrumbs: [['Home', '/'], ['Roadmap', '/roadmap']],
    article: true,
  },
  {
    route: '/faq',
    title: 'Expoin FAQ | EXN Token Sale Questions',
    description: 'Answers about Expoin, EXN, the Community OG token sale, BNB Smart Chain requirements, USDT payments, vesting, and participation risk.',
    breadcrumbs: [['Home', '/'], ['FAQ', '/faq']],
    article: true,
    faqs: saleFaqs,
  },
  {
    route: '/facts',
    title: 'Expoin Facts | Official EXN Project Information',
    description: 'Official reference facts for Expoin, EXN, the token sale contract, supported network, tokenomics, and public sale terms.',
    breadcrumbs: [['Home', '/'], ['Facts', '/facts']],
    article: true,
  },
  {
    route: '/promo',
    title: 'Atomic DEX for AI Agents | Expoin',
    description: 'A promotional Expoin landing page for autonomous AI agents, atomic swaps, and trustless cross-chain settlement.',
    breadcrumbs: [['Home', '/'], ['Promo', '/promo']],
  },
  {
    route: '/bonus-admin',
    title: 'Bonus Admin | Expoin',
    description: 'Expoin treasury bonus administration.',
    breadcrumbs: [['Home', '/'], ['Bonus Admin', '/bonus-admin']],
    noindex: true,
  },
  {
    route: '/sale/community/the',
    title: 'THE Holder Bonus | EXN Community Sale',
    description: 'THENA holders can check their wallet eligibility for up to 30% extra EXN in the Community OG Sale.',
    breadcrumbs: [['Home', '/'], ['Buy EXN', '/sale'], ['THE Holder Bonus', '/sale/community/the']],
  },
];

function absoluteUrl(route) {
  return `${siteUrl}${route === '/' ? '/' : route}`;
}

function createStructuredData(page) {
  const url = absoluteUrl(page.route);
  const graph = [
    organization,
    website,
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: {'@id': websiteId},
      publisher: {'@id': organizationId},
      about: {'@id': organizationId},
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: page.breadcrumbs.map(([name, route], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: absoluteUrl(route),
      })),
    },
  ];

  if (page.article) {
    graph.push({
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: page.title,
      description: page.description,
      mainEntityOfPage: {'@id': `${url}#webpage`},
      author: {'@id': organizationId},
      publisher: {'@id': organizationId},
      datePublished,
      dateModified,
      inLanguage: 'en',
    });
  }

  if (page.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: page.faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function stripExistingSeo(html) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta name="description" content="[^"]*"\s*\/?>/i, '')
    .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>/i, '')
    .replace(/\s*<meta property="og:title" content="[^"]*"\s*\/?>/i, '')
    .replace(/\s*<meta property="og:description" content="[^"]*"\s*\/?>/i, '')
    .replace(/\s*<meta property="og:url" content="[^"]*"\s*\/?>/i, '')
    .replace(/\s*<meta property="og:type" content="[^"]*"\s*\/?>/i, '')
    .replace(/\s*<meta name="robots" content="[^"]*"\s*\/?>/i, '')
    .replace(/\s*<script id="expoin-prerender-json-ld" type="application\/ld\+json">[\s\S]*?<\/script>/i, '');
}

function escapeAttr(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

function withSeo(html, page) {
  const cleanedHtml = stripExistingSeo(html);
  const url = absoluteUrl(page.route);
  const jsonLd = JSON.stringify(createStructuredData(page));
  const seoHead = `
    <title>${escapeAttr(page.title)}</title>
    <meta name="description" content="${escapeAttr(page.description)}" />
    ${page.noindex ? '<meta name="robots" content="noindex, nofollow, noarchive" />' : ''}
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${escapeAttr(page.title)}" />
    <meta property="og:description" content="${escapeAttr(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
    <script id="expoin-prerender-json-ld" type="application/ld+json">${jsonLd}</script>`;

  return cleanedHtml.replace('</head>', `${seoHead}\n  </head>`);
}

function routeOutputPath(route) {
  if (route === '/') return indexPath;
  return path.join(distDir, route.replace(/^\//, ''), 'index.html');
}

const baseHtml = await readFile(indexPath, 'utf8');

for (const page of pages) {
  const outputPath = routeOutputPath(page.route);
  await mkdir(path.dirname(outputPath), {recursive: true});
  await writeFile(outputPath, withSeo(baseHtml, page));
}

console.log(`Prerendered SEO HTML for ${pages.length} routes.`);
