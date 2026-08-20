#!/usr/bin/env python3

import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from PIL import Image
import glob

# Create document
doc = Document()

# Set up custom styles
styles = doc.styles

# Title style
title_style = styles.add_style('CustomTitle', WD_STYLE_TYPE.PARAGRAPH)
title_style.font.name = 'Arial'
title_style.font.size = Pt(24)
title_style.font.bold = True
title_style.font.color.rgb = RGBColor(0, 0, 0)

# Heading 1 style
h1_style = styles.add_style('CustomH1', WD_STYLE_TYPE.PARAGRAPH)
h1_style.font.name = 'Arial'
h1_style.font.size = Pt(18)
h1_style.font.bold = True
h1_style.font.color.rgb = RGBColor(0, 51, 102)

# Heading 2 style
h2_style = styles.add_style('CustomH2', WD_STYLE_TYPE.PARAGRAPH)
h2_style.font.name = 'Arial'
h2_style.font.size = Pt(14)
h2_style.font.bold = True
h2_style.font.color.rgb = RGBColor(51, 102, 153)

# Add title
title = doc.add_paragraph('KTree CMS Admin User Manual', style='CustomTitle')
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Add subtitle
subtitle = doc.add_paragraph('Comprehensive Guide for Content Management')
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph()

# Table of Contents
doc.add_paragraph('Table of Contents', style='CustomH1')
toc = [
    '1. Getting Started',
    '2. Dashboard Overview', 
    '3. Content Management',
    '   3.1 Pages',
    '   3.2 Posts (Blog)',
    '   3.3 Treatments',
    '   3.4 Locations',
    '   3.5 Clinics',
    '   3.6 Media Management',
    '4. Rich Text Editor & Hyperlinks',
    '5. Global Settings',
    '   5.1 Site Settings',
    '   5.2 Navigation',
    '   5.3 Footer',
    '   5.4 Hero Content',
    '   5.5 Tracking & Analytics',
    '6. User Management',
    '7. Best Practices',
    '8. Troubleshooting'
]
for item in toc:
    doc.add_paragraph(item)

doc.add_page_break()

# Helper function to add images with error handling
def add_screenshot(doc, image_path, caption, width=6):
    try:
        if os.path.exists(image_path):
            # Add the image
            doc.add_picture(image_path, width=Inches(width))
            
            # Add caption
            caption_para = doc.add_paragraph(caption)
            caption_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            caption_para.runs[0].font.italic = True
            caption_para.runs[0].font.size = Pt(10)
            doc.add_paragraph()
            return True
        else:
            doc.add_paragraph(f'[Screenshot not found: {os.path.basename(image_path)}]')
            return False
    except Exception as e:
        doc.add_paragraph(f'[Error loading image: {str(e)}]')
        return False

# Screenshots directory
screenshots_dir = os.path.join(os.path.dirname(__file__), '../docs/screenshots')

# Section 1: Getting Started
doc.add_paragraph('1. Getting Started', style='CustomH1')
doc.add_paragraph(
    'Welcome to the KTree CMS Admin Manual. This comprehensive guide will walk you through '
    'all the features and functionalities of the content management system.'
)
doc.add_paragraph()

doc.add_paragraph('Accessing the Admin Panel', style='CustomH2')
doc.add_paragraph(
    '1. Navigate to your website URL followed by /admin (e.g., https://yoursite.com/admin)\n'
    '2. Enter your email and password\n'
    '3. If Two-Factor Authentication is enabled, enter the 6-digit code from Google Authenticator'
)
doc.add_paragraph()

# Add login screenshot
add_screenshot(doc, f'{screenshots_dir}/01-login-screen.png', 
              'Figure 1: KTree CMS Login Screen')

doc.add_paragraph('First Time Login', style='CustomH2')
doc.add_paragraph(
    '• Your administrator will provide you with login credentials\n'
    '• Change your password immediately after first login\n'
    '• Set up Two-Factor Authentication if required by your organization'
)
doc.add_paragraph()

