-- Sample data so the app has something to show in development.
-- These are FICTIONAL brands/shows. Replace with real, licensed shows.
-- Images use placehold.co so nothing copyrighted is hosted.

insert into public.brands (id, name, slug, type, institution) values
  ('11111111-1111-1111-1111-111111111111', 'Ada Okafor', 'ada-okafor', 'graduate', 'Example School of Fashion'),
  ('22222222-2222-2222-2222-222222222222', 'Studio Marrow', 'studio-marrow', 'label', null);

insert into public.shows
  (id, brand_id, title, slug, season, year, event, show_date, description, video_url, licence_status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111',
   'BA Fashion Graduate Collection', 'ada-okafor-ba-graduate-2026', 'Graduate', 2026,
   'Example School Graduate Show', '2026-06-12',
   'Sample graduate collection used for development.', null, 'licensed'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222',
   'Spring/Summer 2027', 'studio-marrow-ss27', 'SS27', 2026,
   'Example Fashion Week', '2026-09-20',
   'Sample label show used for development.', null, 'licensed');

insert into public.looks (show_id, look_number, image_url, photographer_credit)
select show_id, n,
       'https://placehold.co/600x900/png?text=Look+' || n,
       'Placeholder'
from (values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
             ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid)) as s(show_id),
     generate_series(1, 8) as n;
