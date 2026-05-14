# Artist Demand Index

Static research dashboard for the Sonic Sphere artist demand workbook.

## Local URL

Run the dev server and open:

`http://127.0.0.1:5179/SSDataDashboard/`

## Commands

1. Put the workbook and research files in `data/raw/`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Run `npm run build`.

Additional manually researched artist rows can live in `data/raw/manual_artist_additions.json`; rerun `npm run prepare:data` after editing it.

The app parses the Excel workbook at build time and writes:

- `src/data/generated/artists.json`
- `src/data/generated/summaryStats.json`
- `src/data/generated/dataHealth.json`

No backend or runtime API is required.

## GitHub Pages

The Vite base path is configurable:

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
```

Deploy `dist/` to GitHub Pages.
