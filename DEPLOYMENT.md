# Deployment

Everything below runs on free tiers. Total cost: $0/month, with a small
cold-start delay (10-60s) on the first request after the backend has been
idle a while -- that's fine for this use case, since the only "user" hitting
it on a schedule is the daily scrape trigger, not people waiting on a page
load.

**Stack:**
- Frontend (Next.js) → [Vercel](https://vercel.com)
- Backend (FastAPI) → [Render](https://render.com), via `render.yaml` in this repo
- Database → hosted Postgres on [Neon](https://neon.tech) or [Supabase](https://supabase.com) (either works; Neon is used below)
- Scheduling → GitHub Actions cron, calling the backend's `/api/opportunities/refresh`

## 1. Database (Neon)

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the connection string it gives you (starts with `postgresql://`).
   You'll paste this into Render in step 2.

## 2. Backend (Render)

1. In the [Render dashboard](https://dashboard.render.com), **New → Blueprint**,
   and connect this GitHub repo. Render will detect `render.yaml` at the repo
   root and propose the `consulting-opportunities-api` web service.
2. It'll prompt for the env vars marked `sync: false` in `render.yaml`:
   - `DATABASE_URL` — the Neon connection string from step 1
   - `BACKEND_CORS_ORIGINS` — leave as `["*"]` for now; you'll tighten this
     to your actual Vercel URL in step 4
   - `RESEND_API_KEY` — optional, only needed for email digests. Sign up
     free at [resend.com](https://resend.com), create an API key, paste it
     here. Leave blank to skip email entirely. (Not SMTP -- Render blocks
     outbound SMTP ports on every plan, so digests go out over Resend's
     HTTPS API instead; see `backend/.env.example` for details, including
     the sandbox-mode delivery restriction until you verify a domain.)
3. Deploy. Once live, note the service URL Render gives you, e.g.
   `https://consulting-opportunities-api.onrender.com`.
4. Confirm it's up: visit `<that-url>/health` — should return `{"status":"healthy"}`.

## 3. Frontend (Vercel)

1. In the [Vercel dashboard](https://vercel.com/new), import this repo.
2. Set the project's **root directory** to `frontend` (Vercel needs this
   since the Next.js app isn't at the repo root).
3. Add an environment variable: `NEXT_PUBLIC_API_URL` = your Render backend
   URL from step 2.4 (no trailing slash).
4. Deploy. Note the resulting URL, e.g. `https://your-app.vercel.app`.

## 4. Lock down CORS

Back in Render, update the backend's `BACKEND_CORS_ORIGINS` env var to your
actual Vercel production URL as a JSON array — e.g.
`["https://your-app.vercel.app"]` (this must be valid JSON; a plain string
will crash the app on boot).

Vercel also gives every preview deployment (any push not promoted to
production) its own unique URL, e.g.
`https://frontend-9q1tyf65w-your-team-projects.vercel.app` — those won't
match the exact-match list above. If you want previews to work against the
API too, also set `BACKEND_CORS_ORIGIN_REGEX` to a pattern scoped to your
Vercel project, e.g. for project `frontend` under team `your-team-projects`:

```
^https://frontend(-[a-zA-Z0-9]+)*-your-team-projects\.vercel\.app$
```

Redeploy after changing either var.

## 5. Set up the scrape schedule

The backend's `SCRAPE_ON_STARTUP` is `false` in production (already set in
`render.yaml`) -- scraping is instead triggered by a scheduled GitHub Actions
workflow, `.github/workflows/scrape-cron.yml`, so it happens reliably once a
day regardless of whether Render's free tier has spun the service down.

1. In this repo's GitHub settings: **Settings → Secrets and variables →
   Actions → New repository secret**.
2. Name it `BACKEND_URL`, value = your Render backend URL from step 2.3 (no
   trailing slash).
3. That's it -- it'll fire daily at 07:00 UTC. To test it immediately without
   waiting: go to the **Actions** tab → "Daily opportunity scrape" →
   **Run workflow**.

## 6. Verify end to end

- Visit your Vercel URL → should redirect to `/dashboard` and show real data
  (after the first scrape has run)
- Add your email on the Notifications page → confirm it saves
- Manually trigger a scrape (Actions tab → Run workflow, or `curl -X POST
  <backend-url>/api/opportunities/refresh`) and check Render's logs for the
  per-source results

## Notes

- Render's free tier spins down after ~15 min idle. The GitHub Actions cron
  ping wakes it; if you'd rather have zero cold-start delay, switch the
  Render service's plan from free to Starter (~$7/month) -- no other config
  changes needed.
- SQLite is not usable here since Render's free tier (and most PaaS hosts)
  don't guarantee a persistent filesystem across deploys/restarts -- that's
  why this setup uses Postgres via `DATABASE_URL` instead.
