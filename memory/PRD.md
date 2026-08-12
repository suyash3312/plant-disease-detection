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
