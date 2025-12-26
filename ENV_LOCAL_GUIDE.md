# .env.local File Guide

## ✅ Required Environment Variables (After Convex Removal)

Your `.env.local` file should **ONLY** contain these Supabase variables:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ❌ Remove These (No Longer Needed)

If you have any of these in your `.env.local`, **DELETE them**:

```env
# ❌ REMOVE - Convex is no longer used
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=...

# ❌ REMOVE - Vly integrations (optional, not needed)
VLY_INTEGRATION_KEY=...
VLY_INTEGRATION_BASE_URL=...

# ❌ REMOVE - Convex backend env vars (not used anymore)
JWKS=...
JWT_PRIVATE_KEY=...
SITE_URL=...
VLY_APP_NAME=...
```

---

## 📝 Complete .env.local Template

Here's what your `.env.local` should look like:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**That's it!** Only 2 variables needed.

---

## 🔍 How to Get Your Supabase Values

1. **Go to Supabase Dashboard**
   - Open your project
   - Click **"Settings"** (gear icon)
   - Click **"API"**

2. **Copy the values:**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## ✅ Verify Your Setup

After updating `.env.local`:

1. **Restart your dev server:**
   ```bash
   pnpm dev
   ```

2. **Check browser console:**
   - Should NOT see: "Missing Supabase environment variables"
   - If you see it, check your `.env.local` file

3. **Test login:**
   - Go to `/auth`
   - Should work with Supabase

---

## 📌 Notes

- `.env.local` is in `.gitignore` (not committed to git)
- **Never commit** your Supabase keys to git
- If you see errors about missing env vars, check:
  1. File is named exactly `.env.local` (not `.env`)
  2. File is in project root (same folder as `package.json`)
  3. No typos in variable names
  4. Restart dev server after changes

---

## 🧹 Clean Up Old Files (Optional)

These files are no longer needed (but won't hurt if they exist):
- `setup-backend-env.sh` - Was for Convex
- Any Convex-related scripts

You can delete them if you want, but they won't affect the app.






