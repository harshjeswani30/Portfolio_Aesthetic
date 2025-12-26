# Profile Card Image Setup Guide

## Overview

You can now update the profile card image and lanyard texture from the admin panel!

## How to Update Profile Card Images

### Step 1: Go to Admin Settings

1. Log in to `/admin`
2. Click **"Settings"** in the sidebar
3. Scroll down to **"Profile Card Image"** section

### Step 2: Update Images

1. **Card Image URL** (Optional)
   - Currently, the card image is embedded in the `card.glb` 3D model
   - To change it, you need to edit the GLB file:
     - Go to https://modelviewer.dev/editor/
     - Upload your `card.glb` file
     - Replace the texture/image
     - Download the updated GLB file
     - Replace `src/components/card.glb` with the new file
   - This field is reserved for future use when we add dynamic card image support

2. **Lanyard Texture URL** (Works Now!)
   - Enter a URL to a texture image for the lanyard band
   - Example: `https://example.com/lanyard-texture.png`
   - Leave empty to use the default texture
   - The image will be used as a repeating texture on the lanyard band

### Step 3: Save

- Click **"Update Profile Card Images"**
- The changes will be saved to the database
- Refresh the About page to see the changes

---

## Image Requirements

### Lanyard Texture
- **Format**: PNG, JPG, or any web-compatible image format
- **Size**: Any size (will be tiled/repeated)
- **Aspect Ratio**: Works with any ratio
- **Recommended**: 512x512px or similar square image for best tiling

### Card Image (Future)
- Currently embedded in GLB file
- To change: Edit the GLB file using a 3D editor

---

## Using Supabase Storage

You can upload images to Supabase Storage and use the public URL:

1. **Go to Supabase Dashboard**
   - Open your project
   - Click **"Storage"** in the left sidebar
   - Create a bucket (e.g., `profile-images`) if it doesn't exist
   - Make it public or configure RLS policies

2. **Upload Your Image**
   - Click **"Upload file"**
   - Select your image
   - Copy the public URL

3. **Use the URL**
   - Paste the URL in the Settings form
   - Save

---

## Database Structure

The profile card settings are stored in `site_settings` table:

```sql
{
  "cardImageUrl": "https://...",
  "lanyardImageUrl": "https://..."
}
```

---

## Troubleshooting

### Image Not Showing
- Check the URL is publicly accessible
- Verify the image format is supported (PNG, JPG, etc.)
- Check browser console for errors

### Default Image Still Showing
- Make sure you saved the settings
- Refresh the About page
- Check that the URL is correct

### Lanyard Texture Not Updating
- The texture is loaded via `useTexture` hook
- Make sure the URL is accessible (no CORS issues)
- Try a different image URL to test

---

## Future Enhancements

- [ ] Support for dynamic card image replacement (not just GLB embedded)
- [ ] Image upload directly in admin panel
- [ ] Image preview in 3D viewer
- [ ] Multiple card image options

---

**The lanyard texture update works immediately!** Just add a URL and save. 🎉






