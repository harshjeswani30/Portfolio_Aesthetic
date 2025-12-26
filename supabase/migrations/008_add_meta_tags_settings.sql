-- Add meta tags settings to site_settings table
-- This migration is idempotent and can be run multiple times

-- Insert or update meta tags settings with default values
INSERT INTO public.site_settings (key, value)
VALUES (
  'meta_tags',
  '{
    "title": "Cinematic Strategy - Strategic Consulting & Creative Direction",
    "description": "Strategic consulting and creative direction for forward-thinking organizations. Combining analytical rigor with creative vision to drive meaningful growth.",
    "keywords": "strategic consulting, creative direction, business strategy, innovation, leadership, portfolio",
    "author": "Cinematic Strategy",
    "robots": "index, follow",
    "canonical": "",
    "og": {
      "type": "website",
      "url": "",
      "title": "Cinematic Strategy - Strategic Consulting & Creative Direction",
      "description": "Strategic consulting and creative direction for forward-thinking organizations. Combining analytical rigor with creative vision to drive meaningful growth.",
      "image": "",
      "siteName": "Cinematic Strategy"
    },
    "twitter": {
      "card": "summary_large_image",
      "url": "",
      "title": "Cinematic Strategy - Strategic Consulting & Creative Direction",
      "description": "Strategic consulting and creative direction for forward-thinking organizations. Combining analytical rigor with creative vision to drive meaningful growth.",
      "image": ""
    },
    "themeColor": "#0f0e0d"
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();




