export type JsonLdObject = Record<string, unknown>;

type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

type PageStructuredDataInput = {
  path: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  faqs?: FaqItem[];
  article?: {
    headline?: string;
    datePublished?: string;
    dateModified?: string;
  };
};

export const SITE_URL = 'https://expoin.net';
export const SITE_NAME = 'Expoin';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SEO_DATE_PUBLISHED = '2026-04-21T00:00:00+04:00';
export const SEO_DATE_MODIFIED = '2026-04-30T00:00:00+04:00';

export function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

const organizationJsonLd: JsonLdObject = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl('/expoin-logo.svg'),
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

const websiteJsonLd: JsonLdObject = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {'@id': ORGANIZATION_ID},
  inLanguage: 'en',
};

function createBreadcrumbJsonLd(path: string, breadcrumbs: BreadcrumbItem[]): JsonLdObject {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function createWebPageJsonLd({path, title, description}: PageStructuredDataInput): JsonLdObject {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: {'@id': WEBSITE_ID},
    publisher: {'@id': ORGANIZATION_ID},
    about: {'@id': ORGANIZATION_ID},
    inLanguage: 'en',
  };
}

function createFaqPageJsonLd(path: string, faqs: FaqItem[]): JsonLdObject {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function createArticleJsonLd({path, title, description, article}: PageStructuredDataInput): JsonLdObject {
  return {
    '@type': 'Article',
    '@id': `${absoluteUrl(path)}#article`,
    headline: article?.headline ?? title,
    description,
    mainEntityOfPage: {'@id': `${absoluteUrl(path)}#webpage`},
    author: {'@id': ORGANIZATION_ID},
    publisher: {'@id': ORGANIZATION_ID},
    datePublished: article?.datePublished ?? SEO_DATE_PUBLISHED,
    dateModified: article?.dateModified ?? SEO_DATE_MODIFIED,
    inLanguage: 'en',
  };
}

export function createPageStructuredData(input: PageStructuredDataInput): JsonLdObject {
  const graph = [
    organizationJsonLd,
    websiteJsonLd,
    createWebPageJsonLd(input),
    createBreadcrumbJsonLd(input.path, input.breadcrumbs),
  ];

  if (input.article) {
    graph.push(createArticleJsonLd(input));
  }

  if (input.faqs?.length) {
    graph.push(createFaqPageJsonLd(input.path, input.faqs));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export const saleFaqItems: FaqItem[] = [
  {
    question: 'What is the EXN Token Sale?',
    answer: "The EXN Token Sale is the initial offering of Expoin's native token (EXN) to early supporters and investors. EXN powers the Expoin ecosystem, a multi-chain DEX and wallet platform connecting over 50 cross-chain bridges.",
  },
  {
    question: 'What is Expoin?',
    answer: 'Expoin is a comprehensive crypto platform featuring a multi-chain wallet and DEX. It is focused on broad cross-chain trading support and atomic swap technology.',
  },
  {
    question: 'Which network should I use?',
    answer: 'The token sale operates on Binance Smart Chain (BSC) mainnet. Make sure your wallet is connected to BSC before purchasing.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'The Community OG sale flow currently accepts USDT on BSC (BEP-20).',
  },
  {
    question: 'How do I participate in the token sale?',
    answer: 'Connect your wallet, ensure you are on BSC, enter a USDT amount, confirm the approval transaction, and then confirm the purchase transaction.',
  },
  {
    question: 'What is the current token price?',
    answer: 'The current Community OG price is $0.0250 per EXN token.',
  },
  {
    question: 'Is there a vesting period?',
    answer: 'Community OG tokens follow a long-term alignment schedule with a 12-month lockup and 18-month linear vesting.',
  },
  {
    question: 'What are the risks?',
    answer: 'Cryptocurrency participation carries risks including volatility, smart contract risk, and regulatory uncertainty. Participants should do their own research before purchasing.',
  },
];
