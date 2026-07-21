# DENTORA-OS - Dental Clinic Web Application

## Overview

DENTORA-OS is a medical-grade, production-ready web application for a dental clinic built with Next.js 14+ (App Router), Tailwind CSS, and Supabase.

## Features

### Core Features
- **Multi-Language Support (i18n)**
  - Primary: French (Professional Medical Terminology)
  - Secondary: Arabic (Modern Moroccan Standard)
  - Automatic RTL (Right-to-Left) switching for Arabic interface
  - Persistent language preference using Zustand

- **PWA (Progressive Web App)**
  - Managed PWA using @ducanh2912/next-pwa
  - Add to Home Screen functionality
  - Offline support with Service Worker
  - Cache-busting and update cycles

- **Admin Dashboard**
  - Supabase Authentication with RLS security
  - Real-time appointment management
  - Statistics dashboard
  - Dynamic clinic settings management

- **SEO Optimized**
  - Dynamic metadata generation based on language
  - Enhanced JSON-LD Schema (MedicalBusiness)
  - Sitemap.xml and Robots.txt
  - Local SEO with geo coordinates

### Performance Features
- Hardware-accelerated animations using Framer Motion
- Toast notifications with spring physics
- Zustand for lightweight state management
- Image optimization with Next.js Image

### Security Features
- Supabase Row Level Security (RLS)
- Input validation and sanitization
- Security headers configuration
- Environment variable protection

## Project Structure

```
src/
├── app/
│   ├── [lang]/           # i18n Route Segment (fr/ar)
│   │   ├── admin/        # Protected Admin Dashboard
│   │   ├── login/        # Supabase Auth Page
│   │   ├── layout.tsx    # Global Layout (PWA & SEO Meta)
│   │   ├── page.tsx      # Home Page
│   │   └── globals.css   # Global Styles
│   └── layout.tsx        # Root Layout
├── components/
│   ├── common/           # Navbar, Footer
│   ├── sections/        # Hero, Services, Booking, etc.
│   ├── shared/          # FloatingActions, LanguageSwitcher, Toast
│   └── ui/              # Atomic Components
├── config/
│   └── dentora-system.ts # Brand Identity (Hardcoded)
├── lib/
│   ├── stores/           # Zustand stores
│   ├── supabase/         # Supabase Client, Auth, Settings
│   └── i18n/             # Dictionary
└── middleware.ts         # i18n & Auth Middleware

public/
├── manifest.json         # PWA Manifest (managed by next-pwa)
├── robots.txt           # SEO Robots
├── sitemap.xml          # SEO Sitemap
└── sw.js                # Service Worker (managed by next-pwa)

supabase/
└── migrations/
    └── 001_security_rls.sql  # Database schema & RLS policies
```

## Configuration

### Environment Variables

Create `.env.local` based on `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase Setup

1. Create a new Supabase project
2. Run the migration script: `supabase/migrations/001_security_rls.sql`
3. This creates:
   - `appointments` table with RLS policies
   - `clinic_settings` table for dynamic configuration
4. Enable authentication in Supabase dashboard
5. Create an admin user

### Database Schema

The RLS policies enforce:
- **Public**: Can INSERT appointments only
- **Authenticated**: Can SELECT, UPDATE, DELETE appointments
- **Settings**: Only authenticated users can modify clinic settings

## Hybrid Configuration Strategy

### Hardcoded (Brand Identity)
- Logo
- Clinic name
- Primary colors
- Font families

### Dynamic (Supabase clinic_settings)
- Working hours
- Service prices
- Emergency contact
- Clinic coordinates

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## Performance Targets

- Lighthouse Performance: 100/100
- Lighthouse Accessibility: 100/100
- Lighthouse Best Practices: 100/100
- Lighthouse SEO: 100/100

### Optimization Strategies

1. **Images**: WebP/AVIF formats, priority loading, blur placeholders
2. **Fonts**: Preconnect to Google Fonts, font-display: swap
3. **CSS**: Tailwind CSS purging, critical CSS
4. **JavaScript**: Code splitting, lazy loading, tree shaking
5. **Caching**: Service Worker caching strategies
6. **Animations**: Framer Motion with hardware acceleration

## State Management

Uses Zustand for:
- Mobile menu toggle state
- Language persistence
- Toast notifications
- Loading states

## Architecture Notes

- Server Components by default for SEO
- Client Components ('use client') only for interactive UI
- Configuration-driven design (no hardcoded values)
- Clean code with English only (no Arabic comments/variables)
- RLS policies for database security

## SQL Migration Script Location

`supabase/migrations/001_security_rls.sql`

Run this script in your Supabase SQL editor to set up the database.

## License

All rights reserved. DENTORA Clinic 2024-2027
