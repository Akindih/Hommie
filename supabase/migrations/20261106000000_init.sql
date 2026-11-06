-- =============================================================
-- Initial schema: profiles, brands, shows, looks, logs, watchlist
-- Run in Supabase: Dashboard → SQL Editor, or `supabase db push`
-- =============================================================

-- ---------- Profiles (one per auth user) ----------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text unique not null
               check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name text,
  avatar_url   text,
  bio          text check (char_length(bio) <= 500),
  created_at   timestamptz not null default now()
);

-- ---------- Brands (labels + graduate designers) ----------
create type public.brand_type as enum ('graduate', 'label');

create table public.brands (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null check (slug ~ '^[a-z0-9-]+$'),
  type        public.brand_type not null default 'label',
  institution text,            -- e.g. 'Central Saint Martins' for grad shows
  website     text,
  created_at  timestamptz not null default now()
);

-- ---------- Shows ----------
-- licence_status tracks what we are allowed to display.
create type public.licence_status as enum (
  'none',          -- metadata only, no media shown
  'embed_only',    -- official YouTube/Vimeo embed, no hosted images
  'licensed'       -- written permission to host looks + video
);

create table public.shows (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid not null references public.brands (id) on delete cascade,
  title           text not null,          -- e.g. 'BA Fashion Graduate Show 2026'
  slug            text unique not null check (slug ~ '^[a-z0-9-]+$'),
  season          text,                   -- e.g. 'SS27', 'FW26', 'Graduate'
  year            int check (year between 1900 and 2100),
  event           text,                   -- e.g. 'London Fashion Week'
  show_date       date,
  description     text,
  video_url       text,                   -- YouTube/Vimeo URL for now
  cover_image_url text,
  licence_status  public.licence_status not null default 'none',
  created_at      timestamptz not null default now()
);
create index shows_brand_id_idx on public.shows (brand_id);

-- ---------- Looks ----------
create table public.looks (
  id                  uuid primary key default gen_random_uuid(),
  show_id             uuid not null references public.shows (id) on delete cascade,
  look_number         int not null check (look_number > 0),
  image_url           text,
  photographer_credit text,
  notes               text,
  unique (show_id, look_number)
);

-- ---------- Logs (rating / review / like) ----------
-- rating is 1–10 and shown as 0.5–5 stars. One log per user per show for v1.
create table public.logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  show_id     uuid not null references public.shows (id) on delete cascade,
  rating      smallint check (rating between 1 and 10),
  review_text text check (char_length(review_text) <= 10000),
  liked       boolean not null default false,
  logged_at   timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, show_id)
);
create index logs_show_id_idx on public.logs (show_id);

-- ---------- Watchlist ----------
create table public.watchlist (
  user_id  uuid not null references public.profiles (id) on delete cascade,
  show_id  uuid not null references public.shows (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, show_id)
);

-- ---------- Average rating view ----------
create view public.show_stats with (security_invoker = true) as
select
  s.id as show_id,
  count(l.rating)            as rating_count,
  round(avg(l.rating), 2)    as avg_rating,   -- still on the 1–10 scale
  count(*) filter (where l.liked) as like_count
from public.shows s
left join public.logs l on l.show_id = s.id
group by s.id;

-- =============================================================
-- Row Level Security
-- Catalogue (brands/shows/looks) is public-read; writes happen via
-- the dashboard / service role only. User data is owner-writable.
-- =============================================================
alter table public.profiles  enable row level security;
alter table public.brands    enable row level security;
alter table public.shows     enable row level security;
alter table public.looks     enable row level security;
alter table public.logs      enable row level security;
alter table public.watchlist enable row level security;

create policy "profiles are public"   on public.profiles for select using (true);
create policy "update own profile"    on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "brands are public" on public.brands for select using (true);
create policy "shows are public"  on public.shows  for select using (true);
create policy "looks are public"  on public.looks  for select using (true);

create policy "logs are public" on public.logs for select using (true);
create policy "insert own logs" on public.logs for insert
  with check (auth.uid() = user_id);
create policy "update own logs" on public.logs for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own logs" on public.logs for delete
  using (auth.uid() = user_id);

-- Watchlists are private for now.
create policy "read own watchlist"   on public.watchlist for select
  using (auth.uid() = user_id);
create policy "insert own watchlist" on public.watchlist for insert
  with check (auth.uid() = user_id);
create policy "delete own watchlist" on public.watchlist for delete
  using (auth.uid() = user_id);

-- =============================================================
-- Triggers
-- =============================================================

-- Create a profile automatically when someone signs up.
-- The username comes from sign-up metadata, falling back to a generated one.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  base_username text;
begin
  base_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    '[^a-zA-Z0-9_]', '', 'g'));
  if char_length(base_username) < 3 then
    base_username := 'user';
  end if;
  base_username := left(base_username, 24);

  -- Append a suffix if the username is taken.
  if exists (select 1 from public.profiles where username = base_username) then
    base_username := base_username || '_' || substr(md5(random()::text), 1, 5);
  end if;

  insert into public.profiles (id, username, display_name)
  values (new.id, base_username, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep logs.updated_at current.
create function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger logs_touch_updated_at
  before update on public.logs
  for each row execute function public.touch_updated_at();
