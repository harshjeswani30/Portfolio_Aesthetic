import { useSupabaseQuery } from './use-supabase-query';
import * as cms from '@/lib/supabase-cms';
import { useState } from 'react';

// Profile Card Settings
export function useProfileCardSettings() {
  return useSupabaseQuery(
    () => cms.getProfileCardSettings(),
    []
  );
}

export function useUpdateProfileCardSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateProfileCardSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateProfileCardSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Footer Settings
export function useFooterSettings() {
  return useSupabaseQuery(
    () => cms.getFooterSettings(),
    []
  );
}

export function useUpdateFooterSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateFooterSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateFooterSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// About Footer Text
export function useAboutFooterText() {
  return useSupabaseQuery(
    () => cms.getAboutFooterText(),
    []
  );
}

export function useUpdateAboutFooterText() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateAboutFooterText>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateAboutFooterText(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Logo Settings
export function useLogoSettings() {
  return useSupabaseQuery(
    () => cms.getLogoSettings(),
    []
  );
}

export function useUpdateLogoSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateLogoSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateLogoSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Meta Tags Settings
export function useMetaTags() {
  return useSupabaseQuery(
    () => cms.getMetaTags(),
    []
  );
}

export function useUpdateMetaTags() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateMetaTags>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateMetaTags(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Expertise Cards
export function useExpertiseCards(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getExpertiseCards(includeInactive),
    [includeInactive]
  );
}

export function useCreateExpertiseCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (card: Parameters<typeof cms.createExpertiseCard>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createExpertiseCard(card);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateExpertiseCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: Parameters<typeof cms.updateExpertiseCard>[1]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateExpertiseCard(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteExpertiseCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteExpertiseCard(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Pages
export function usePage(slug: string) {
  return useSupabaseQuery(
    () => cms.getPage(slug),
    [slug]
  );
}

export function useSiteSettings() {
  return useSupabaseQuery(() => cms.getSiteSettings(), []);
}

export function useUpdatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (slug: string, content: any, title?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updatePage(slug, content, title);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Timeline
export function useTimeline() {
  return useSupabaseQuery(() => cms.getTimeline(), []);
}

export function useCreateTimelineEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (entry: Parameters<typeof cms.createTimelineEntry>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createTimelineEntry(entry);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateTimelineEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: Parameters<typeof cms.updateTimelineEntry>[1]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateTimelineEntry(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteTimelineEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteTimelineEntry(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Gallery Items
export function useGalleryItems(includeInactive = false) {
  return useSupabaseQuery(
    () => cms.getGalleryItems(includeInactive),
    [includeInactive]
  );
}

export function useCreateGalleryItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (item: Parameters<typeof cms.createGalleryItem>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.createGalleryItem(item);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useUpdateGalleryItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, updates: Parameters<typeof cms.updateGalleryItem>[1]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateGalleryItem(id, updates);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

export function useDeleteGalleryItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cms.deleteGalleryItem(id);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

// Gallery Text Settings
export function useGalleryTextSettings() {
  return useSupabaseQuery(
    () => cms.getGalleryTextSettings(),
    []
  );
}

export function useUpdateGalleryTextSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (settings: Parameters<typeof cms.updateGalleryTextSettings>[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cms.updateGalleryTextSettings(settings);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
}

