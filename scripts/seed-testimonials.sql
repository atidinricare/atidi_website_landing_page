-- The 8 sample testimonials from the dev instance.
--
-- Safe to re-run: each INSERT is skipped when a testimonial with the same
-- patient_name already exists (there is no unique constraint on the column,
-- so the guard is an explicit NOT EXISTS rather than ON CONFLICT).
--
-- Run with:   psql "$DATABASE_URI" -f scripts/seed-testimonials.sql
--
-- status MUST be 'published' — the home page only renders published rows.
-- After running this, redeploy the app or re-save any testimonial in the admin
-- so the cached home page is regenerated.

INSERT INTO testimonials (patient_name, location, rating, status, featured, quote)
SELECT 'Rajesh Patel', 'New Jersey, USA', 5, 'published', true,
  jsonb_build_object('root', jsonb_build_object(
    'type','root','format','','indent',0,'version',1,'direction','ltr',
    'children', jsonb_build_array(jsonb_build_object(
      'type','paragraph','format','','indent',0,'version',1,'direction','ltr','textFormat',0,
      'children', jsonb_build_array(jsonb_build_object(
        'type','text','text','I saved over $12,000 on my dental implants by going to Atidi Care in Hyderabad. The quality was outstanding — they used Nobel Biocare implants, the same brand my US dentist recommended. The entire experience was first-class.',
        'mode','normal','style','','detail',0,'format',0,'version',1))))))
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE patient_name = 'Rajesh Patel');

INSERT INTO testimonials (patient_name, location, rating, status, featured, quote)
SELECT 'Priya Sharma', 'Texas, USA', 5, 'published', true,
  jsonb_build_object('root', jsonb_build_object(
    'type','root','format','','indent',0,'version',1,'direction','ltr',
    'children', jsonb_build_array(jsonb_build_object(
      'type','paragraph','format','','indent',0,'version',1,'direction','ltr','textFormat',0,
      'children', jsonb_build_array(jsonb_build_object(
        'type','text','text','My full mouth makeover in India cost me a fraction of what I was quoted in Houston. The results are absolutely stunning. The team at Atidi coordinated everything from airport pickup to hotel booking. I cannot recommend them enough.',
        'mode','normal','style','','detail',0,'format',0,'version',1))))))
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE patient_name = 'Priya Sharma');

INSERT INTO testimonials (patient_name, location, rating, status, featured, quote)
SELECT 'Vikram Reddy', 'Virginia, USA', 5, 'published', true,
  jsonb_build_object('root', jsonb_build_object(
    'type','root','format','','indent',0,'version',1,'direction','ltr',
    'children', jsonb_build_array(jsonb_build_object(
      'type','paragraph','format','','indent',0,'version',1,'direction','ltr','textFormat',0,
      'children', jsonb_build_array(jsonb_build_object(
        'type','text','text','I needed 3 root canals and crowns. In the US, I was looking at $7,500+. At Atidi in Hyderabad, I got everything done for under $1,500 with premium materials. The follow-up care in Virginia has been excellent.',
        'mode','normal','style','','detail',0,'format',0,'version',1))))))
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE patient_name = 'Vikram Reddy');

INSERT INTO testimonials (patient_name, location, rating, status, featured, quote)
SELECT 'Anita Desai', 'New York, USA', 5, 'published', true,
  jsonb_build_object('root', jsonb_build_object(
    'type','root','format','','indent',0,'version',1,'direction','ltr',
    'children', jsonb_build_array(jsonb_build_object(
      'type','paragraph','format','','indent',0,'version',1,'direction','ltr','textFormat',0,
      'children', jsonb_build_array(jsonb_build_object(
        'type','text','text','I got 8 porcelain veneers at the Bangalore clinic. The smile design process was incredible — I could see my new smile before they even started. Saved about $15,000 compared to NYC prices. Worth every minute of the trip!',
        'mode','normal','style','','detail',0,'format',0,'version',1))))))
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE patient_name = 'Anita Desai');

INSERT INTO testimonials (patient_name, location, rating, status, featured, quote)
SELECT 'Suresh Kumar', 'Connecticut, USA', 5, 'published', true,
  jsonb_build_object('root', jsonb_build_object(
    'type','root','format','','indent',0,'version',1,'direction','ltr',
    'children', jsonb_build_array(jsonb_build_object(
      'type','paragraph','format','','indent',0,'version',1,'direction','ltr','textFormat',0,
      'children', jsonb_build_array(jsonb_build_object(
        'type','text','text','All-on-4 implants for both arches would have cost me $60,000+ in the US. I got the same treatment in Hyderabad for $11,000 with the Nobel Biocare system. It has been 2 years and everything is perfect.',
        'mode','normal','style','','detail',0,'format',0,'version',1))))))
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE patient_name = 'Suresh Kumar');

INSERT INTO testimonials (patient_name, location, rating, status, featured, quote)
SELECT 'Meera Iyer', 'Maryland, USA', 5, 'published', false,
  jsonb_build_object('root', jsonb_build_object(
    'type','root','format','','indent',0,'version',1,'direction','ltr',
    'children', jsonb_build_array(jsonb_build_object(
      'type','paragraph','format','','indent',0,'version',1,'direction','ltr','textFormat',0,
      'children', jsonb_build_array(jsonb_build_object(
        'type','text','text','Started my clear aligner treatment in Chennai and the follow-up care in Maryland has been seamless. Atidi really has their coordination down. My teeth are almost perfectly aligned now!',
        'mode','normal','style','','detail',0,'format',0,'version',1))))))
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE patient_name = 'Meera Iyer');

INSERT INTO testimonials (patient_name, location, rating, status, featured, quote)
SELECT 'Arun Nair', 'Pennsylvania, USA', 5, 'published', false,
  jsonb_build_object('root', jsonb_build_object(
    'type','root','format','','indent',0,'version',1,'direction','ltr',
    'children', jsonb_build_array(jsonb_build_object(
      'type','paragraph','format','','indent',0,'version',1,'direction','ltr','textFormat',0,
      'children', jsonb_build_array(jsonb_build_object(
        'type','text','text','Two implants placed at the Hyderabad clinic using Straumann implants. The surgeon was incredibly skilled and the clinic was more modern than many I have seen in the US. Great experience all around.',
        'mode','normal','style','','detail',0,'format',0,'version',1))))))
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE patient_name = 'Arun Nair');

INSERT INTO testimonials (patient_name, location, rating, status, featured, quote)
SELECT 'Lakshmi Venkatesh', 'North Carolina, USA', 5, 'published', false,
  jsonb_build_object('root', jsonb_build_object(
    'type','root','format','','indent',0,'version',1,'direction','ltr',
    'children', jsonb_build_array(jsonb_build_object(
      'type','paragraph','format','','indent',0,'version',1,'direction','ltr','textFormat',0,
      'children', jsonb_build_array(jsonb_build_object(
        'type','text','text','Combined a family trip to India with dental work. Got whitening and 4 veneers done in Bangalore. The results are magazine-worthy! The Atidi team made it a stress-free experience.',
        'mode','normal','style','','detail',0,'format',0,'version',1))))))
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE patient_name = 'Lakshmi Venkatesh');

