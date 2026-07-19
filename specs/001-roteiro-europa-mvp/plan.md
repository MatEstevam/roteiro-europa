# Implementation Plan: Roteiro Europa MVP

**Branch**: `001-roteiro-europa-mvp` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-roteiro-europa-mvp/spec.md`

## Summary

Planejador de viagens web para famílias brasileiras visitando a Europa. Aplicação Next.js (App Router) com TypeScript, Tailwind CSS, shadcn/ui, Prisma/PostgreSQL. Gera roteiros determinísticos divididos por cidades/dias, pesquisa simulada de passagens aéreas com providers abstratos (Mock/Amadeus/Skyscanner), e funciona 100% sem APIs externas via modo demonstração.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+

**Primary Dependencies**: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, Prisma ORM, React Hook Form, Zod, date-fns, Lucide Icons, TanStack Query, Auth.js (NextAuth v5)

**Storage**: PostgreSQL (local via Docker ou instalação direta)

**Testing**: Vitest + React Testing Library

**Target Platform**: Web (desktop + mobile responsive), Node.js runtime (não Edge)

**Project Type**: Web application (full-stack Next.js)

**Performance Goals**: Geração de roteiro < 2s, pesquisa mock < 500ms, páginas carregam em < 3s

**Constraints**: Funcionar sem APIs externas, interface pt-BR, acessibilidade WCAG 2.1 AA mínimo, nunca expor chaves no frontend

**Scale/Scope**: MVP single-user (1-10 concurrent users), ~8 páginas, ~20 componentes reutilizáveis, 11 modelos Prisma

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

A constitution do projeto é um template vazio (não ratificada). Nenhuma restrição de governance se aplica. Gate passa automaticamente.

## Project Structure

### Documentation (this feature)

```text
specs/001-roteiro-europa-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page (/)
│   ├── planejar/
│   │   └── page.tsx              # Trip wizard (/planejar)
│   ├── viagens/
│   │   ├── page.tsx              # Trip list (/viagens)
│   │   └── [id]/
│   │       ├── page.tsx          # Trip view (/viagens/[id])
│   │       ├── editar/
│   │       │   └── page.tsx      # Edit preferences
│   │       └── passagens/
│   │           └── page.tsx      # Trip-linked flights
│   ├── passagens/
│   │   └── page.tsx              # Flight search (/passagens)
│   ├── configuracoes/
│   │   └── page.tsx              # Settings (/configuracoes)
│   └── api/
│       ├── auth/[...nextauth]/
│       │   └── route.ts          # Auth.js handler
│       ├── trips/
│       │   └── route.ts          # Trip CRUD API
│       ├── itinerary/
│       │   └── generate/
│       │       └── route.ts      # Itinerary generation
│       └── flights/
│           └── search/
│               └── route.ts      # Flight search API
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── wizard/                   # Trip wizard steps
│   │   ├── TripWizard.tsx
│   │   ├── DateRangeStep.tsx
│   │   ├── OriginStep.tsx
│   │   ├── DestinationSelector.tsx
│   │   ├── TravelProfileStep.tsx
│   │   └── TripSummaryStep.tsx
│   ├── itinerary/                # Itinerary display
│   │   ├── CityTimeline.tsx
│   │   ├── ItineraryDayCard.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── EstimatedCost.tsx
│   │   └── OpeningHours.tsx
│   ├── flights/                  # Flight search & results
│   │   ├── FlightSearchForm.tsx
│   │   ├── FlightOfferCard.tsx
│   │   ├── FlightComparisonTable.tsx
│   │   ├── FlexibleDatesSelector.tsx
│   │   └── AlternativeAirportComparison.tsx
│   └── shared/                   # Shared UI components
│       ├── ApiStatusBadge.tsx
│       ├── DataFreshnessNotice.tsx
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       └── LoadingSkeleton.tsx
├── lib/
│   ├── providers/                # External service abstractions
│   │   ├── flights/
│   │   │   ├── types.ts          # FlightSearchProvider interface
│   │   │   ├── mock.ts           # MockFlightSearchProvider
│   │   │   ├── amadeus.ts        # AmadeusFlightSearchProvider
│   │   │   ├── skyscanner.ts     # SkyscannerFlightSearchProvider (stub)
│   │   │   └── index.ts          # Provider factory
│   │   ├── places/
│   │   │   ├── types.ts          # PlacesProvider interface
│   │   │   ├── mock.ts           # MockPlacesProvider
│   │   │   ├── google.ts         # GooglePlacesProvider
│   │   │   └── index.ts          # Provider factory
│   │   └── images/
│   │       ├── types.ts          # ImageProvider interface
│   │       ├── mock.ts           # MockImageProvider
│   │       ├── pexels.ts         # PexelsImageProvider
│   │       └── index.ts          # Provider factory
│   ├── itinerary/
│   │   ├── types.ts              # TripPreferences, GeneratedItinerary, etc.
│   │   ├── generator.ts          # ItineraryGenerator (deterministic)
│   │   ├── ai-provider.ts        # AIItineraryProvider interface
│   │   ├── city-data.ts          # Static city/attraction data
│   │   └── distribution.ts       # Day distribution algorithm
│   ├── flights/
│   │   ├── balance-score.ts      # "Melhor equilíbrio" formula
│   │   └── sort.ts               # Flight sorting utilities
│   ├── cache/
│   │   └── api-cache.ts          # Cache service (DB-backed)
│   ├── validators/
│   │   ├── trip.ts               # Trip form schemas (Zod)
│   │   └── flight.ts             # Flight search schemas (Zod)
│   ├── demo/
│   │   ├── trip-data.ts          # Demo trip (VIX→LIS→CDG→FCO)
│   │   ├── flight-data.ts        # Demo flight results
│   │   └── places-data.ts        # Demo attractions data
│   ├── auth.ts                   # Auth.js configuration
│   ├── db.ts                     # Prisma client singleton
│   ├── rate-limit.ts             # Rate limiting utility
│   └── utils.ts                  # Shared utilities (currency, dates)
├── hooks/                        # React custom hooks
│   ├── use-trip-wizard.ts
│   └── use-flight-search.ts
└── types/
    └── index.ts                  # Shared TypeScript types

prisma/
├── schema.prisma                 # Database schema
├── migrations/                   # Auto-generated migrations
└── seed.ts                       # Seed with demo data

tests/
├── unit/
│   ├── itinerary-generator.test.ts
│   ├── day-distribution.test.ts
│   ├── balance-score.test.ts
│   ├── flight-sort.test.ts
│   └── validators.test.ts
├── integration/
│   ├── mock-flight-provider.test.ts
│   ├── mock-places-provider.test.ts
│   └── api-cache.test.ts
└── setup.ts

docs/
├── apis.md
└── product-decisions.md
```

**Structure Decision**: Next.js App Router monolith with collocated API routes. Source in `src/` with clear separation: `components/` (UI), `lib/` (business logic + providers), `hooks/` (React hooks). Providers use factory pattern selecting mock/real based on environment variables.

## Complexity Tracking

Nenhuma violação de constitution — seção não aplicável.
