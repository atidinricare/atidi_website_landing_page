-- "Our Team" demo page, inserted with slug 'our-team2'.
--
-- Page blocks live across several relational tables, so this inserts the page
-- row first and then each block against the returned id.
--
-- Safe to re-run: does nothing if a page with this slug already exists.
--
-- Run with:   psql "$DATABASE_URI" -f scripts/seed-our-team2-page.sql
--
-- Writing straight to the database bypasses Payload's cache revalidation, so
-- redeploy (or re-save the page in the admin) afterwards for it to appear.
--
-- The Pages collection has drafts enabled, so Payload expects a matching row in
-- _pages_v for every page — the admin Pages list queries with draft=true and
-- reads from that table. Without it a page renders on the site but is invisible
-- in the admin, so the final statement below creates it.
--
-- The version row carries the scalar fields only, not copies of the blocks.
-- That is all the list view needs; the admin reads block content from the main
-- pages_blocks_* tables.

DO $$
DECLARE pid integer;
BEGIN
  IF EXISTS (SELECT 1 FROM pages WHERE slug = 'our-team2') THEN
    RAISE NOTICE 'Page our-team2 already exists - nothing to do.';
    RETURN;
  END IF;

  INSERT INTO pages (title, slug, status, _status, updated_at, created_at)
  VALUES ('Our Team', 'our-team2', 'published', 'published', now(), now())
  RETURNING id INTO pid;

  -- 1. hero
  INSERT INTO pages_blocks_hero
    (_order,_parent_id,_path,id,eyebrow,headline,subheadline,
     cta_primary_label,cta_primary_link,cta_secondary_label,cta_secondary_link)
  VALUES (1,pid,'layout','0a2e000000000000000000a1','Who We Are','The people behind your care.','Every Atidi journey is coordinated by a dedicated care manager and delivered by MDS-qualified specialists at our partner clinics.',
     'Book an Appointment','https://app.atidinricare.com/','Contact Us','/contact-us');

  -- 2. richContent
  INSERT INTO pages_blocks_rich_content
    (_order,_parent_id,_path,id,heading,content,layout,sidebar_label)
  VALUES (2,pid,'layout','0a2e000000000000000000a2','Care that follows you home.',
     '{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Atidi was built around a simple idea: travelling for treatment should not mean travelling alone. From your first consultation to your follow-up care after you return, the same team stays with you.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textFormat": 0}, {"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Replace this text in the admin with your own introduction — this page is fully editable under Collections -> Pages -> Our Team.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textFormat": 0}], "direction": "ltr"}}'::jsonb,'withSidebar','Our Approach');

  -- 3. principlesList
  INSERT INTO pages_blocks_principles_list (_order,_parent_id,_path,id,heading)
  VALUES (3,pid,'layout','0a2e000000000000000000a3','How the team is structured');

  INSERT INTO pages_blocks_principles_list_items (_order,_parent_id,id,title,description)
  VALUES
    (1,'0a2e000000000000000000a3','0a2e000000000000000000b1','Care Managers','{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "A qualified dentist assigned as your single point of contact, coordinating scheduling, treatment and follow-up.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textFormat": 0}], "direction": "ltr"}}'::jsonb),
    (2,'0a2e000000000000000000a3','0a2e000000000000000000b2','MDS-Qualified Specialists','{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Every procedure is performed by specialists with advanced qualifications at vetted partner clinics.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textFormat": 0}], "direction": "ltr"}}'::jsonb),
    (3,'0a2e000000000000000000a3','0a2e000000000000000000b3','US Follow-Up Network','{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Affiliated clinics across the USA so your care continues seamlessly after you return.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textFormat": 0}], "direction": "ltr"}}'::jsonb);

  -- 4. contactCards
  INSERT INTO pages_blocks_contact_cards (_order,_parent_id,_path,id)
  VALUES (4,pid,'layout','0a2e000000000000000000a4');

  INSERT INTO pages_blocks_contact_cards_cards (_order,_parent_id,id,icon,title,content,link,link_label)
  VALUES
    (1,'0a2e000000000000000000a4','0a2e000000000000000000c1','Users','Team Member Name','{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Role / specialisation. Replace this card in the admin with a real team member.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textFormat": 0}], "direction": "ltr"}}'::jsonb,'/contact-us','Get in touch'),
    (2,'0a2e000000000000000000a4','0a2e000000000000000000c2','Heart','Team Member Name','{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Role / specialisation. Duplicate or remove cards as needed.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textFormat": 0}], "direction": "ltr"}}'::jsonb,'/contact-us','Get in touch'),
    (3,'0a2e000000000000000000a4','0a2e000000000000000000c3','Award','Team Member Name','{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Role / specialisation. Icons are set per card in the admin.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textFormat": 0}], "direction": "ltr"}}'::jsonb,'/contact-us','Get in touch');

  -- 5. ctaBlock
  INSERT INTO pages_blocks_cta_block
    (_order,_parent_id,_path,id,heading,subheading,button_label,button_link,style)
  VALUES (5,pid,'layout','0a2e000000000000000000a5','Talk to a care manager','Free teleconsultation, available 24/7.','Book an Appointment','https://app.atidinricare.com/','premium');

  -- 6. version record, required for the page to appear in the admin Pages list
  INSERT INTO _pages_v
    (parent_id, version_title, version_slug, version_status, version__status,
     version_updated_at, version_created_at, created_at, updated_at, latest)
  SELECT p.id, p.title, p.slug,
         p.status::text::enum__pages_v_version_status,
         'published'::enum__pages_v_version_status,
         p.updated_at, p.created_at, now(), now(), true
  FROM pages p WHERE p.id = pid;

  RAISE NOTICE 'Created page our-team2 with id %', pid;
END $$;
