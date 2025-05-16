# Lazy Student Dashboard (LSD)

## Projektüberblick
Lazy Student Dashboard (LSD) ist eine Next.js-basierte Web-App für Studierende, die ihre ECTS-Punkte, Anwesenheit und Lehrveranstaltungen auf entspannte Weise im Blick behalten wollen.

## Zielgruppe
Studierende, die ihr Studium effizient managen und dabei den Überblick über ECTS und Anwesenheit behalten möchten.

## Verwendete Technologien
	•	Framework: Next.js (App Router)
	•	Auth: Supabase Session
	•	Backend: Supabase + eigene API-Routen
	•	Validierung: zod
	•	State Management: zustand
	•	Testing: vitest
	•	Buildtools: Turbopack
	•	Linter: ESLint

## Projektstruktur (Auszug)
src/
├── app/
│   ├── api/calendar/       # ICS-Parsing und Kalender-API
│   ├── dashboard/
│   │   ├── attendance/     # Anwesenheits-UI und Tests
│   │   ├── ects/           # ECTS-Tracking
│   │   ├── configurator/   # ICS-Konfiguration und Kursdatenbearbeitung
│   │   └── tutorial/       # Einstiegsseite
│   └── Welcome/            # Login & Registrierung
├── components/             # UI-Komponenten
├── data/ectsMapping.json   # Mapping Kursname → ECTS
├── hooks/                  # Custom React Hooks
├── lib/                    # Utilities für ICS, ECTS, Services
├── store/                  # Zustand-Store
├── styles/                 # CSS-Module
├── types/                  # TypeScript-Typdefinitionen
└── supabase/               # Supabase-Konfiguration

## Features
1. Anwesenheitsübersicht
	•	Anzeige aller Kurse mit Fortschrittsbalken für EH
	•	Manuelle Anpassung der Fehlstunden

2. ECTS-Tracker
	•	Visualisiert ECTS-Verteilung pro Kurs
	•	JSON-Mapping zur Ermittlung fehlender Punkte

3. Kalenderimport (.ics)
	•	Laden einer Kalender-URL
	•	Parsing von VEVENTs
	•	Berechnung von:
	•	Dauer (Minuten)
	•	Unterrichtseinheiten (EH)
	•	ECTS (via Mapping)
	•	courseId + summary

## Auth & Daten
	•	Authentifizierung: Supabase Session
	•	Speicherung: Supabase-Datenbank

## Testing & Entwicklung
	•	Tests: vitest + Testing Library für Komponenten und API
	•	Linting: ESLint
	•	Entwicklung: next dev mit Turbopack

## Deployment
	•	Plattform: Vercel
	•	Setup Hinweise:

npm install
npm run dev
npm run build
npm run test



## Weitere Hinweise
	•	App Router Struktur (Next.js 15.2.4)
	•	Alle Features sind modular aufgebaut
	•	Fokus auf entspannte Nutzererfahrung (Lazy Student Prinzip)