# Section 2: Dashboard Overview
doc.add_page_break()
doc.add_paragraph('2. Dashboard Overview', style='CustomH1')
doc.add_paragraph(
    'The dashboard is your central hub for managing all content. It provides quick access to '
    'all collections, global settings, and administrative tools.'
)
doc.add_paragraph()

doc.add_paragraph('Key Interface Elements:', style='CustomH2')
doc.add_paragraph(
    '• Left Sidebar: Navigation menu with all collections and global settings\n'
    '• Main Content Area: Lists, forms, and content editors\n'
    '• Top Bar: User profile, logout, and quick actions\n'
    '• Search: Global search functionality across all content'
)
doc.add_paragraph()

add_screenshot(doc, f'{screenshots_dir}/current-state.png', 
              'Figure 2: Dashboard Overview')

# Section 3: Content Management
doc.add_page_break()
doc.add_paragraph('3. Content Management', style='CustomH1')

# Pages
doc.add_paragraph('3.1 Pages', style='CustomH2')
doc.add_paragraph(
    'Pages are the main content sections of your website such as About Us, Contact, Services, etc. '
    'Each page can have a custom layout using various content blocks.'
)
doc.add_paragraph()

doc.add_paragraph('Creating a New Page:')
doc.add_paragraph(
    '1. Click "Pages" in the left sidebar\n'
    '2. Click "Create New Page" button\n'
    '3. Fill in the required fields:\n'
    '   • Title: The page title (e.g., "About Us")\n'
    '   • Slug: URL path (e.g., "about-us"). Use "home" for the homepage\n'
    '   • Status: Set to "Published" when ready to go live\n'
    '4. Add content blocks using the Layout builder\n'
    '5. Click "Save" or "Save Draft"'
)
doc.add_paragraph()

add_screenshot(doc, f'{screenshots_dir}/04-pages.png', 
              'Figure 3: Pages Collection List')

doc.add_paragraph('Available Layout Blocks:', style='CustomH2')
doc.add_paragraph(
    '• Hero: Eye-catching header with image and call-to-action buttons\n'
    '• Rich Content: Text sections with full formatting options\n'
    '• Highlight: Emphasized quotes or important information\n'
    '• Stats Grid: Display statistics in a grid format\n'
    '• Principles List: Numbered list of principles or features\n'
    '• Contact Cards: Contact information cards with icons\n'
    '• Treatments Section: Automatically display treatments\n'
    '• Locations Section: Automatically display locations\n'
    '• FAQ Section: Display selected frequently asked questions\n'
    '• Call to Action: Conversion-focused sections with buttons\n'
    '• Legal Content: Privacy policy and terms sections'
)
doc.add_paragraph()

# Posts
doc.add_page_break()
doc.add_paragraph('3.2 Posts (Blog)', style='CustomH2')
doc.add_paragraph(
    'The Posts collection manages your blog content, news updates, and articles. '
    'Posts support categories, featured images, and rich text content.'
)
doc.add_paragraph()

doc.add_paragraph('Creating a Blog Post:')
doc.add_paragraph(
    '1. Navigate to "Posts" in the sidebar\n'
    '2. Click "Create New Post"\n'
    '3. Fill in the fields:\n'
    '   • Title: Post title\n'
    '   • Slug: URL-friendly version (auto-generated or custom)\n'
    '   • Author: Select from users list\n'
    '   • Published Date: When the post goes live\n'
    '   • Hero Image: Featured image for the post\n'
    '   • Content: Main post content using Rich Text Editor\n'
    '   • Excerpt: Short summary for listings\n'
    '   • Status: Draft or Published\n'
    '   • Categories: Assign relevant categories'
)
doc.add_paragraph()

add_screenshot(doc, f'{screenshots_dir}/05-posts.png', 
              'Figure 4: Posts Collection')

# Treatments
doc.add_page_break()
doc.add_paragraph('3.3 Treatments', style='CustomH2')
doc.add_paragraph(
    'The Treatments collection manages all medical treatments and services offered. '
    'Each treatment includes detailed information, pricing, procedures, and recovery details.'
)
doc.add_paragraph()

