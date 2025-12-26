-- ============================================
-- RESUME DATA TEMPLATE
-- ============================================
-- This is a template file for adding resume data
-- Replace the placeholder values with actual data from your resume
-- Then run this migration in your Supabase SQL Editor

-- ============================================
-- UPDATE SITE SETTINGS
-- ============================================
UPDATE public.site_settings
SET value = jsonb_set(
  jsonb_set(
    jsonb_set(
      value,
      '{headerTitle}',
      '"YOUR_NAME_OR_BRAND"'::jsonb
    ),
    '{pageTitle}',
    '"Your Name - Portfolio | Your Title"'::jsonb
  ),
  '{faviconUrl}',
  '""'::jsonb
)
WHERE key = 'general';

-- ============================================
-- UPDATE ABOUT PAGE
-- ============================================
UPDATE public.pages
SET content = '{
  "introTitle": "YOUR_FULL_NAME",
  "introSubtitle": "About",
  "introText": "Your professional summary in 1-2 sentences. Highlight your key strengths and what you do.",
  "encryptedText": "Your professional philosophy or key message that appears with encryption animation.",
  "role": "Your Current Role/Title",
  "focus": "Your Main Focus Area",
  "location": "Your Location"
}'::jsonb
WHERE slug = 'about';

-- ============================================
-- UPDATE CONTACT PAGE
-- ============================================
UPDATE public.pages
SET content = '{
  "tagline": "YOUR_NAME",
  "title": "Let''s Connect",
  "description": "Brief description about how people can reach you or what you're available for.",
  "email": "your.email@example.com",
  "linkedin": "https://linkedin.com/in/yourprofile",
  "twitter": "https://twitter.com/yourhandle"
}'::jsonb
WHERE slug = 'contact';

-- ============================================
-- DELETE EXISTING EXPERTISE CARDS (Optional)
-- ============================================
-- Uncomment the line below if you want to start fresh
-- DELETE FROM public.expertise_cards;

-- ============================================
-- INSERT EXPERTISE CARDS
-- ============================================
-- Replace these with your actual expertise areas from your resume
-- Add or remove cards as needed

INSERT INTO public.expertise_cards (title, description, long_description, icon, skills, images, "order", active)
VALUES
  (
    'Expertise Area 1',  -- e.g., "Full Stack Development"
    'Short one-line description',  -- e.g., "Building scalable web applications"
    'Detailed paragraph explaining your expertise in this area. Include your experience, technologies, and achievements.',  -- Full description
    '💻',  -- Emoji icon (choose appropriate emoji)
    ARRAY['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'],  -- Array of specific skills
    ARRAY[]::text[],  -- Image URLs (optional, leave empty array if none)
    1,  -- Order (1 = first, 2 = second, etc.)
    true  -- Active (true to display, false to hide)
  ),
  (
    'Expertise Area 2',  -- e.g., "Team Leadership"
    'Short one-line description',
    'Detailed paragraph for this expertise area.',
    '👥',
    ARRAY['Skill 1', 'Skill 2', 'Skill 3'],
    ARRAY[]::text[],
    2,
    true
  ),
  (
    'Expertise Area 3',
    'Short one-line description',
    'Detailed paragraph for this expertise area.',
    '🎯',
    ARRAY['Skill 1', 'Skill 2', 'Skill 3'],
    ARRAY[]::text[],
    3,
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- DELETE EXISTING TIMELINE ENTRIES (Optional)
-- ============================================
-- Uncomment the line below if you want to start fresh
-- DELETE FROM public.timeline_entries;

-- ============================================
-- INSERT TIMELINE ENTRIES (Work Experience)
-- ============================================
-- Replace these with your actual work experience from your resume
-- List in reverse chronological order (most recent first)
-- Add or remove entries as needed

INSERT INTO public.timeline_entries (year, title, content, images, "order", active)
VALUES
  (
    '2024',  -- Year or date range (e.g., "2024", "2022-2024")
    'Current/Most Recent Role Title',  -- e.g., "Senior Software Engineer at Company Name"
    '"Brief description of your role, key achievements, and technologies used. Keep it concise but informative (2-3 sentences)."'::jsonb,  -- Content as JSON string
    ARRAY[]::text[],  -- Image URLs (optional, leave empty array if none)
    1,  -- Order (1 = most recent, higher numbers = older)
    true  -- Active (true to display, false to hide)
  ),
  (
    '2022-2024',  -- Previous role date range
    'Previous Role Title',
    '"Description of this role, achievements, and technologies."'::jsonb,
    ARRAY[]::text[],
    2,
    true
  ),
  (
    '2020-2022',  -- Earlier role
    'Earlier Role Title',
    '"Description of this role."'::jsonb,
    ARRAY[]::text[],
    3,
    true
  ),
  (
    '2020',  -- Education or first role
    'Education / First Role',
    '"Description of education or first professional role."'::jsonb,
    ARRAY[]::text[],
    4,
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY UPDATES
-- ============================================
-- Run these queries to verify your data was updated correctly

-- Check site settings
SELECT key, value FROM public.site_settings WHERE key = 'general';

-- Check about page
SELECT slug, content FROM public.pages WHERE slug = 'about';

-- Check contact page
SELECT slug, content FROM public.pages WHERE slug = 'contact';

-- Check expertise cards
SELECT title, description, "order", active FROM public.expertise_cards ORDER BY "order";

-- Check timeline entries
SELECT year, title, "order", active FROM public.timeline_entries ORDER BY "order";

