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
