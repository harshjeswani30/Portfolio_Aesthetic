-- Seed initial data for the portfolio
-- This populates expertise cards, timeline, pages, and site settings

-- ============================================
-- SITE SETTINGS
-- ============================================
INSERT INTO public.site_settings (key, value)
VALUES (
  'general',
  '{
    "headerTitle": "CINEMATIC STRATEGY",
    "pageTitle": "Cinematic Strategy - Strategic Consulting & Creative Direction",
    "faviconUrl": "",
    "siteName": "Portfolio",
    "description": "Strategic portfolio showcasing expertise and achievements"
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================
-- PAGES
-- ============================================

-- About Page
INSERT INTO public.pages (slug, title, content)
VALUES (
  'about',
  'About',
  '{
    "introTitle": "Harsh Jeswani",
    "introSubtitle": "About",
    "introText": "Strategic thinker and creative problem solver.",
    "encryptedText": "Building the future through innovation, leadership, and relentless pursuit of excellence.",
    "role": "Strategist & Leader",
    "focus": "Innovation & Growth",
    "location": "Global"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- Contact Page
INSERT INTO public.pages (slug, title, content)
VALUES (
  'contact',
  'Contact',
  '{
    "tagline": "Harsh Jeswani",
    "title": "Get in Touch",
    "description": "Let''s discuss how we can work together.",
    "email": "harshjeswani30@gmail.com",
    "linkedin": "https://linkedin.com/in/harshjeswani",
    "twitter": "https://twitter.com/harshjeswani"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page
INSERT INTO public.pages (slug, title, content)
VALUES (
  'landing',
  'Home',
  '{
    "heroTitle": "CINEMATIC STRATEGY",
    "heroSubtitle": "Strategic Solutions for Modern Challenges",
    "ctaText": "Explore My Work",
    "description": "Transforming ideas into impactful solutions"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- Expertise Page
INSERT INTO public.pages (slug, title, content)
VALUES (
  'expertise',
  'Expertise',
  '{
    "title": "Areas of Expertise",
    "description": "Comprehensive solutions across multiple domains"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

-- ============================================
-- EXPERTISE CARDS
-- ============================================

INSERT INTO public.expertise_cards (title, description, long_description, icon, skills, images, "order", active)
VALUES
  (
    'Strategic Consulting',
    'Data-driven strategies for business growth',
    'I help organizations identify opportunities, optimize processes, and drive sustainable growth through comprehensive strategic analysis and implementation. With a focus on data-driven decision making, I work closely with leadership teams to develop actionable roadmaps that align with business objectives and market dynamics.',
    '🎯',
    ARRAY['Strategic Planning', 'Business Analysis', 'Market Research', 'Process Optimization'],
    ARRAY[]::text[],
    1,
    true
  ),
  (
    'Product Development',
    'End-to-end product lifecycle management',
    'From concept to launch, I guide product development teams through every stage of the product lifecycle. This includes user research, feature prioritization, agile development practices, and go-to-market strategies. I ensure products not only meet user needs but also drive business value.',
    '🚀',
    ARRAY['Product Strategy', 'User Research', 'Agile Development', 'UX/UI Design'],
    ARRAY[]::text[],
    2,
    true
  ),
  (
    'Technology Solutions',
    'Modern tech stack implementation and optimization',
    'I design and implement scalable technology solutions that power modern businesses. Specializing in cloud architecture, API development, and system integration, I help teams build robust, maintainable systems that can scale with business needs.',
    '💻',
    ARRAY['Cloud Architecture', 'API Development', 'System Integration', 'DevOps'],
    ARRAY[]::text[],
    3,
    true
  ),
  (
    'Team Leadership',
    'Building high-performing teams',
    'I foster collaborative environments where teams can thrive and deliver exceptional results. Through mentorship, clear communication, and strategic resource allocation, I help organizations build cultures of innovation and continuous improvement.',
    '👥',
    ARRAY['Team Building', 'Mentorship', 'Project Management', 'Agile Leadership'],
    ARRAY[]::text[],
    4,
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- TIMELINE ENTRIES
-- ============================================

INSERT INTO public.timeline_entries (year, title, content, images, "order", active)
VALUES
  (
    '2024',
    'Current Focus',
    '"Leading strategic initiatives and driving innovation across multiple projects. Focused on building scalable solutions and mentoring the next generation of leaders."'::jsonb,
    ARRAY[]::text[],
    1,
    true
  ),
  (
    '2023',
    'Major Milestone',
    '"Successfully launched several high-impact projects that transformed business operations. Established new processes and frameworks that improved efficiency by 40%."'::jsonb,
    ARRAY[]::text[],
    2,
    true
  ),
  (
    '2022',
    'Growth Phase',
    '"Expanded expertise into new domains, taking on leadership roles in cross-functional teams. Delivered solutions that directly contributed to business growth."'::jsonb,
    ARRAY[]::text[],
    3,
    true
  ),
  (
    '2021',
    'Foundation',
    '"Built strong foundations in strategic thinking and technical execution. Completed key projects that established credibility and opened new opportunities."'::jsonb,
    ARRAY[]::text[],
    4,
    true
  ),
  (
    '2020',
    'Beginning',
    '"Started the journey with a focus on learning and growth. Took on challenging projects that shaped my approach to problem-solving and strategic thinking."'::jsonb,
    ARRAY[]::text[],
    5,
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY DATA
-- ============================================

-- Check what was inserted
SELECT 'Site Settings' as type, COUNT(*) as count FROM public.site_settings
UNION ALL
SELECT 'Pages', COUNT(*) FROM public.pages
UNION ALL
SELECT 'Expertise Cards', COUNT(*) FROM public.expertise_cards
UNION ALL
SELECT 'Timeline Entries', COUNT(*) FROM public.timeline_entries;

