# MageLabs Deployment Guide

## 1. Vercel Deployment

MageLabs is optimized for zero-configuration Vercel deployment:

```bash
vercel --prod
```

### Environment Variables on Vercel
Add the following in your Vercel Project Settings (`Settings -> Environment Variables`):

- `GEMINI_API_KEY`: Google Gemini API key.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anon key.
- `NEXT_PUBLIC_APP_URL`: Your production URL (e.g. `https://magelabs.vercel.app`).

### Automatic Git Deployments
Pushing to branch `main` on `https://github.com/iamHeroXD/magelabs.git` triggers automated Vercel preview and production deployments.

## 2. Supabase Migration Deployment

Execute database migrations against your Supabase project:

```bash
supabase db push
# Or copy and run the SQL migration directly in Supabase SQL Editor:
# supabase/migrations/20260928000001_initial_schema.sql
```

## 3. Production Verification Checklist

- [x] TypeScript compilation: `npm run typecheck` passes with 0 errors.
- [x] Unit test suite: `npm run test` passes 9/9 tests.
- [x] Static asset check: `npm run validate-assets` passes.
- [x] Production build: `npm run build` compiles all dynamic routes and static pages cleanly.
- [x] WebGL 3D fallback: Progressive loaders prevent hydration mismatch.
- [x] Zero-credential fallback: Offline AI advisor and broadcast collaboration operate smoothly without external keys.
