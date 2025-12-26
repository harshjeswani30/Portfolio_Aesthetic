import { useEffect } from 'react';
import { useMetaTags } from '@/hooks/use-cms';

export function MetaTags() {
  const { data: metaTags } = useMetaTags();

  useEffect(() => {
    if (!metaTags) return;

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      if (!content) return;
      
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      if (!href) return;
      
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Update title
    if (metaTags.title) {
      document.title = metaTags.title;
    }

    // Basic meta tags
    updateMetaTag('description', metaTags.description || '');
    updateMetaTag('keywords', metaTags.keywords || '');
    updateMetaTag('author', metaTags.author || '');
    updateMetaTag('robots', metaTags.robots || 'index, follow');

    // Canonical URL
    if (metaTags.canonical) {
      updateLinkTag('canonical', metaTags.canonical);
    }

    // Theme color
    if (metaTags.themeColor) {
      updateMetaTag('theme-color', metaTags.themeColor);
    }

    // Open Graph tags
    if (metaTags.og) {
      updateMetaTag('og:type', metaTags.og.type || '', 'property');
      updateMetaTag('og:url', metaTags.og.url || '', 'property');
      updateMetaTag('og:title', metaTags.og.title || '', 'property');
      updateMetaTag('og:description', metaTags.og.description || '', 'property');
      updateMetaTag('og:image', metaTags.og.image || '', 'property');
      updateMetaTag('og:site_name', metaTags.og.siteName || '', 'property');
    }

    // Twitter Card tags
    if (metaTags.twitter) {
      updateMetaTag('twitter:card', metaTags.twitter.card || '', 'name');
      updateMetaTag('twitter:url', metaTags.twitter.url || '', 'name');
      updateMetaTag('twitter:title', metaTags.twitter.title || '', 'name');
      updateMetaTag('twitter:description', metaTags.twitter.description || '', 'name');
      updateMetaTag('twitter:image', metaTags.twitter.image || '', 'name');
    }
  }, [metaTags]);

  return null;
}