doc.add_paragraph('Treatment Information Fields:')
doc.add_paragraph('Basic Information:', style='CustomH2')
doc.add_paragraph(
    '• Name: Full treatment name\n'
    '• Short Name: Abbreviated version for compact displays\n'
    '• Slug: URL path (auto-generated from name)\n'
    '• Category: Select treatment category\n'
    '• Icon: Icon identifier for visual representation\n'
    '• Tagline: Brief description\n'
    '• Description: Detailed information using Rich Text Editor'
)
doc.add_paragraph()

doc.add_paragraph('Pricing Information:', style='CustomH2')
doc.add_paragraph(
    '• USA Price Min/Max: Price range in USD\n'
    '• India Price Min/Max: Price range in INR\n'
    '• Savings Percent: Percentage saved compared to USA prices'
)
doc.add_paragraph()

doc.add_paragraph('Duration & Recovery:', style='CustomH2')
doc.add_paragraph(
    '• Treatment duration\n'
    '• Stay required in days\n'
    '• Number of sessions needed\n'
    '• Recovery timeline:\n'
    '   - Immediate recovery expectations\n'
    '   - Short-term recovery (1-4 weeks)\n'
    '   - Long-term recovery (1-6 months)'
)
doc.add_paragraph()

add_screenshot(doc, f'{screenshots_dir}/06-treatments.png', 
              'Figure 5: Treatments Collection')

# Clinics
doc.add_page_break()
doc.add_paragraph('3.5 Clinics', style='CustomH2')
doc.add_paragraph(
    'The Clinics collection manages partner clinics and healthcare facilities. '
    'Each clinic entry includes contact information, services offered, and location details.'
)
doc.add_paragraph()

doc.add_paragraph('Clinic Information Fields:')
doc.add_paragraph(
    '• Name: Clinic or hospital name\n'
    '• Address: Full physical address\n'
    '• Phone: Primary contact number\n'
    '• Email: Contact email address\n'
    '• Services: List of treatments offered\n'
    '• Description: Detailed information about the facility\n'
    '• Certifications: Accreditations and certifications\n'
    '• Status: Active or Inactive'
)
doc.add_paragraph()

# Media Management
doc.add_page_break()
doc.add_paragraph('3.6 Media Management', style='CustomH2')
doc.add_paragraph(
    'The Media collection handles all images and files used throughout your website. '
    'The system automatically optimizes images for different display sizes.'
)
doc.add_paragraph()

doc.add_paragraph('Uploading Images:')
doc.add_paragraph(
    '1. Go to "Media" in the sidebar\n'
    '2. Click "Create New"\n'
    '3. Click "Choose File" or drag and drop your image\n'
    '4. IMPORTANT: Always add Alt Text for accessibility and SEO\n'
    '5. Click "Save"'
)
doc.add_paragraph()

doc.add_paragraph('Image Optimization:', style='CustomH2')
doc.add_paragraph(
    'The system automatically creates three optimized sizes:\n'
    '• Thumbnail: 300x300px for lists and grids\n'
    '• Card: 600x400px for cards and previews\n'
    '• Hero: 1920x1080px for full-width sections'
)
doc.add_paragraph()

doc.add_paragraph('Best Practices for Images:', style='CustomH2')
doc.add_paragraph(
    '• Use descriptive filenames (e.g., "dental-implant-procedure.jpg")\n'
    '• Keep file sizes under 2MB for optimal loading\n'
    '• Use JPG for photos, PNG for graphics with transparency\n'
    '• Always provide meaningful alt text for accessibility\n'
    '• Organize images with consistent naming conventions'
)
doc.add_paragraph()

add_screenshot(doc, f'{screenshots_dir}/07-media.png', 
              'Figure 7: Media Library')

# Rich Text Editor & Hyperlinks
doc.add_page_break()
doc.add_paragraph('4. Rich Text Editor & Hyperlinks', style='CustomH1')
doc.add_paragraph(
    'The rich text editor provides comprehensive formatting options for creating engaging content. '
    'Recent updates have enhanced the hyperlink functionality for better internal linking.'
)
doc.add_paragraph()

