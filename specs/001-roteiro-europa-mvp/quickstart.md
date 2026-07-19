# Quickstart: Roteiro Europa MVP

## Prerequisites

- Node.js 20+
- PostgreSQL (local or Docker)
- npm

## Setup

```bash
# Clone and install
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL (PostgreSQL connection string)

# Setup database
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

Open http://localhost:3000

## Environment Variables

**Required**:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/roteiro_europa
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**Optional (enables real providers)**:
```env
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
AMADEUS_ENV=test

GOOGLE_PLACES_API_KEY=

PEXELS_API_KEY=
```

Without optional keys, the app runs in full demo mode with mock data.

## Demo Mode

The application ships with a complete demo trip:
- Vitória → Lisboa (3 nights) → Paris (4 nights) → Roma (3 nights) → Vitória
- 12 days, 2 adults, balanced pace, moderate budget
- Realistic attractions, schedules, and estimated costs (clearly marked as demo)

Demo mode is automatic when no API keys are configured.

## Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Lint
npx prisma studio   # Database GUI
```

## Project Structure Overview

- `src/app/` — Pages (Next.js App Router)
- `src/components/` — React components (wizard, itinerary, flights, shared)
- `src/lib/providers/` — External service abstractions (flights, places, images)
- `src/lib/itinerary/` — Itinerary generation algorithm
- `src/lib/demo/` — Demo/mock data
- `prisma/` — Database schema and migrations
- `tests/` — Unit and integration tests
