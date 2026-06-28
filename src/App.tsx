import React, {lazy, useEffect} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import {usePageMetadata} from './hooks/usePageMetadata';
import {createPageStructuredData} from './lib/seo';

const HomePage = lazy(() => import('./pages/HomePage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const TokenomicsPage = lazy(() => import('./pages/TokenomicsPage'));
const CommunitySalePage = lazy(() => import('./pages/CommunitySalePage'));
const PromoPage = lazy(() => import('./pages/PromoPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const FactsPage = lazy(() => import('./pages/FactsPage'));
const PromoLanding = lazy(() => import('./pages/promoLanding/PromoLanding'));
const BonusAdminPage = lazy(() => import('./pages/BonusAdminPage'));
const CommunityCampaignPage = lazy(() => import('./pages/communitySale/CommunityCampaignPage'));

const tokenSaleRedirectStructuredData = createPageStructuredData({
  path: '/token-sale',
  title: 'Token Sale Redirect | Expoin',
  description: 'Redirecting to the legacy token sale route.',
  breadcrumbs: [
    {name: 'Home', path: '/'},
    {name: 'Token Sale', path: '/token-sale'},
  ],
});

function TokenSaleRedirectPage() {
  usePageMetadata({
    title: 'Token Sale Redirect | Expoin',
    description: 'Redirecting to the legacy token sale route.',
    path: '/token-sale',
    jsonLd: tokenSaleRedirectStructuredData,
  });

  useEffect(() => {
    window.location.replace('/token-sale/');
  }, []);

  return (
    <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-6 text-center text-white/60">
      Redirecting to token sale...
    </div>
  );
}

const router = createBrowserRouter([
  {path: '/promo', element: <PromoLanding />},
  {path: '/bonus-admin', element: <BonusAdminPage />},
  {path: '/bonus-admin/', element: <BonusAdminPage />},
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'roadmap', element: <RoadmapPage />},
      {path: 'tokenomics', element: <TokenomicsPage />},
      {path: 'sale', element: <CommunitySalePage />},
      {path: 'sale/community', element: <CommunityCampaignPage />},
      {path: 'sale/community/:slug', element: <CommunityCampaignPage />},
      {path: 'faq', element: <FaqPage />},
      {path: 'facts', element: <FactsPage />},
      {path: 'not-financial-advice', element: <PromoPage />},
      {path: 'token-sale', element: <TokenSaleRedirectPage />},
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
