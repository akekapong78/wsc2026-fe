# wsc2026-fe

Merged Next.js frontend for PEA One Agent — hosts both **OMS** and **VOC** dashboards in one app.

- `/` — landing page, pick OMS or VOC
- `/oms` — Outage Management System dashboard (merged from `wsc2026-fe-oms`)
- `/voc` — Voice of Customer dashboard (merged from `wsc2026-fe-voc`)

## Env vars

- `BACKEND_URL`, `API_KEY` — OMS backend (default `http://localhost:8080` / `88888888`)
- `VOC_API_BASE`, `VOC_API_KEY` — VOC backend

## Dev

```bash
npm install
npm run dev
```