doc.add_paragraph('Basic Formatting Options:', style='CustomH2')
doc.add_paragraph(
    '• Bold, italic, underline text\n'
    '• Headings (H2, H3, H4)\n'
    '• Bullet and numbered lists\n'
    '• Block quotes for testimonials\n'
    '• Code blocks for technical content\n'
    '• Tables for structured data\n'
    '• Horizontal rules for section breaks'
)
doc.add_paragraph()

doc.add_paragraph('Creating Hyperlinks (NEW FEATURE)', style='CustomH2')
doc.add_paragraph('Method 1: External Links')
doc.add_paragraph(
    '1. Select the text you want to link\n'
    '2. Click the Link button in the toolbar (chain icon)\n'
    '3. Enter the full URL (e.g., https://example.com)\n'
    '4. Optional: Check "Open in new tab" for external links\n'
    '5. Click "Apply"'
)
doc.add_paragraph()

doc.add_paragraph('Method 2: Internal Links to Collections')
doc.add_paragraph(
    '1. Select your text\n'
    '2. Click the Link button\n'
    '3. Click "Link to Payload document"\n'
    '4. Choose the collection type:\n'
    '   • Pages - Link to static pages\n'
    '   • Posts - Link to blog posts\n'
    '   • Treatments - Link to treatment pages\n'
    '   • Locations - Link to location pages\n'
    '5. Select the specific item from the dropdown\n'
    '6. Click "Apply"'
)
doc.add_paragraph()

doc.add_paragraph('Link Best Practices:', style='CustomH2')
doc.add_paragraph(
    '• Use descriptive link text (avoid "click here")\n'
    '• Open external links in new tabs\n'
    '• Test all links after publishing\n'
    '• Use internal links to improve SEO\n'
    '• Keep link text concise and relevant\n'
    '• Ensure links are visually distinct from regular text'
)
doc.add_paragraph()

# Global Settings
doc.add_page_break()
doc.add_paragraph('5. Global Settings', style='CustomH1')
doc.add_paragraph(
    'Global settings control site-wide configurations that appear across all pages. '
    'The system includes five main global configuration areas: Site Settings, Navigation, '
    'Footer, Hero Content, and Tracking & Analytics.'
)
doc.add_paragraph()

doc.add_paragraph('5.1 Site Settings', style='CustomH2')
doc.add_paragraph('Basic Information:')
doc.add_paragraph(
    '• Site Name: Your website name\n'
    '• Site Description: Brief description for SEO\n'
    '• Logo: Upload logo image\n'
    '• Favicon: Small icon for browser tabs'
)
doc.add_paragraph()

doc.add_paragraph('Contact Information:')
doc.add_paragraph(
    '• Contact Email: Main contact email\n'
    '• Contact Phone: Primary phone number\n'
    '• WhatsApp Number: WhatsApp contact for instant messaging'
)
doc.add_paragraph()

doc.add_paragraph('Social Media Links:')
doc.add_paragraph(
    '• Facebook URL\n'
    '• Instagram URL\n'
    '• YouTube URL\n'
    '• LinkedIn URL'
)
doc.add_paragraph()

doc.add_paragraph('Security Settings:')
doc.add_paragraph(
    '• Require 2FA: Force all users to enable Two-Factor Authentication\n'
    '• Password Policy: Set minimum password requirements\n'
    '• Session Timeout: Auto-logout after inactivity'
)
doc.add_paragraph()

add_screenshot(doc, f'{screenshots_dir}/08-site-settings.png', 
              'Figure 8: Site Settings Configuration')

# Navigation Settings
doc.add_page_break()
doc.add_paragraph('5.2 Navigation', style='CustomH2')
doc.add_paragraph(
    'Configure the main navigation menu structure. Add menu items, set their order, '
    'and link them to pages, external URLs, or other content.'
)
doc.add_paragraph()

add_screenshot(doc, f'{screenshots_dir}/navigation-settings.png', 
              'Figure 9: Navigation Settings', width=6)

# Footer Settings  
doc.add_paragraph('5.3 Footer', style='CustomH2')
doc.add_paragraph(
    'Manage footer content including links, copyright text, and additional information '
    'that appears at the bottom of every page.'
)
doc.add_paragraph()

