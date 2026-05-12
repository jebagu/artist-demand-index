# Global Agent Notes

## Local Hosting

- Permanent local dashboard URL: `http://127.0.0.1:5179/SSDataDashboard/`
- This project pins Vite to port `5179` with strict-port behavior.
- If port `5179` is occupied, stop the stale server or ask before changing the permanent URL.

## Project Notes

- Project name: Artist Demand Index.
- Static GitHub Pages-compatible Vite/React dashboard.
- Runtime data comes from generated JSON under `src/data/generated/`.
- Regenerate JSON with `npm run prepare:data` after changing files in `data/raw/`.
