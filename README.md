# Consulting Opportunities

Scrapes news sites for consulting, EOI, and RFP notices, filters them by
keyword, and serves them through a web dashboard with optional email digest
notifications.

Currently tracking [standard.gm](https://standard.gm), [thepoint.gm](https://thepoint.gm),
and [foroyaa.net](https://foroyaa.net); built to add more sources over time.

## Structure

```
backend/    FastAPI API + scrapers + scheduler -- see backend/README.md
frontend/   Next.js dashboard -- see frontend/README.md
```

## Local development

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # optional: fill in a Resend API key to enable email digests
uvicorn app.main:app --reload
```

**Frontend** (in a second terminal):
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`. Full details in `backend/README.md` and
`frontend/README.md`.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full free-tier hosting setup
(Vercel + Render + Neon Postgres + GitHub Actions cron).