add_screenshot(doc, f'{screenshots_dir}/footer-settings.png', 
              'Figure 10: Footer Settings', width=6)

# Hero Content
doc.add_paragraph('5.4 Hero Content', style='CustomH2')
doc.add_paragraph(
    'Configure hero sections and banner content that appears prominently on key pages. '
    'Manage headlines, call-to-action buttons, and background images for maximum impact.'
)
doc.add_paragraph()

doc.add_paragraph('Hero Content Elements:')
doc.add_paragraph(
    '• Headline: Main hero text\n'
    '• Subheadline: Supporting text\n'
    '• Call-to-Action: Primary button text and link\n'
    '• Background Image: Hero section background\n'
    '• Overlay Settings: Text contrast controls'
)
doc.add_paragraph()

# Tracking & Analytics
doc.add_paragraph('5.5 Tracking & Analytics', style='CustomH2')
doc.add_paragraph(
    'Configure tracking codes and analytics integrations to monitor site performance '
    'and user behavior.'
)
doc.add_paragraph()

doc.add_paragraph('Available Integrations:')
doc.add_paragraph(
    '• Google Analytics 4: Track user interactions and conversions\n'
    '• Google Tag Manager: Manage all tracking codes in one place\n'
    '• Facebook Pixel: Track ad performance and retargeting\n'
    '• Custom Scripts: Add any additional tracking codes'
)
doc.add_paragraph()

# User Management
doc.add_page_break()
doc.add_paragraph('6. User Management', style='CustomH1')
doc.add_paragraph(
    'Manage user accounts and permissions for accessing the admin panel.'
)
doc.add_paragraph()

doc.add_paragraph('Creating New Users:', style='CustomH2')
doc.add_paragraph(
    '1. Go to "Users" section\n'
    '2. Click "Create New User"\n'
    '3. Enter user details:\n'
    '   • Email: User\'s email (used for login)\n'
    '   • Password: Set initial password\n'
    '   • Name: Display name\n'
    '   • Role: Admin, Editor, or Viewer\n'
    '4. Save user'
)
doc.add_paragraph()

doc.add_paragraph('User Roles:', style='CustomH2')
doc.add_paragraph(
    '• Admin: Full access to all features and settings\n'
    '• Editor: Can create and edit content but cannot change settings\n'
    '• Viewer: Read-only access to view content'
)
doc.add_paragraph()

doc.add_paragraph('Two-Factor Authentication Setup:', style='CustomH2')
doc.add_paragraph(
    '1. Click your profile icon (top right)\n'
    '2. Select "Two-Factor Setup"\n'
    '3. Scan QR code with Google Authenticator app\n'
    '4. Enter the 6-digit code to verify\n'
    '5. Save backup codes securely'
)
doc.add_paragraph()

# Best Practices
doc.add_page_break()
doc.add_paragraph('7. Best Practices', style='CustomH1')

doc.add_paragraph('Content Creation:', style='CustomH2')
doc.add_paragraph(
    '• Plan your content structure before creating pages\n'
    '• Use consistent formatting across similar pages\n'
    '• Optimize images before uploading\n'
    '• Save drafts frequently to prevent data loss\n'
    '• Preview before publishing to check formatting\n'
    '• Use meaningful URLs (slugs) for better SEO\n'
    '• Keep content concise and scannable'
)
doc.add_paragraph()

doc.add_paragraph('Workflow Tips:', style='CustomH2')
doc.add_paragraph(
    '• Use drafts for content that needs review\n'
    '• Schedule posts with future published dates\n'
    '• Organize media with descriptive names\n'
    '• Regular backups of important content\n'
    '• Test on mobile after publishing\n'
    '• Use categories to organize content\n'
    '• Set up redirects when changing URLs'
)
doc.add_paragraph()

doc.add_paragraph('Security:', style='CustomH2')
doc.add_paragraph(
    '• Use strong passwords (min 12 characters)\n'
    '• Enable 2FA for all admin accounts\n'
    '• Regular password updates (every 90 days)\n'
    '• Limit admin access to necessary users only\n'
    '• Log out when finished working\n'
    '• Don\'t share login credentials\n'
    '• Monitor user activity logs'
)
doc.add_paragraph()

