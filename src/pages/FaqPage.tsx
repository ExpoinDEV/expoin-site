import React from 'react';
import {Eyebrow, PageSection, SectionShell, SpotlightCard} from '../components/pages/PagePrimitives';
import {usePageMetadata} from '../hooks/usePageMetadata';
import {createPageStructuredData, saleFaqItems} from '../lib/seo';

const title = 'Expoin FAQ | EXN Token Sale Questions';
const description = 'Answers about Expoin, EXN, the Community OG token sale, BNB Smart Chain requirements, USDT payments, vesting, and participation risk.';

const faqStructuredData = createPageStructuredData({
  path: '/faq',
  title,
  description,
  breadcrumbs: [
    {name: 'Home', path: '/'},
    {name: 'FAQ', path: '/faq'},
  ],
  article: {
    headline: title,
  },
  faqs: saleFaqItems,
});

export default function FaqPage() {
  usePageMetadata({
    title,
    description,
    path: '/faq',
    jsonLd: faqStructuredData,
  });

  return (
    <div className="pt-32">
      <PageSection className="border-t-0 pb-16">
        <SectionShell className="text-center">
          <Eyebrow>Frequently Asked Questions</Eyebrow>
          <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            <span className="text-[#38BDF8] text-glow">Clear answers</span>{' '}
            <span className="text-white/40">about Expoin and the EXN sale.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl">
            A machine-readable and human-readable FAQ for the most common questions about EXN, BSC, USDT payments, vesting, and sale participation.
          </p>
        </SectionShell>
      </PageSection>

      <PageSection className="pt-8">
        <SectionShell>
          <div className="grid gap-5 lg:grid-cols-2">
            {saleFaqItems.map((item) => (
              <SpotlightCard key={item.question} className="p-7">
                <h2 className="text-xl font-semibold tracking-tight text-white">{item.question}</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/58">{item.answer}</p>
              </SpotlightCard>
            ))}
          </div>
        </SectionShell>
      </PageSection>
    </div>
  );
}
