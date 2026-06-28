import React from 'react';
import OriginalPromoPage from '../../promo/src/App';
import {usePageMetadata} from '../hooks/usePageMetadata';
import {createPageStructuredData} from '../lib/seo';

const title = 'Not Financial Advice | Expoin';
const description = 'Expoin promotional funnel page.';
const structuredData = createPageStructuredData({
  path: '/not-financial-advice',
  title,
  description,
  breadcrumbs: [
    {name: 'Home', path: '/'},
    {name: 'Not Financial Advice', path: '/not-financial-advice'},
  ],
});

export default function PromoPage() {
  usePageMetadata({
    title,
    description,
    path: '/not-financial-advice',
    jsonLd: structuredData,
  });

  return <OriginalPromoPage />;
}
