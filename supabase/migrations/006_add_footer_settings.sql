-- Add footer settings to site_settings
INSERT INTO public.site_settings (key, value)
VALUES (
  'footer',
  '{
    "brandName": "Cinematic Strategy",
    "logoText": "CS",
    "socialLinks": [
      {
        "platform": "twitter",
        "href": "https://twitter.com",
        "label": "Twitter"
      },
      {
        "platform": "instagram",
        "href": "https://instagram.com",
        "label": "Instagram"
      },
      {
        "platform": "linkedin",
        "href": "https://linkedin.com",
        "label": "LinkedIn"
      }
    ],
    "mainLinks": [
      {
        "href": "#",
        "label": "Expertise"
      },
      {
        "href": "#",
        "label": "Work"
      },
      {
        "href": "#",
        "label": "Contact"
      }
    ],
    "legalLinks": [
      {
        "href": "#",
        "label": "Privacy Policy"
      },
      {
        "href": "#",
        "label": "Terms of Service"
      }
    ],
    "copyright": {
      "text": "© 2024 Cinematic Strategy. All rights reserved.",
      "license": ""
    }
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();




