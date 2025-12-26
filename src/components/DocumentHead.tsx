import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-cms";

export function DocumentHead() {
  const { data: siteSettings } = useSiteSettings();

  useEffect(() => {
    // Update document title (takes priority over MetaTags)
    if (siteSettings?.pageTitle) {
      document.title = siteSettings.pageTitle;
    }

    // Update favicon
    if (siteSettings?.faviconUrl && siteSettings.faviconUrl.trim() !== '') {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      existingFavicons.forEach(link => link.remove());

      // Create new favicon link
      const link = document.createElement('link');
      link.rel = 'icon';
      
      // Check if it's a data URI or URL
      if (siteSettings.faviconUrl.startsWith('data:')) {
        link.href = siteSettings.faviconUrl;
        // Determine type from data URI
        if (siteSettings.faviconUrl.includes('svg')) {
          link.type = 'image/svg+xml';
        } else if (siteSettings.faviconUrl.includes('png')) {
          link.type = 'image/png';
        } else if (siteSettings.faviconUrl.includes('jpg') || siteSettings.faviconUrl.includes('jpeg')) {
          link.type = 'image/jpeg';
        }
      } else {
        // It's a URL
        link.href = siteSettings.faviconUrl;
        // Try to determine type from URL extension
        if (siteSettings.faviconUrl.endsWith('.svg')) {
          link.type = 'image/svg+xml';
        } else if (siteSettings.faviconUrl.endsWith('.png')) {
          link.type = 'image/png';
        } else if (siteSettings.faviconUrl.endsWith('.ico')) {
          link.type = 'image/x-icon';
        } else {
          // Default to svg if no extension
          link.type = 'image/svg+xml';
        }
      }
      
      document.head.appendChild(link);
    }
  }, [siteSettings]);

  return null;
}

