# KTree CMS Admin User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Content Management](#content-management)
   - [Pages](#pages)
   - [Posts (Blog)](#posts-blog)
   - [Treatments](#treatments)
   - [Locations](#locations)
   - [Clinics](#clinics)
   - [FAQs](#faqs)
   - [Testimonials](#testimonials)
   - [Categories](#categories)
4. [Media Management](#media-management)
5. [Rich Text Editor & Hyperlinks](#rich-text-editor--hyperlinks)
6. [Global Settings](#global-settings)
   - [Site Settings](#site-settings)
   - [Navigation](#navigation)
   - [Footer](#footer)
   - [Hero Content](#hero-content)
   - [Tracking Settings](#tracking-settings)
7. [User Management](#user-management)
8. [Two-Factor Authentication](#two-factor-authentication)
9. [SEO Management](#seo-management)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Panel
1. Navigate to your website URL followed by `/admin` (e.g., `https://yoursite.com/admin`)
2. Enter your email and password
3. If Two-Factor Authentication is enabled, enter the 6-digit code from your Google Authenticator app

**Screenshot Placeholder:** Login screen showing email and password fields

### First Time Login
1. Your administrator will provide you with login credentials
2. Change your password immediately after first login
3. Set up Two-Factor Authentication if required

---

## Dashboard Overview

The dashboard provides quick access to all content management features:

- **Left Sidebar:** Navigation menu with all collections and globals
- **Main Content Area:** Lists, forms, and content editors
- **Top Bar:** User profile, logout, and quick actions

**Screenshot Placeholder:** Dashboard overview with labeled sections

---

## Content Management

### Pages

Pages are the main content sections of your website (About Us, Contact, Services, etc.)

#### Creating a New Page
1. Click **Pages** in the left sidebar
2. Click **Create New Page** button
3. Fill in the required fields:
   - **Title:** The page title (e.g., "About Us")
   - **Slug:** URL path (e.g., "about-us"). Use "home" for the homepage
   - **Status:** Set to "Published" when ready to go live
4. Add content blocks using the **Layout** builder (see Layout Blocks section)
5. Click **Save** or **Save Draft**

**Screenshot Placeholder:** Page creation form with filled example data

#### Layout Blocks Available
- **Hero:** Eye-catching header with image and call-to-action buttons
- **Rich Content:** Text sections with formatting options
- **Highlight:** Emphasized quotes or important information
- **Stats Grid:** Display statistics in a grid format
- **Principles List:** Numbered list of principles or features
- **Contact Cards:** Contact information cards with icons
- **Treatments Section:** Automatically display treatments
- **Locations Section:** Automatically display locations
- **FAQ Section:** Display selected FAQs
- **Call to Action:** Conversion-focused sections with buttons
- **Legal Content:** Privacy policy and terms sections

**Screenshot Placeholder:** Layout builder showing different block types

---

### Posts (Blog)

Blog posts for news, updates, and articles.

#### Creating a Blog Post
1. Navigate to **Posts** in the sidebar
2. Click **Create New Post**
3. Fill in the fields:
   - **Title:** Post title
   - **Slug:** URL-friendly version (auto-generated or custom)
   - **Author:** Select from users list
   - **Published Date:** When the post goes live
   - **Hero Image:** Featured image for the post
   - **Content:** Main post content (use Rich Text Editor)
   - **Excerpt:** Short summary for listings
   - **Status:** Draft or Published
   - **Categories:** Assign relevant categories

**Screenshot Placeholder:** Blog post editor with content

---

### Treatments

Medical treatments and services offered.

#### Adding a Treatment
1. Go to **Treatments** section
2. Click **Create New Treatment**
3. Complete all sections:

**Basic Information:**
- **Name:** Full treatment name
- **Short Name:** Abbreviated version
- **Slug:** URL path (auto-generated)
- **Category:** Select treatment category
- **Icon:** Icon identifier
- **Tagline:** Brief description
- **Description:** Detailed information (Rich Text)

**Pricing:**
- **USA Price Min/Max:** Price range in USD
- **India Price Min/Max:** Price range in INR
- **Savings Percent:** Percentage saved

**Duration & Recovery:**
- Treatment duration
- Stay required
- Number of sessions
- Recovery timeline (immediate, short-term, long-term)

**Additional Information:**
- **Procedure Steps:** Step-by-step process
- **Materials:** Materials used
- **Warranty:** Warranty information
- **FAQs:** Treatment-specific questions and answers
- **Featured:** Check to highlight on homepage

**Screenshot Placeholder:** Treatment form showing pricing and duration sections

---

### Locations

Physical locations where services are provided.

#### Adding a Location
1. Navigate to **Locations**
2. Click **Create New Location**
3. Enter location details:
   - Name and slug
   - Address information
   - Contact details
   - Description
   - Operating hours
   - Associated clinics

**Screenshot Placeholder:** Location entry form

---

## Media Management

### Uploading Images
1. Go to **Media** in the sidebar
2. Click **Create New**
3. Click **Choose File** or drag and drop
4. **IMPORTANT:** Always add **Alt Text** for accessibility and SEO
5. Click **Save**

### Image Optimization
The system automatically creates three sizes:
- **Thumbnail:** 300x300px (for lists and grids)
- **Card:** 600x400px (for cards and previews)
- **Hero:** 1920x1080px (for full-width sections)

**Screenshot Placeholder:** Media upload interface with alt text field highlighted

### Best Practices for Images
- Use descriptive filenames (e.g., "dental-implant-procedure.jpg" not "IMG_1234.jpg")
- Keep file sizes under 2MB for optimal loading
- Use JPG for photos, PNG for graphics with transparency
- Always provide meaningful alt text

---

## Rich Text Editor & Hyperlinks

### Basic Formatting
The rich text editor supports:
- Bold, italic, underline text
- Headings (H2, H3, H4)
- Bullet and numbered lists
- Block quotes
- Code blocks

**Screenshot Placeholder:** Rich text editor toolbar

### Creating Hyperlinks (IMPORTANT - Recent Update!)

#### Method 1: External Links
1. Select the text you want to link
2. Click the **Link** button in the toolbar (chain icon)
3. Enter the full URL (e.g., `https://example.com`)
4. Click **Apply**

**Screenshot Placeholder:** Link dialog box with external URL

#### Method 2: Internal Links to Pages/Collections
1. Select your text
2. Click the **Link** button
3. Click **Link to Payload document**
4. Choose the collection type:
   - Pages
   - Posts
   - Treatments
   - Locations
5. Select the specific item from the dropdown
6. Click **Apply**

**Screenshot Placeholder:** Internal link selector showing collection dropdown

#### Link Best Practices
- Use descriptive link text (not "click here")
- Open external links in new tab when appropriate
- Test all links after publishing
- Use internal links to improve SEO and user navigation

### Adding Media to Rich Text
1. Place cursor where you want the image
2. Click the **Image** button
3. Select from existing media or upload new
4. Adjust alignment (left, center, right)
5. Add caption if needed

**Screenshot Placeholder:** Image insertion in rich text editor

---

## Global Settings

### Site Settings

Core configuration for the entire website.

1. Navigate to **Globals** → **Site Settings**
2. Configure:

**Basic Information:**
- **Site Name:** Your website name
- **Site Description:** Brief description for SEO
- **Logo:** Upload logo image
- **Favicon:** Small icon for browser tabs

**Contact Information:**
- **Contact Email:** Main contact email
- **Contact Phone:** Primary phone number
- **WhatsApp Number:** WhatsApp contact

**Social Media:**
- Facebook URL
- Instagram URL
- YouTube URL
- LinkedIn URL

**Announcements:**
- Enable/disable site-wide announcement banner
- Set announcement text and link

**Security Settings:**
- **Require 2FA:** Force all users to enable Two-Factor Authentication

**Screenshot Placeholder:** Site Settings form with all sections visible

---

### Navigation

Configure the main website navigation menu.

1. Go to **Globals** → **Navigation**
2. Add menu items:
   - **Label:** Display text
   - **Link:** URL or internal page
   - **Sub-items:** Create dropdown menus
3. Drag to reorder items
4. Save changes

**Screenshot Placeholder:** Navigation builder with nested menu items

---

### Footer

Customize footer content and links.

1. Navigate to **Globals** → **Footer**
2. Configure footer sections:
   - Company information
   - Quick links
   - Contact details
   - Social media links
   - Copyright text

**Screenshot Placeholder:** Footer configuration interface

---

## User Management

### Creating New Users
1. Go to **Users** section
2. Click **Create New User**
3. Enter user details:
   - **Email:** User's email (used for login)
   - **Password:** Set initial password
   - **Name:** Display name
   - **Role:** Admin, Editor, or Viewer
4. Save user

### User Roles
- **Admin:** Full access to all features
- **Editor:** Can create and edit content
- **Viewer:** Read-only access

**Screenshot Placeholder:** User creation form with role selector

---

## Two-Factor Authentication

### Enabling 2FA (User Level)
1. Click your profile icon (top right)
2. Select **Two-Factor Setup**
3. Scan QR code with Google Authenticator app
4. Enter the 6-digit code to verify
5. Save backup codes securely

**Screenshot Placeholder:** 2FA setup screen with QR code

### Enforcing 2FA (System Level)
1. Go to **Site Settings**
2. Under **Security Settings**
3. Check **Require Two-Factor Authentication**
4. Save changes

All users will be required to set up 2FA on next login.

---

## SEO Management

### Page-Level SEO
Each page, post, treatment, and location has SEO fields:
- **Meta Title:** Page title for search results
- **Meta Description:** Summary for search results
- **Open Graph Image:** Image for social media sharing

**Screenshot Placeholder:** SEO fields in content editor

### Best Practices
- Keep titles under 60 characters
- Descriptions should be 150-160 characters
- Use relevant keywords naturally
- Each page should have unique meta information

---

## Best Practices

### Content Creation
1. **Plan your content structure** before creating pages
2. **Use consistent formatting** across similar pages
3. **Optimize images** before uploading
4. **Save drafts frequently** to prevent data loss
5. **Preview before publishing** to check formatting

### Workflow Tips
1. **Use drafts** for content that needs review
2. **Schedule posts** with future published dates
3. **Organize media** with descriptive names
4. **Regular backups** of important content
5. **Test on mobile** after publishing

### Security
1. **Use strong passwords** (min 12 characters)
2. **Enable 2FA** for all admin accounts
3. **Regular password updates** (every 90 days)
4. **Limit admin access** to necessary users only
5. **Log out** when finished working

---

## Troubleshooting

### Common Issues and Solutions

#### Cannot Save Content
- Check internet connection
- Ensure all required fields are filled
- Try saving as draft first
- Clear browser cache

#### Images Not Displaying
- Verify image was uploaded successfully
- Check alt text is provided
- Ensure correct image size is selected
- Clear CDN cache if using

#### Links Not Working
- Verify URL is correct
- Check if internal page is published
- Test in incognito/private browsing
- Ensure proper permissions

#### Login Issues
- Reset password if forgotten
- Check 2FA code is current (refreshes every 30 seconds)
- Verify account is active
- Contact admin if locked out

#### Rich Text Editor Problems
- Refresh the page
- Clear browser cache
- Try different browser
- Disable browser extensions

### Getting Help
- Contact your system administrator
- Check the documentation at `/admin/help`
- Submit a support ticket
- Emergency contact: [admin email/phone]

---

## Appendix: Keyboard Shortcuts

- **Ctrl/Cmd + S:** Save current item
- **Ctrl/Cmd + Z:** Undo
- **Ctrl/Cmd + Y:** Redo
- **Ctrl/Cmd + B:** Bold text
- **Ctrl/Cmd + I:** Italic text
- **Ctrl/Cmd + K:** Add link
- **Esc:** Cancel/close dialog

---

## Version History

- **Version 1.0:** Initial manual creation
- **Latest Update:** Added hyperlink creation instructions for collections and pages
- **System Version:** KTree CMS powered by Payload CMS

---

*This manual is a living document and will be updated as new features are added to the system.*

**Note for Screenshots:** When adding screenshots, ensure they:
1. Show the actual interface with sample data
2. Have arrows or highlights pointing to important elements
3. Include captions explaining what the screenshot shows
4. Are updated whenever the interface changes significantly

For screenshot generation, use tools like:
- Snagit or ShareX for capturing
- Add annotations with arrows and text
- Save as optimized PNG or JPG
- Name files descriptively (e.g., "rich-text-hyperlink-dialog.png")