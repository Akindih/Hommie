# Runway

Log, rate and review fashion runway shows, in the style of Letterboxd.

**Stack:** Next.js 15 (App Router, TypeScript, Tailwind) · Supabase (Postgres, Auth, Storage) · Vercel

## What works now
- Sign up or sign in with email and password. A profile with a unique username is created automatically
- Browse shows → show page with video embed (YouTube/Vimeo), looks grid with photographer credits
- Rate with half stars, like, and review. Each user has one log per show, which they can edit or delete
- Watchlist (private, and a show is removed from it once you log it)
- Public profile page showing your diary of logged shows
- Average rating and like count per show
- Python script to import shows from JSON

## Run it locally
Requires Node 20+, Docker Desktop (running), and the Supabase CLI:

- **Mac:** `brew install supabase/tap/supabase`
- **Windows:** `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git` then `scoop install supabase`
- **Linux:** download from https://github.com/supabase/cli/releases

(The CLI is installed separately rather than as an npm package, because its npm installer downloads a large binary and often hangs during `npm install`.)

```bash
npm install
npm run db:start          # starts local Supabase, applies migrations + seed data
cp .env.example .env.local
```
Paste the `API_URL` and `PUBLISHABLE_KEY` printed by `db:start` into `.env.local`, then run:
```bash
npm run dev               # http://localhost:3000
```
Local Studio (database dashboard): http://127.0.0.1:54323 · Local test emails: http://127.0.0.1:54324

## Connect a real Supabase project
1. Create a project at supabase.com.
2. Link it and push the schema:
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```
   Alternatively, paste `supabase/migrations/*.sql` into the dashboard SQL Editor.
3. **Authentication → URL Configuration:** set the Site URL to your domain and add `https://YOUR_DOMAIN/auth/confirm` to the redirect URLs.
4. Put the project URL and publishable key in `.env.local`, and in Vercel's environment variables when you deploy.

## Project layout
```
supabase/migrations/   Database schema, security rules (RLS) and triggers
supabase/seed.sql      Fictional sample shows for development
scripts/               Python import script + example JSON
src/lib/supabase/      Supabase clients (browser, server, middleware)
src/lib/database.types.ts  Generated DB types: run `npm run db:types` after schema changes
src/app/               Pages: / · /shows/[slug] · /u/[username] · /watchlist · /login
src/components/        ShowCard, StarInput, LogForm
```

## Data model
| Table | Purpose |
|---|---|
| `profiles` | One per user (username, bio, avatar) |
| `brands` | Labels and graduate designers (`type`, `institution`) |
| `shows` | A runway show: season, event, video, **`licence_status`** |
| `looks` | Individual looks in a show, with photographer credit |
| `logs` | A user's rating (1–10 = half stars), review and like for a show |
| `watchlist` | Shows a user wants to watch |
| `show_stats` (view) | Average rating, rating count and like count |

**`licence_status`** controls what the app displays:
`none` shows text only · `embed_only` shows the official video embed but no hosted images · `licensed` shows video and looks.
Only mark a show `licensed` once you have written permission.

Security: brands, shows and looks can be read by anyone, and they can only be changed from the dashboard or with the secret key. A user can only create or change their own logs and watchlist.

## Adding shows
- **Dashboard:** Supabase → Table Editor.
- **Script:** copy `scripts/example_show.json`, then run:
  ```bash
  SUPABASE_URL=... SUPABASE_SECRET_KEY=... python3 scripts/import_show.py my_show.json
  ```
  Keep the secret key out of git and out of the web app, because it bypasses all security rules.
- Images: upload to Supabase Storage (create a public bucket called `looks`) and use those URLs.

## Changing the schema
```bash
supabase migration new add_something   # creates a new SQL file
npm run db:reset                           # re-applies all migrations locally
npm run db:types                           # regenerates TypeScript types
```

## Next up
- [ ] Apply the Figma designs: map design tokens to the CSS variables in `src/app/globals.css`
- [ ] Profile editing (bio, avatar upload)
- [ ] Search and filters (season, school, event)
- [ ] Custom lists, follows, activity feed
- [ ] Brand accounts that upload their own shows
- [ ] Mobile app (Expo), reusing the same Supabase backend
