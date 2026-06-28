import {useEffect} from 'react';
import type {JsonLdObject} from '../lib/seo';

type PageMetadata = {
  title: string;
  description: string;
  path?: string;
  jsonLd?: JsonLdObject | JsonLdObject[];
};

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  let meta = document.querySelector(selector) as HTMLMetaElement | null;

  if (!meta) {
    meta = create();
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
  return meta;
}

export function usePageMetadata({title, description, path, jsonLd}: PageMetadata) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? null;
    const canonicalUrl = path ? `https://expoin.net${path}` : null;
    const structuredData = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const previousCanonical = canonical?.getAttribute('href') ?? null;

    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }

    const ogTitle = upsertMeta('meta[property="og:title"]', () => {
      const element = document.createElement('meta');
      element.setAttribute('property', 'og:title');
      return element;
    }, title);
    const ogDescription = upsertMeta('meta[property="og:description"]', () => {
      const element = document.createElement('meta');
      element.setAttribute('property', 'og:description');
      return element;
    }, description);
    const ogUrl = canonicalUrl ? upsertMeta('meta[property="og:url"]', () => {
      const element = document.createElement('meta');
      element.setAttribute('property', 'og:url');
      return element;
    }, canonicalUrl) : null;

    const jsonLdScript = document.createElement('script');
    jsonLdScript.id = 'expoin-json-ld';
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.text = JSON.stringify(structuredData.length === 1 ? structuredData[0] : structuredData);

    const existingJsonLdScript = document.getElementById('expoin-json-ld');
    existingJsonLdScript?.remove();

    if (structuredData.length) {
      document.head.appendChild(jsonLdScript);
    }

    return () => {
      document.title = previousTitle;
      if (meta) {
        if (previousDescription === null) {
          meta.remove();
        } else {
          meta.setAttribute('content', previousDescription);
        }
      }
      if (canonical) {
        if (previousCanonical === null) {
          canonical.remove();
        } else {
          canonical.setAttribute('href', previousCanonical);
        }
      }
      ogTitle.remove();
      ogDescription.remove();
      ogUrl?.remove();
      jsonLdScript.remove();
    };
  }, [description, jsonLd, path, title]);
}
