# Consulting Opportunities — Frontend

Next.js (App Router) dashboard for browsing scraped consulting/EOI/RFP
opportunities, viewing analytics, and managing email digest recipients. See
the [repo root README](../README.md) for the full project overview.

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Expects the backend (see `../backend/README.md`)
running at `http://localhost:8000` by default -- override via the
`NEXT_PUBLIC_API_URL` environment variable if it's running elsewhere.

## Structure

```
src/app/
├── page.js                     redirects to /dashboard
├── dashboard/
│   ├── page.js                 overview: stat tiles, recent opportunities, sources
│   ├── opportunities/page.js   full opportunity list with search/filter
│   ├── analysis/page.js        charts: by source, over time
│   └── subscribers/page.js     add/remove email digest recipients
└── components/
    ├── sidenav.js / nav-links.js
    └── opportunity-card.js
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) at the repo root (deploys to Vercel).
