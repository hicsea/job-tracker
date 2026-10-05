# Job Tracker

A phone-first job tracker for a one-person handyman business. Everything hangs off a **Job**:
estimate (with per-line scope, pricing, and customer approval), work schedule, photos, and
actual income/expenses so each job shows its real profit.

No server, no accounts. Data is stored on the phone in the browser (IndexedDB), and Settings
has one-tap backup/restore to a JSON file.

## Install on an Android phone

1. Open the GitHub Pages URL for this repo in Chrome.
2. Tap the ⋮ menu → **Add to Home screen** (or **Install app**).
3. Open it from the home screen like any other app. It works offline.

Data lives only on that phone. Download a backup from **Settings → Download backup** now and
then and keep it in Google Drive.

## Shipping an update

1. Edit `index.html`.
2. Bump the `CACHE` string in `sw.js` (e.g. `job-tracker-v5.0` → `job-tracker-v5.1`) so
   installed phones fetch the new version instead of the cached one.
3. Commit and push. GitHub Pages redeploys in about a minute. The phone picks it up the next
   time the app is opened with a connection (it may take one extra open).

Marcus's data is untouched by updates: it's in the browser, not in the repo.

## Files

- `index.html` — the whole app (HTML, CSS, JS in one file)
- `sw.js` — service worker: caches the app for offline use
- `manifest.webmanifest`, `icon-*.png` — makes it installable
- `make-icons.js` — regenerates the icons (`node make-icons.js`)

## Data model (for future features)

One JSON document: `{ version, counters, clients{}, jobs{}, settings }`. Each job holds its own
`estimate.items[]` (description, scope, materials, customer price by materials/labor/other,
internal estimated cost, approval + initials), `workDays[]`, `photos[]`, `income`, and
`expenses[]`. Older backups from earlier versions are migrated automatically on load.
Future additions (invoices, payments, change orders, time entries) should be new arrays on the
job, referencing line items by `id`, rather than new top-level systems.
