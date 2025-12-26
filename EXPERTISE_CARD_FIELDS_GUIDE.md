# Expertise Card Fields Guide

## Overview
This guide explains the fields in the Expertise Card editor in the admin panel.

---

## Field Descriptions

### 1. **Title** (Required)
- **What it is**: The main heading of the expertise card
- **Example**: "Strategic Planning", "Digital Transformation", "Market Analysis"
- **Where it appears**: At the top of each card on the Expertise page

### 2. **Icon (Lucide Name)** (Required)
- **What it is**: The name of a Lucide React icon to display
- **How to use**: 
  - Enter the exact icon name from [Lucide Icons](https://lucide.dev/icons/)
  - Use PascalCase (capitalize first letter of each word)
  - Examples: `Target`, `Users`, `TrendingUp`, `Lightbulb`, `Rocket`, `BarChart`
- **Where it appears**: As an icon in the top-left of each card
- **Common Icons**:
  - `Target` - Strategy/Goals
  - `Users` - Team/People
  - `TrendingUp` - Growth
  - `Lightbulb` - Innovation/Ideas
  - `Rocket` - Launch/Startups
  - `BarChart` - Analytics/Data
  - `Zap` - Speed/Efficiency
  - `Shield` - Security/Protection
  - `Globe` - Global/International
  - `Code` - Development/Technology

### 3. **Short Description** (Required)
- **What it is**: A brief summary shown on the card
- **Length**: Keep it concise (1-2 sentences)
- **Example**: "Strategic planning and execution to drive organizational growth and success."
- **Where it appears**: Below the title on the card

### 4. **Long Description (Modal)** (Required)
- **What it is**: Detailed description shown when user clicks the card
- **Length**: Can be longer (2-4 paragraphs)
- **Example**: "Our strategic planning services help organizations define clear objectives, identify opportunities, and create actionable roadmaps. We work closely with leadership teams to align vision with execution, ensuring sustainable growth and competitive advantage."
- **Where it appears**: In the modal popup when clicking a card

### 5. **Skills (comma separated)**
- **What it is**: List of skills/capabilities related to this expertise
- **Format**: Comma-separated values
- **Example**: `Strategy, Planning, Analysis, Execution, Leadership`
- **Where it appears**: 
  - As tags below the description on the card
  - In the modal popup as "Key Capabilities"

### 6. **Image URLs (comma separated)**
- **What it is**: URLs to images related to this expertise
- **Format**: Comma-separated URLs
- **Example**: `https://example.com/image1.jpg, https://example.com/image2.jpg`
- **Where it appears**:
  - First 2 images appear as floating images when hovering over the card (desktop only)
  - First image appears in the modal popup
- **Requirements**:
  - Images must be publicly accessible
  - Use HTTPS URLs
  - Recommended: Use Supabase Storage or a CDN

### 7. **Order**
- **What it is**: Number to control the display order
- **How it works**: Lower numbers appear first
- **Example**: `0` = first, `1` = second, `2` = third, etc.
- **Default**: `0`

---

## Tips

### Choosing Icons
1. Visit [Lucide Icons](https://lucide.dev/icons/) to browse available icons
2. Search for keywords related to your expertise
3. Copy the exact icon name (case-sensitive)
4. Test it on the frontend to make sure it displays correctly

### Image URLs
- **Best Practice**: Upload images to Supabase Storage
  1. Go to Supabase Dashboard → Storage
  2. Create/select a bucket (make it public)
  3. Upload your images
  4. Copy the public URL
  5. Paste into the "Image URLs" field

### Skills
- Keep skill names short (1-2 words)
- Use consistent capitalization
- Focus on key capabilities
- 3-6 skills per card is ideal

---

## Example Card

**Title**: Strategic Planning  
**Icon**: `Target`  
**Short Description**: "Develop comprehensive strategies that align with your business objectives and drive measurable results."  
**Long Description**: "Our strategic planning approach combines market analysis, competitive intelligence, and stakeholder alignment to create actionable roadmaps. We help organizations navigate complexity, identify opportunities, and build sustainable competitive advantages."  
**Skills**: `Strategy, Planning, Analysis, Execution, Leadership`  
**Image URLs**: `https://example.com/strategy1.jpg, https://example.com/strategy2.jpg`  
**Order**: `0`

---

## Troubleshooting

### Icon Not Showing
- Check the icon name is spelled correctly
- Ensure it's a valid Lucide icon name
- Use PascalCase (e.g., `Target`, not `target` or `TARGET`)
- If icon doesn't exist, it will show a default `HelpCircle` icon

### Images Not Loading
- Verify URLs are publicly accessible
- Check for CORS issues
- Ensure URLs use HTTPS
- Test URLs in a browser first

### Update Failed
- Check browser console for errors
- Ensure all required fields are filled
- Verify you're logged in as admin
- Check database connection

---

**Need help?** Check the browser console for detailed error messages.




