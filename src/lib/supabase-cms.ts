import { supabase } from './supabase';
import type { Database } from './database.types';

type ExpertiseCard = Database['public']['Tables']['expertise_cards']['Row'];
type TimelineEntry = Database['public']['Tables']['timeline_entries']['Row'];
type Page = Database['public']['Tables']['pages']['Row'];
type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];

// --- EXPERTISE CARDS ---
export async function getExpertiseCards(includeInactive = false) {
  let query = supabase
    .from('expertise_cards')
    .select('*')
    .order('order', { ascending: true });

  if (!includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createExpertiseCard(card: Database['public']['Tables']['expertise_cards']['Insert']) {
  const { data, error } = await supabase
    .from('expertise_cards')
    .insert(card as any)
    .select()
    .single();
  if (error) throw error;
  return data as ExpertiseCard;
}

export async function updateExpertiseCard(
  id: string,
  updates: Database['public']['Tables']['expertise_cards']['Update']
) {
  const result = await ((supabase.from('expertise_cards') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single());
  if (result.error) throw result.error;
  return result.data as ExpertiseCard;
}

export async function deleteExpertiseCard(id: string) {
  const { error } = await supabase
    .from('expertise_cards')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// --- PAGES ---
export async function getPage(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

export async function getSiteSettings() {
  const { data, error } = await (supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'general')
    .single() as any);
  
  if (error && error.code !== 'PGRST116') throw error;
  const settings = ((data as any)?.value as any) || { 
    headerTitle: "CINEMATIC STRATEGY",
    pageTitle: "Cinematic Strategy - Strategic Consulting & Creative Direction",
    faviconUrl: ""
  };
  return settings;
}

export async function getLogoSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'logo')
    .maybeSingle();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching logo settings:', error);
    return {
      logoUrl: '',
      logoText: 'CS',
      faviconUrl: '',
    };
  }
  
  return ((data as any)?.value as any) || {
    logoUrl: '',
    logoText: 'CS',
    faviconUrl: '',
  };
}

export async function updateLogoSettings(settings: { logoUrl?: string; logoText?: string; faviconUrl?: string }) {
  const existingQuery = supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'logo')
    .maybeSingle();
  
  const { data: existing } = await (existingQuery as any);

  if (existing && (existing as any).id) {
    const currentValue = ((existing as any).value as any) || {};
    const result = await ((supabase.from('site_settings') as any)
      .update({ 
        value: { ...currentValue, ...settings }, 
        updated_at: new Date().toISOString() 
      })
      .eq('key', 'logo'));
    
    if (result.error) throw result.error;
    return { ...currentValue, ...settings };
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'logo', value: settings } as any)
      .select()
      .single();
    
    if (error) throw error;
    return ((data as any)?.value as any) || settings;
  }
}

export async function getProfileCardSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'profile_card')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    // If not found, return defaults
    return {
      cardImageUrl: '',
    };
  }
  
  return ((data as any)?.value as any) || {
    cardImageUrl: ''
  };
}

export async function getFooterSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'footer')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching footer settings:', error);
    return null;
  }
  
  return ((data as any)?.value as any) || null;
}

export async function updateFooterSettings(settings: any) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'footer')
    .single();

  if (existing) {
    const result = await ((supabase.from('site_settings') as any)
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq('key', 'footer'));
    
    if (result.error) throw result.error;
    return settings;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'footer', value: settings } as any)
      .select()
      .single();
    
    if (error) throw error;
    return (data as any)?.value as any;
  }
}

export async function getAboutFooterText() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'about_footer_text')
    .single() as any;
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching about footer text:', error);
    return null;
  }
  
  return ((data as any)?.value as any) || null;
}

export async function updateAboutFooterText(settings: any) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'about_footer_text')
    .single() as any;

  if (existing) {
    const result = await ((supabase.from('site_settings') as any)
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq('key', 'about_footer_text'));
    
    if (result.error) throw result.error;
    return settings;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'about_footer_text', value: settings } as any)
      .select()
      .single();
    
    if (error) throw error;
    return (data as any)?.value as any;
  }
}

// --- META TAGS ---
export async function getMetaTags() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'meta_tags')
      .maybeSingle() as any;
    
    if (error && error.code !== 'PGRST116') {
      // Silently handle 406 and other errors - return null if not found
      return null;
    }
    
    return ((data as any)?.value as any) || null;
  } catch (err) {
    // Silently handle any errors
    return null;
  }
}

