# Resume Integration Guide

This guide shows you exactly where to add your resume data from **Sachin Malik Resume - CV.pdf** to your portfolio website.

## 📋 Table of Contents
1. [About Page](#about-page)
2. [Contact Page](#contact-page)
3. [Expertise Cards](#expertise-cards)
4. [Timeline (Work Experience)](#timeline-work-experience)
5. [Site Settings](#site-settings)
6. [How to Update via Admin Panel](#how-to-update-via-admin-panel)

---

## 1. About Page

**Location:** Admin Panel → Pages Manager → About Tab

### Fields to Update:

| Resume Section | Website Field | Description |
|---------------|---------------|-------------|
| **Name** | `introTitle` | Your full name (e.g., "Sachin Malik") |
| **About/Introduction** | `introSubtitle` | Small subtitle (e.g., "About", "Introduction") |
| **Professional Summary** | `introText` | Short professional summary (1-2 sentences) |
| **Key Achievement/Philosophy** | `encryptedText` | Your professional philosophy or key message (appears with encryption animation) |
| **Current Role** | `role` | Your current job title or role |
| **Focus Area** | `focus` | Your main focus or specialization |
| **Location** | `location` | Your location (city, country, or "Remote") |

### Example:
```json
{
  "introTitle": "Sachin Malik",
  "introSubtitle": "About",
  "introText": "Experienced professional with expertise in [your field]. Passionate about [your passion].",
  "encryptedText": "Driving innovation through strategic thinking and technical excellence.",
  "role": "Senior Developer / Manager",
  "focus": "Full Stack Development & Leadership",
  "location": "India"
}
```

---

## 2. Contact Page

**Location:** Admin Panel → Pages Manager → Contact Tab

### Fields to Update:

| Resume Section | Website Field | Description |
|---------------|---------------|-------------|
| **Name** | `tagline` | Your name (appears as small text at top) |
| **Contact Heading** | `title` | Main heading (e.g., "Let's Connect", "Get in Touch") |
| **Contact Description** | `description` | Brief description about how to reach you |
| **Email** | `email` | Your email address |
| **LinkedIn URL** | `linkedin` | Full LinkedIn profile URL |
| **Twitter/X URL** | `twitter` | Full Twitter/X profile URL |

### Example:
```json
{
  "tagline": "Sachin Malik",
  "title": "Let's Connect",
  "description": "Available for collaborations, consulting opportunities, and meaningful conversations.",
  "email": "sachin.malik@example.com",
  "linkedin": "https://linkedin.com/in/sachinmalik",
  "twitter": "https://twitter.com/sachinmalik"
}
```

---

## 3. Expertise Cards

**Location:** Admin Panel → Expertise Manager

### Structure:
Each expertise card represents a skill area or domain of expertise from your resume.

### Fields for Each Card:

| Resume Section | Website Field | Description |
|---------------|---------------|-------------|
| **Skill Category** | `title` | Name of the expertise area (e.g., "Web Development", "Data Science") |
| **Short Description** | `description` | One-line description (appears on card) |
| **Detailed Description** | `long_description` | Full paragraph explaining your expertise |
| **Icon** | `icon` | Emoji or icon (e.g., "💻", "🎯", "🚀") |
| **Skills List** | `skills` | Array of specific skills (e.g., ["React", "Node.js", "TypeScript"]) |
| **Order** | `order` | Display order (1, 2, 3, etc.) |

### Example Cards Based on Common Resume Sections:

#### Card 1: Technical Skills
```json
{
  "title": "Full Stack Development",
  "description": "Building scalable web applications",
  "long_description": "Expert in developing end-to-end web solutions using modern frameworks and technologies. Specialized in React, Node.js, and cloud infrastructure.",
  "icon": "💻",
  "skills": ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
  "order": 1
}
```

#### Card 2: Leadership/Management
```json
{
  "title": "Team Leadership",
  "description": "Leading high-performing teams",
  "long_description": "Experienced in managing cross-functional teams, mentoring developers, and driving project delivery.",
  "icon": "👥",
  "skills": ["Project Management", "Agile", "Team Building", "Mentorship"],
  "order": 2
}
```

#### Card 3: Domain Expertise
```json
{
  "title": "[Your Domain]",
  "description": "[Short description]",
  "long_description": "[Detailed description from resume]",
  "icon": "🎯",
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "order": 3
}
```

**💡 Tip:** Create 3-5 expertise cards based on your main skill areas from the resume.

---

## 4. Timeline (Work Experience)

**Location:** Admin Panel → Timeline Manager

### Structure:
Each timeline entry represents a job, project, or significant milestone from your resume.

### Fields for Each Entry:

| Resume Section | Website Field | Description |
|---------------|---------------|-------------|
| **Year/Date** | `year` | Year or date range (e.g., "2024", "2022-2024") |
| **Job Title/Project Name** | `title` | Position title or project name |
| **Description** | `content` | Job description, achievements, or project details (as JSON string) |
| **Order** | `order` | Display order (1 = most recent, higher numbers = older) |
| **Active** | `active` | Set to `true` to display |

### Example Timeline Entries:

#### Entry 1: Current/Most Recent Role
```json
{
  "year": "2024",
  "title": "Senior Software Engineer at [Company]",
  "content": "Leading development of [project]. Achieved [key achievement]. Technologies: React, Node.js, AWS.",
  "order": 1,
  "active": true
}
```

#### Entry 2: Previous Role
```json
{
  "year": "2022-2024",
  "title": "Software Engineer at [Company]",
  "content": "Developed [features]. Improved [metrics]. Worked with [technologies].",
  "order": 2,
  "active": true
}
```

#### Entry 3: Education or Earlier Role
```json
{
  "year": "2020-2022",
  "title": "Junior Developer / Education",
  "content": "[Description from resume]",
  "order": 3,
  "active": true
}
```

**💡 Tip:** 
- List entries in reverse chronological order (most recent first)
- Use `year` field for dates (e.g., "2024", "2022-2024", "2020")
- Keep `content` concise but informative (2-3 sentences)

---

## 5. Site Settings

**Location:** Admin Panel → Pages Manager → Site Settings Tab

### Fields to Update:

| Resume Section | Website Field | Description |
|---------------|---------------|-------------|
| **Professional Brand** | `headerTitle` | Title that appears in header (e.g., "SACHIN MALIK", "PORTFOLIO") |
| **Browser Tab Title** | `pageTitle` | Title shown in browser tab (e.g., "Sachin Malik - Portfolio") |
| **Favicon** | `faviconUrl` | URL to your favicon image (optional) |

### Example:
```json
{
  "headerTitle": "SACHIN MALIK",
  "pageTitle": "Sachin Malik - Portfolio | Full Stack Developer",
  "faviconUrl": ""
}
```

---

## 6. How to Update via Admin Panel

### Step-by-Step Instructions:

1. **Login to Admin Panel**
   - Navigate to `/admin` route
   - Login with your admin credentials

2. **Update About Page:**
   - Go to **Pages Manager** → **About** tab
   - Fill in all fields with data from your resume
   - Click **"Save Changes"**

3. **Update Contact Page:**
   - Go to **Pages Manager** → **Contact** tab
   - Enter your email, LinkedIn, Twitter URLs
   - Update tagline and description
   - Click **"Save Changes"**

4. **Add Expertise Cards:**
   - Go to **Expertise Manager**
   - Click **"Add New Card"** for each skill area
   - Fill in title, descriptions, skills array
   - Set order (1, 2, 3...)
   - Click **"Save"**

5. **Add Timeline Entries:**
   - Go to **Timeline Manager**
   - Click **"Add New Entry"** for each job/experience
   - Enter year, title, content
   - Set order (1 = most recent)
   - Click **"Save"**

6. **Update Site Settings:**
   - Go to **Pages Manager** → **Site Settings** tab
   - Update header title and page title
   - Click **"Save Changes"**

---

## 📝 Quick Checklist

Use this checklist to ensure you've added all resume data:

- [ ] **About Page:**
  - [ ] Name (introTitle)
  - [ ] Professional summary (introText)
  - [ ] Encrypted text message
  - [ ] Role, Focus, Location

- [ ] **Contact Page:**
  - [ ] Email address
  - [ ] LinkedIn URL
  - [ ] Twitter/X URL
  - [ ] Tagline and description

- [ ] **Expertise Cards:**
  - [ ] Created 3-5 cards for main skill areas
  - [ ] Added skills array for each card
  - [ ] Set proper order

- [ ] **Timeline:**
  - [ ] Added all work experiences
  - [ ] Added education (if relevant)
  - [ ] Entries in reverse chronological order
  - [ ] All entries marked as active

- [ ] **Site Settings:**
  - [ ] Updated header title
  - [ ] Updated browser tab title
  - [ ] Added favicon (optional)

---

## 🎯 Pro Tips

1. **Keep it Concise:** Website content should be more concise than a resume. Extract key points.

2. **Use Action Words:** Start descriptions with action verbs (Led, Developed, Achieved, etc.)

3. **Quantify Achievements:** Include numbers/metrics where possible (e.g., "Improved performance by 40%")

4. **Professional Tone:** Maintain a professional but approachable tone

5. **Test After Updates:** Always preview your changes on the live site after updating

6. **Backup First:** Consider exporting your current data before making major changes

---

## 📞 Need Help?

If you need assistance extracting specific data from your PDF resume or have questions about mapping resume sections to website fields, feel free to ask!

---

**Last Updated:** 2024
**Version:** 1.0

