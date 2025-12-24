# Portfolio Aesthetic

A modern, fully-featured portfolio website with a custom CMS admin panel built with React, TypeScript, and Supabase.

## Overview

This project uses the following tech stack:
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React 19** - Frontend framework
- **React Router v7** - Client-side routing
- **Tailwind v4** - Utility-first CSS framework
- **Shadcn UI** - UI component library
- **Supabase** - Backend (database, authentication, storage)
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations
- **Three.js** - 3D graphics (for profile card)
- **Lucide Icons** - Icon library

## Features

- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 📱 **Mobile Responsive** - Fully optimized for all screen sizes
- 🔐 **Admin Panel** - Complete CMS for managing content
- 🎯 **SEO Optimized** - Full meta tags and Open Graph support
- ⚡ **Fast Performance** - Optimized with lazy loading and code splitting
- 🎭 **Custom Animations** - GSAP and Framer Motion animations
- 🖼️ **Image Management** - Easy image URL management in CMS
- 📝 **Content Management** - Manage pages, expertise cards, timeline, footer, and more

## Tech Stack Details

All relevant files live in the `src` directory.

Use **pnpm** for the package manager.

## Setup

### Prerequisites

- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/harshjeswani30/Portfolio_Aesthetic.git
cd Portfolio_Aesthetic
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` (if exists)
   - Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run database migrations:
   - Go to your Supabase Dashboard → SQL Editor
   - Run all migration files from `supabase/migrations/` in order (001, 002, 003, etc.)

5. Start the development server:
```bash
pnpm dev
```

## Environment Variables

The project requires the following environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

See `ENV_LOCAL_GUIDE.md` for detailed setup instructions.

## Authentication

The project uses **Supabase Auth** with admin-only access:

- Only pre-approved administrators can access the admin panel
- Default admin credentials are set up via migration
- No public user registration
- Admin users must exist in `public.users` table with `is_admin = true`

See `ADMIN_SETUP.md` for admin setup instructions.

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── ui/          # Shadcn UI components
│   └── ...          # Custom components
├── pages/           # Page components
│   ├── admin/       # Admin panel pages
│   └── ...          # Public pages
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and services
│   ├── supabase.ts  # Supabase client
│   └── supabase-cms.ts  # CMS functions
└── ...
```

## Admin Panel

Access the admin panel at `/admin` (requires authentication).

Features:
- **Dashboard** - Overview and statistics
- **Expertise Cards** - Manage expertise/service cards
- **Timeline** - Manage timeline entries
- **Pages** - Edit page content (Home, About, Contact)
- **Footer** - Manage footer content and links
- **Meta Tags** - SEO and social media meta tags
- **Settings** - Profile and profile card image settings

## Frontend Conventions

### Page Routing

Pages should be in the `src/pages` folder. Update `src/main.tsx` to add new routes.

### Styling

- Use Tailwind CSS utility classes
- Colors are defined in `src/index.css` using oklch format
- Follow Shadcn UI component patterns
- Always make components **mobile responsive**
- Avoid nested cards and excessive shadows
- Use thin borders instead of shadows

### Animations

- Use **Framer Motion** for component animations
- Use **GSAP** for complex scroll-triggered animations
- Animate: fade in/out, slide in/out, rendering animations
- Add animations to buttons and UI interactions

### Components

- Place reusable components in `src/components`
- Use Shadcn UI components from `src/components/ui`
- Keep components focused and reusable
- Use TypeScript for type safety

## Backend (Supabase)

The backend uses Supabase for:
- **Database** - PostgreSQL with Row Level Security (RLS)
- **Authentication** - Email/password with admin-only access
- **Storage** - File storage (if needed)

### Database Schema

See `supabase/migrations/` for the complete database schema.

Main tables:
- `users` - User profiles and admin status
- `site_settings` - Global site settings
- `pages` - Page content
- `expertise_cards` - Expertise/service cards
- `timeline_entries` - Timeline entries

### CMS Functions

CMS functions are in `src/lib/supabase-cms.ts`:
- Page management
- Expertise card management
- Timeline management
- Settings management
- Meta tags management

## Development

### Running the Dev Server

```bash
pnpm dev
```

### Building for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the repository owner.