doc.add_paragraph('SEO Optimization:', style='CustomH2')
doc.add_paragraph(
    '• Write unique meta descriptions for each page\n'
    '• Use relevant keywords naturally in content\n'
    '• Create descriptive alt text for all images\n'
    '• Build internal links between related content\n'
    '• Keep URLs short and descriptive\n'
    '• Update content regularly\n'
    '• Monitor page loading speeds'
)
doc.add_paragraph()

# Troubleshooting
doc.add_page_break()
doc.add_paragraph('8. Troubleshooting', style='CustomH1')

doc.add_paragraph('Common Issues and Solutions:', style='CustomH2')

doc.add_paragraph('Cannot Save Content:')
doc.add_paragraph(
    '• Check internet connection\n'
    '• Ensure all required fields are filled\n'
    '• Try saving as draft first\n'
    '• Clear browser cache\n'
    '• Check for validation errors'
)
doc.add_paragraph()

doc.add_paragraph('Images Not Displaying:')
doc.add_paragraph(
    '• Verify image was uploaded successfully\n'
    '• Check alt text is provided\n'
    '• Ensure correct image size is selected\n'
    '• Clear CDN cache if using\n'
    '• Check file format compatibility'
)
doc.add_paragraph()

doc.add_paragraph('Links Not Working:')
doc.add_paragraph(
    '• Verify URL is correct\n'
    '• Check if internal page is published\n'
    '• Test in incognito/private browsing\n'
    '• Ensure proper permissions\n'
    '• Check for typos in slug/URL'
)
doc.add_paragraph()

doc.add_paragraph('Login Issues:')
doc.add_paragraph(
    '• Reset password if forgotten\n'
    '• Check 2FA code is current (refreshes every 30 seconds)\n'
    '• Verify account is active\n'
    '• Clear browser cookies\n'
    '• Contact admin if locked out'
)
doc.add_paragraph()

doc.add_paragraph('Rich Text Editor Problems:')
doc.add_paragraph(
    '• Refresh the page\n'
    '• Clear browser cache\n'
    '• Try different browser\n'
    '• Disable browser extensions\n'
    '• Check for JavaScript errors'
)
doc.add_paragraph()

doc.add_paragraph('Getting Help:', style='CustomH2')
doc.add_paragraph(
    '• Contact your system administrator\n'
    '• Check the documentation at /admin/help\n'
    '• Submit a support ticket\n'
    '• Review training materials\n'
    '• Join user community forums'
)
doc.add_paragraph()

# Keyboard Shortcuts
doc.add_page_break()
doc.add_paragraph('Appendix: Keyboard Shortcuts', style='CustomH1')
doc.add_paragraph(
    'Ctrl/Cmd + S: Save current item\n'
    'Ctrl/Cmd + Z: Undo\n'
    'Ctrl/Cmd + Y: Redo\n'
    'Ctrl/Cmd + B: Bold text\n'
    'Ctrl/Cmd + I: Italic text\n'
    'Ctrl/Cmd + K: Add link\n'
    'Ctrl/Cmd + /: Show keyboard shortcuts\n'
    'Esc: Cancel/close dialog\n'
    'Tab: Navigate between fields\n'
    'Shift + Tab: Navigate backwards'
)
doc.add_paragraph()

# Version Information
doc.add_paragraph('Version Information', style='CustomH1')
doc.add_paragraph(
    'Manual Version: 1.0\n'
    'Last Updated: February 2024\n'
    'System: KTree CMS powered by Payload CMS\n'
    'Support: admin@ktree.com'
)
doc.add_paragraph()

# Save the document
output_path = os.path.join(os.path.dirname(__file__), '../docs/KTree_CMS_Admin_Manual.docx')
doc.save(output_path)

print(f"✅ Document generated successfully!")
print(f"📄 Saved to: {output_path}")
print(f"📊 Document contains {len(doc.paragraphs)} paragraphs")
print(f"🖼️  Screenshots included from: {screenshots_dir}")