# wsc2026-fe

Merged Next.js frontend for PEA One Agent — hosts both **OMS** and **VOC** dashboards in one app.

- `/` — landing page, pick OMS or VOC
- `/oms` — Outage Management System dashboard (merged from `wsc2026-fe-oms`)
- `/voc` — Voice of Customer dashboard (merged from `wsc2026-fe-voc`)

## Env vars

Shared backend for both OMS and VOC API routes — copy `.env.example` to `.env.local`:

- `BACKEND_URL`
- `API_KEY`

## Dev

```bash
npm install
npm run dev
```