export async function updateMetaTags(settings: any) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'meta_tags')
    .single() as any;

  if (existing) {
    const result = await ((supabase.from('site_settings') as any)
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq('key', 'meta_tags'));
    
    if (result.error) throw result.error;
    return settings;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'meta_tags', value: settings } as any)
      .select()
      .single();
    
    if (error) throw error;
    return (data as any)?.value as any;
  }
}

export async function updateProfileCardSettings(settings: { cardImageUrl?: string }) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id, value')
    .eq('key', 'profile_card')
    .single() as any;

  const currentValue = (existing?.value as any) || {};
  const newValue = {
    ...currentValue,
    ...settings
  };

  if (existing) {
    const result = await ((supabase.from('site_settings') as any)
      .update({ value: newValue })
      .eq('id', (existing as any).id)
      .select()
      .single());
    if (result.error) throw result.error;
    return result.data as any;
  } else {
    const { data, error } = await supabase
      .from('site_settings')
      .insert({ key: 'profile_card', value: newValue } as any)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  }
}

export async function updatePage(
  slug: string,
  content: any,
  title?: string
) {
  const { data: existing } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single() as any;

  if (existing) {
    const result = await ((supabase.from('pages') as any)
      .update({ content, ...(title ? { title } : {}) })
      .eq('id', (existing as any).id)
      .select()
      .single());
    if (result.error) throw result.error;
    return result.data as Page;
  } else {
    const { data, error } = await supabase
      .from('pages')
      .insert({ slug, title: title || slug, content } as any)
      .select()
      .single();
    if (error) throw error;
    return data as Page;
  }
}

// --- TIMELINE ---
export async function getTimeline(includeInactive = false) {
  let query = supabase
    .from('timeline_entries')
    .select('*')
    .order('order', { ascending: true });

  if (!includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createTimelineEntry(entry: Database['public']['Tables']['timeline_entries']['Insert']) {
  const { data, error } = await (supabase
    .from('timeline_entries')
    .insert(entry as any)
    .select()
    .single() as any);
  if (error) throw error;
  return data as TimelineEntry;
}

export async function updateTimelineEntry(
  id: string,
  updates: Database['public']['Tables']['timeline_entries']['Update']
) {
  const result = await ((supabase.from('timeline_entries') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single());
  if (result.error) throw result.error;
  return result.data as TimelineEntry;
}

export async function deleteTimelineEntry(id: string) {
  const { error } = await supabase
    .from('timeline_entries')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// --- GALLERY ITEMS ---
export async function getGalleryItems(includeInactive = false) {
  let query = supabase
    .from('gallery_items')
    .select('*')
    .order('order', { ascending: true });

  if (!includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createGalleryItem(item: Database['public']['Tables']['gallery_items']['Insert']) {
  const { data, error } = await supabase
    .from('gallery_items')
    .insert(item as any)
    .select()
    .single();
  if (error) throw error;
  return data as GalleryItem;
}

export async function updateGalleryItem(
  id: string,
  updates: Database['public']['Tables']['gallery_items']['Update']
) {
  const result = await ((supabase.from('gallery_items') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single());
  if (result.error) throw result.error;
  return result.data as GalleryItem;
}

export async function deleteGalleryItem(id: string) {
  const { error } = await supabase
    .from('gallery_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// --- GALLERY TEXT SETTINGS ---
export async function getGalleryTextSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'gallery_text')
    .maybeSingle();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching gallery text settings:', error);
    return null;
  }
  
  return ((data as any)?.value as any) || {
    startText: { first: 'Ariel', second: 'Croze' },
    endText: { first: 'Daria', second: 'Gaita' }
  };
}

export async function updateGalleryTextSettings(settings: any) {
  const existingQuery = supabase
    .from('site_settings')
    .select('id')
    .eq('key', 'gallery_text')
    .maybeSingle();
  
  const { data: existing } = await (existingQuery as any);
  
  if (existing && (existing as any).id) {
    const updateQuery = (supabase
      .from('site_settings') as any)
      .update({ value: settings, updated_at: new Date().toISOString() })
      .eq('id', (existing as any).id)
      .select()
      .single();
    const { data, error } = await updateQuery;
    if (error) throw error;
    return (data as any)?.value as any;
  } else {
    const insertQuery = (supabase
      .from('site_settings') as any)
      .insert({ key: 'gallery_text', value: settings })
      .select()
      .single();
    const { data, error } = await insertQuery;
    if (error) throw error;
    return (data as any)?.value as any;
  }
}


