-- Add about page footer text settings to site_settings
INSERT INTO public.site_settings (key, value)
VALUES (
  'about_footer_text',
  '{
    "createText": "LET''S CREATE",
    "togetherText": "TOGETHER"
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();




