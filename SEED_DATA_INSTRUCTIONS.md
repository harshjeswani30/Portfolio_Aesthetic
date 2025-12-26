# 🌱 Seed Initial Data to Supabase

## The Problem

After migrating from Convex to Supabase, your database tables are empty. You need to populate them with initial data.

## ✅ Quick Solution: Run Seed SQL

1. **Go to Supabase Dashboard**
   - Open your project
   - Click **"SQL Editor"** (left sidebar)
   - Click **"New query"**

2. **Copy and paste the seed SQL**
   - Open file: `supabase/migrations/004_seed_initial_data.sql`
   - Copy ALL the contents
   - Paste into SQL Editor

3. **Click "Run"**
   - Should see: **"Success"**
   - At the bottom, you'll see a table showing counts:
     - Site Settings: 1
     - Pages: 4
     - Expertise Cards: 4
     - Timeline Entries: 5

4. **Verify Data**
   - Go to **Table Editor** in Supabase
   - Check `expertise_cards` table - should have 4 cards
   - Check `timeline_entries` table - should have 5 entries
   - Check `pages` table - should have 4 pages

5. **Refresh Your App**
   - Go to your portfolio website
   - Data should now appear! ✅

---

## What Gets Seeded

### 📄 Pages (4 pages)
- **About** - Your introduction and bio
- **Contact** - Contact information
- **Landing** - Homepage content
- **Expertise** - Expertise page content

### 🎯 Expertise Cards (4 cards)
1. **Strategic Consulting** - Business strategy and analysis
2. **Product Development** - Product lifecycle management
3. **Technology Solutions** - Tech stack implementation
4. **Team Leadership** - Building high-performing teams

### 📅 Timeline Entries (5 entries)
- 2024: Current Focus
- 2023: Major Milestone
- 2022: Growth Phase
- 2021: Foundation
- 2020: Beginning

### ⚙️ Site Settings
- Header title: "CINEMATIC STRATEGY"
- Site name and description

---

## Customize the Data

After seeding, you can:

1. **Edit via Admin Panel**
   - Log in to `/admin`
   - Go to **Expertise Cards** to edit cards
   - Go to **Timeline** to edit entries
   - Go to **Pages** to edit page content

2. **Edit via SQL** (if you prefer)
   - Use SQL Editor to update directly
   - Example:
     ```sql
     UPDATE public.expertise_cards 
     SET title = 'Your New Title'
     WHERE id = 'card-id-here';
     ```

---

## If Seed Fails

### Error: "relation does not exist"
- Make sure you ran `001_initial_schema.sql` first
- Check that all tables exist in Table Editor

### Error: "duplicate key"
- Data already exists
- This is fine - the seed uses `ON CONFLICT DO NOTHING`
- Your existing data is safe

### No data appears
- Check browser console for errors
- Verify Supabase connection in `.env.local`
- Make sure RLS policies allow public read (they should)

---

## Next Steps

1. ✅ Run the seed SQL
2. ✅ Verify data in Table Editor
3. ✅ Check your website - data should appear
4. ✅ Customize via Admin Panel

**Your data is now in Supabase!** 🎉






