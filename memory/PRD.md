# Verdaleaf — Plant Disease Detection (PRD)

## Problem statement
Plant Disease Detection using ML.

## Approach
AI vision-based diagnosis using Gemini 3 Flash (multimodal). Users upload a photo of a plant leaf; the backend calls the vision model and returns a structured JSON diagnosis (disease name, severity, symptoms, treatment, prevention).

## User personas
1. Home gardener — occasional scans, wants clear treatment steps.
2. Small-scale farmer — repeat scans, needs history and disease context.

## Core requirements (static)
- Upload leaf image → get disease name, severity, treatments, prevention.
- Detection history per user.
- Disease library / encyclopedia.
- Care & prevention tips.
- Emergent Google Auth for accounts.

## Architecture
- Backend: FastAPI + MongoDB. Routes under /api. Emergent LLM key + emergentintegrations for Gemini 3 Flash.
- Frontend: React + Tailwind + shadcn/ui + framer-motion + lucide-react + sonner.
- Auth: Emergent-managed Google OAuth with httpOnly session cookies (7-day expiry).

## What's implemented (Feb 2026)
- Backend: /api/auth/session, /api/auth/me, /api/auth/logout, /api/detect, /api/history (GET + DELETE), /api/diseases, /api/tips, /api/report/pdf (POST).
- Frontend: Landing (hero + features + CTA), Dashboard (upload + result + history + library + tips), AuthCallback.
- Botanical green design system (Cormorant Garamond + Manrope, tactile cards, pill buttons).
- PDF report export (Feb 2026): POST /api/report/pdf (reportlab, `backend/pdf_report.py`) generates a printable branded report (leaf photo, diagnosis, severity meter, confidence, symptoms, numbered treatments, prevention, AI disclaimer footer). "Download PDF report" button on every DiagnosisResult (fresh scans + history). E2E tested.

## Backlog / next
- P1: Camera capture on mobile (getUserMedia).
- P2: Share diagnosis via link.
- P2: Multi-image batch scan for field walks.
- P2: Weekly plant health email digest.


## Update — June 2026 (session: branding + Kaggle tooling)
- Removed all Emergent watermarks from `frontend/public/index.html`: badge script
  (`assets.emergent.sh/scripts/emergent-main.js`), PostHog analytics block, "A product of
  emergent.sh" meta description. Title is now "Verdaleaf | Plant Disease Detection".
  Google-auth redirects to `auth.emergentagent.com` retained (functional, not branding).
- Added `/app/LOCAL_SETUP.md`: run-on-your-own-machine guide (venv + uvicorn:8001, yarn:3000,
  MongoDB, required .env keys, and the Secure/SameSite cookie caveat for login on http://localhost).
- Added `/app/KAGGLE_DATASETS.md`: Kaggle API token setup, CLI + kagglehub commands, plant-disease
  dataset slugs (PlantVillage, PlantDoc, Cassava, Rice), licensing notes.
- Added `/app/scripts/kaggle_benchmark.py`: benchmarks `/api/detect` against any ImageFolder-style
  labelled dataset; prints per-class + top-1 accuracy, writes `benchmark_report.json`.
  Verified end-to-end (2 live detect calls, reporting/matching correct). NOT yet run on real
  PlantVillage data — that needs the user's own Kaggle credentials.

### Backlog (unchanged priority)
- P0: Detection history/gallery UI (backend `GET /api/history` EXISTS; no dedicated frontend view).
- P1: Disease library page (backend `GET /api/diseases` exists, 6 hardcoded entries).
- P1: Care tips page (backend `GET /api/tips` exists, 6 hardcoded entries).
  NOTE: Landing nav links to "Library" and "Care Tips" but App.js only routes `/` and `/dashboard`.
- P2: Public share links for a scan; multi-image batch scan; weekly garden digest email.

## Update — June 2026 (dark theme)
- Dark theme shipped. Approach: converted the hardcoded `botanical-*` hex palette in
  `tailwind.config.js` into CSS variables (`--bot-*`), defined twice in `src/index.css`
  (`:root` = light, `.dark` = dark). One class on `<html>` re-themes the entire app, so light
  mode is byte-for-byte visually unchanged.
- New files: `src/theme.jsx` (ThemeProvider/useTheme, localStorage key `verdaleaf-theme`,
  falls back to `prefers-color-scheme`), `src/components/ThemeToggle.jsx`
  (sun/moon toggle in the header, `data-testid="theme-toggle"`).
- No-flash: inline script in `public/index.html` applies `.dark` before React mounts.
- Sonner toasts receive the active theme via `ThemedToaster` in `App.js`.
- New tokens: `botanical-card` (was hardcoded `bg-white`) and `botanical-hover`
  (replaces `hover:bg-botanical-ink`, which would have inverted in dark).
- Theme-aware severity palettes: `sevColor.light` / `sevColor.dark` in `DiagnosisResult.jsx`,
  and a matching ternary in `Dashboard.jsx` (~line 184).
- GOTCHA for future work: in the dark palette `--bot-forest` is LIGHTER while `--bot-sage` is
  DARKER than in light, which inverts the "sage background + forest foreground" pairing.
  Any new element using that pair needs `dark:text-botanical-moss` +
  `dark:bg-botanical-moss/20`.
- Testing: iteration_2 found 3 contrast regressions (active tab weaker than inactive, invisible
  icon chips / step pills, dim "Select file" hint) — all fixed and re-verified in iteration_3
  (100% frontend pass, real Gemini scan + PDF download confirmed working in dark mode).
- NOTE: browse the preview URL, not http://localhost:3000 — the frontend calls the external
  REACT_APP_BACKEND_URL with credentials, so localhost origin fails CORS (backend CORS_ORIGINS='*').
