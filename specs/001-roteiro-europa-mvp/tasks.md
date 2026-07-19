# Tasks: Roteiro Europa MVP

**Input**: Design documents from `specs/001-roteiro-europa-mvp/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Included (explicitly requested in feature specification)

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and base configuration

- [x] T001 Initialize Next.js project with TypeScript, Tailwind CSS, App Router in project root
- [x] T002 Install and configure shadcn/ui with pt-BR defaults in src/components/ui/
- [x] T003 [P] Install core dependencies: react-hook-form, zod, date-fns, lucide-react, @tanstack/react-query, next-auth, prisma, recharts
- [x] T004 [P] Configure Tailwind CSS theme (colors, fonts, spacing for travel/light aesthetic) in tailwind.config.ts
- [x] T005 [P] Create .env.example with all environment variables documented at project root
- [x] T006 [P] Configure Vitest with React Testing Library in vitest.config.ts and tests/setup.ts
- [x] T007 Create root layout with providers (QueryClient, SessionProvider, theme) in src/app/layout.tsx
- [x] T008 [P] Create shared TypeScript types (TripPreferences, GeneratedItinerary, etc.) in src/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create Prisma schema with all 11 models (User, Trip, TripTraveler, TripCountry, TripCity, ItineraryDay, ItineraryActivity, FlightSearch, FlightOffer, SavedPlace, ApiCache) in prisma/schema.prisma
- [x] T010 Run initial Prisma migration and generate client
- [x] T011 [P] Create Prisma client singleton in src/lib/db.ts
- [x] T012 [P] Configure Auth.js v5 with Credentials + Google providers in src/lib/auth.ts and src/app/api/auth/[...nextauth]/route.ts
- [x] T013 [P] Create Zod validation schemas for trip and flight forms in src/lib/validators/trip.ts and src/lib/validators/flight.ts
- [x] T014 [P] Create rate limiting utility (in-memory sliding window) in src/lib/rate-limit.ts
- [x] T015 [P] Create shared utilities (currency formatting, date formatting pt-BR, time helpers) in src/lib/utils.ts
- [x] T016 [P] Create provider factory for flights in src/lib/providers/flights/index.ts with FlightSearchProvider interface in src/lib/providers/flights/types.ts
- [x] T017 [P] Create provider factory for places in src/lib/providers/places/index.ts with PlacesProvider interface in src/lib/providers/places/types.ts
- [x] T018 [P] Create provider factory for images in src/lib/providers/images/index.ts with ImageProvider interface in src/lib/providers/images/types.ts
- [x] T019 [P] Create API cache service (DB-backed with TTL) in src/lib/cache/api-cache.ts
- [x] T020 [P] Create shared UI components: EmptyState, ErrorState, LoadingSkeleton, ApiStatusBadge, DataFreshnessNotice in src/components/shared/
- [x] T021 [P] Create itinerary type definitions (TripPreferences, GeneratedItinerary, ItineraryCity, ItineraryDay, ItineraryActivity) in src/lib/itinerary/types.ts
- [x] T022 [P] Create AIItineraryProvider interface in src/lib/itinerary/ai-provider.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Criar viagem com roteiro gerado (Priority: P1) MVP

**Goal**: User completes 5-step wizard and receives a complete itinerary divided by cities and days with activities, schedules, and estimated costs.

**Independent Test**: Fill wizard with demo trip preferences (Vitoria → Lisboa → Paris → Roma, 12 days, 2 adults, balanced), verify generated itinerary shows all 12 days with activities.

### Tests for User Story 1

- [x] T023 [P] [US1] Unit test for trip duration calculation in tests/unit/itinerary-generator.test.ts
- [x] T024 [P] [US1] Unit test for city day distribution algorithm (weighted proportional) in tests/unit/day-distribution.test.ts
- [x] T025 [P] [US1] Unit test for activity limits per pace (2/3/4) in tests/unit/itinerary-generator.test.ts
- [x] T026 [P] [US1] Unit test for Zod trip form validation in tests/unit/validators.test.ts

### Implementation for User Story 1

- [x] T027 [P] [US1] Create static city relevance data (tourism weights, city-country mappings, suggested cities per country) in src/lib/itinerary/city-data.ts
- [x] T028 [P] [US1] Create MockPlacesProvider with realistic attraction data for Lisboa, Paris, Roma in src/lib/providers/places/mock.ts
- [x] T029 [P] [US1] Create MockImageProvider with placeholder destination images in src/lib/providers/images/mock.ts
- [x] T030 [US1] Implement day distribution algorithm (weighted proportional, min 2 nights, arrival/departure days) in src/lib/itinerary/distribution.ts
- [x] T031 [US1] Implement ItineraryGenerator (deterministic: distribute days, assign activities per pace, insert meals/transit, free periods) in src/lib/itinerary/generator.ts
- [x] T032 [P] [US1] Create demo trip data (full 12-day VIX→LIS→CDG→FCO itinerary) in src/lib/demo/trip-data.ts
- [x] T033 [P] [US1] Create demo places/attractions data for Lisboa, Paris, Roma in src/lib/demo/places-data.ts
- [x] T034 [US1] Create TripWizard container component (step management, form state) in src/components/wizard/TripWizard.tsx
- [x] T035 [P] [US1] Create DateRangeStep (dates, travelers, children ages, auto-calculate days/nights) in src/components/wizard/DateRangeStep.tsx
- [x] T036 [P] [US1] Create OriginStep (city, airport, alternative airports, max distance) in src/components/wizard/OriginStep.tsx
- [x] T037 [P] [US1] Create DestinationSelector (multi-select countries, city suggestions per country, pace preference) in src/components/wizard/DestinationSelector.tsx
- [x] T038 [P] [US1] Create TravelProfileStep (pace, interests, budget, transport, accessibility, dietary, mandatory places) in src/components/wizard/TravelProfileStep.tsx
- [x] T039 [P] [US1] Create TripSummaryStep (confirmation of all choices, "Criar meu roteiro" button) in src/components/wizard/TripSummaryStep.tsx
- [x] T040 [US1] Create custom hook use-trip-wizard (step navigation, form state persistence, submission) in src/hooks/use-trip-wizard.ts
- [x] T041 [US1] Create POST /api/itinerary/generate route (validate with Zod, call generator, rate limit) in src/app/api/itinerary/generate/route.ts
- [x] T042 [US1] Create /planejar page with TripWizard component in src/app/planejar/page.tsx
- [x] T043 [P] [US1] Create CityTimeline component (visual timeline: Vitória → Lisboa → Paris → Roma → Vitória) in src/components/itinerary/CityTimeline.tsx
- [x] T044 [P] [US1] Create ItineraryDayCard (day title, activities list, cost summary) in src/components/itinerary/ItineraryDayCard.tsx
- [x] T045 [P] [US1] Create ActivityCard (photo, name, time, duration, cost, address, category, booking, website) in src/components/itinerary/ActivityCard.tsx
- [x] T046 [P] [US1] Create EstimatedCost component (min-max range, currency, disclaimer) in src/components/itinerary/EstimatedCost.tsx
- [x] T047 [P] [US1] Create OpeningHours component (display hours, "Consultar site oficial" fallback) in src/components/itinerary/OpeningHours.tsx
- [x] T048 [US1] Create /viagens/[id] page with full itinerary view (header, city timeline, day cards, filters) in src/app/viagens/[id]/page.tsx
- [x] T049 [US1] Add itinerary filters (by city, free/paid activities, booking required) to /viagens/[id] page
- [x] T050 [US1] Create landing page with hero, CTA buttons, feature highlights in src/app/page.tsx

**Checkpoint**: User Story 1 functional — user can create trip via wizard and view generated itinerary with demo data

---

## Phase 4: User Story 4 - Modo demonstração sem APIs (Priority: P1) MVP

**Goal**: Application works 100% without external API keys using realistic mock data clearly marked as demo.

**Independent Test**: Run app with no API keys in .env, generate itinerary, search flights — all return mock data with "[Demonstração]" labels.

### Tests for User Story 4

- [x] T051 [P] [US4] Integration test for MockFlightSearchProvider in tests/integration/mock-flight-provider.test.ts
- [x] T052 [P] [US4] Integration test for MockPlacesProvider in tests/integration/mock-places-provider.test.ts

### Implementation for User Story 4

- [x] T053 [US4] Create MockFlightSearchProvider with realistic VIX↔LIS/CDG/FCO flights in src/lib/providers/flights/mock.ts
- [x] T054 [P] [US4] Create demo flight data (multiple airlines, prices, durations for Brazilian airports) in src/lib/demo/flight-data.ts
- [x] T055 [US4] Add "[Demonstração]" badge and disclaimer to all mock data displays via ApiStatusBadge component
- [x] T056 [US4] Ensure provider factories fallback to mock when env vars not set (verify in src/lib/providers/*/index.ts)

**Checkpoint**: Full demo mode operational without any API keys

---

## Phase 5: User Story 2 - Pesquisar passagens aéreas (Priority: P2)

**Goal**: User searches for flights and receives results with sorting, comparison, and "Melhor equilíbrio" highlights.

**Independent Test**: Search flights VIX→LIS, verify results show cards with price/duration/stops, sort by different criteria, see "Mais barato"/"Mais rápido"/"Melhor equilíbrio" labels.

### Tests for User Story 2

- [x] T057 [P] [US2] Unit test for balance score formula (50/30/20 weights) in tests/unit/balance-score.test.ts
- [x] T058 [P] [US2] Unit test for flight sorting (price, duration, stops, balance, departure) in tests/unit/flight-sort.test.ts
- [x] T059 [P] [US2] Unit test for airport comparison logic in tests/unit/balance-score.test.ts

### Implementation for User Story 2

- [x] T060 [US2] Implement balance score formula (normalized 0-1, 50% price, 30% duration, 20% stops) in src/lib/flights/balance-score.ts
- [x] T061 [P] [US2] Implement flight sorting utilities (5 criteria + highlight best) in src/lib/flights/sort.ts
- [x] T062 [US2] Create FlightSearchForm component (origin, destination, dates, travelers, class, direct, max stops, baggage, flexibility, alternative airports) in src/components/flights/FlightSearchForm.tsx
- [x] T063 [P] [US2] Create FlexibleDatesSelector (exact, +/-3 days, +/-7 days) in src/components/flights/FlexibleDatesSelector.tsx
- [x] T064 [P] [US2] Create FlightOfferCard (airline, logo, price, duration, stops, times, baggage, booking link, last updated) in src/components/flights/FlightOfferCard.tsx
- [x] T065 [P] [US2] Create FlightComparisonTable (side-by-side airport comparison) in src/components/flights/FlightComparisonTable.tsx
- [x] T066 [P] [US2] Create AlternativeAirportComparison (savings estimate + additional costs warning) in src/components/flights/AlternativeAirportComparison.tsx
- [x] T067 [US2] Create custom hook use-flight-search (search state, sorting, filtering) in src/hooks/use-flight-search.ts
- [x] T068 [US2] Create POST /api/flights/search route (validate, call provider, rate limit, cache 15min) in src/app/api/flights/search/route.ts
- [x] T069 [US2] Create /passagens page with FlightSearchForm and results in src/app/passagens/page.tsx
- [x] T070 [US2] Create /viagens/[id]/passagens page (pre-filled from trip data) in src/app/viagens/[id]/passagens/page.tsx

**Checkpoint**: Flight search fully functional with mock data, sorting, and airport comparison

---

## Phase 6: User Story 5 - Visualização responsiva e acessível (Priority: P2)

**Goal**: Application works on mobile and desktop with accessible interface for older users.

**Independent Test**: Navigate wizard and itinerary on 320px viewport, verify no horizontal scroll. Tab through all interactive elements, verify focus indicators.

### Implementation for User Story 5

- [x] T071 [P] [US5] Audit and fix all components for mobile responsive (320px-1920px) — wizard steps, itinerary cards, flight results
- [x] T072 [P] [US5] Add keyboard navigation support to all interactive elements (wizard steps, filters, cards)
- [x] T073 [P] [US5] Ensure adequate color contrast (WCAG AA), minimum font sizes (16px body), large click targets (44x44px)
- [x] T074 [US5] Add alt text to all images, aria-labels to icon buttons, visible labels for all form fields
- [x] T075 [US5] Add focus-visible states to all interactive elements across the application

**Checkpoint**: Application usable on all screen sizes with full keyboard navigation and accessibility

---

## Phase 7: User Story 3 - Salvar e reabrir viagem (Priority: P3)

**Goal**: Authenticated user can save trips and access them later from a trip list.

**Independent Test**: Generate trip as anonymous, login, verify trip linked to account. Navigate to /viagens, see saved trip, click to view full itinerary.

### Implementation for User Story 3

- [x] T076 [US3] Create login/register UI (modal or page) triggered from "Salvar" button in src/app/api/auth/ and UI component
- [x] T077 [US3] Implement anonymous trip linking (session cookie → on auth callback, POST pending trip) in src/app/api/trips/route.ts
- [x] T078 [US3] Create POST /api/trips route (save trip + itinerary to DB for authenticated user) in src/app/api/trips/route.ts
- [x] T079 [US3] Create GET /api/trips route (list user trips) in src/app/api/trips/route.ts
- [x] T080 [US3] Create GET /api/trips/[id] route (fetch full trip, check ownership or share token) in src/app/api/trips/[id]/route.ts
- [x] T081 [US3] Create /viagens page (trip list with title, dates, status, cities) in src/app/viagens/page.tsx
- [x] T082 [US3] Implement share via public link (POST /api/trips/[id]/share, GET /viagens/compartilhado/[token]) in src/app/api/trips/[id]/share/route.ts

**Checkpoint**: Users can save, list, reopen, and share trips

---

## Phase 8: User Story 6 - Editar preferências e regenerar (Priority: P3)

**Goal**: User can edit trip preferences and regenerate itinerary with new settings.

**Independent Test**: Open saved trip, click "Editar preferências", change pace to "tranquilo", regenerate, verify max 2 activities per day.

### Implementation for User Story 6

- [x] T083 [US6] Create PUT /api/trips/[id] route (update preferences) in src/app/api/trips/[id]/route.ts
- [x] T084 [US6] Create /viagens/[id]/editar page (pre-filled wizard with existing preferences) in src/app/viagens/[id]/editar/page.tsx
- [x] T085 [US6] Add "Editar preferências" and "Regenerar roteiro" buttons to trip view page header

**Checkpoint**: Users can iterate on their trips without starting over

---

## Phase 9: External Provider Integration (Priority: P2)

**Goal**: Real API integrations ready and documented, activatable with credentials.

**Independent Test**: Set AMADEUS_CLIENT_ID/SECRET in .env, search flights, verify real API response. Remove keys, verify fallback to mock.

### Implementation

- [x] T086 [P] Implement AmadeusFlightSearchProvider (OAuth2 auth, Flight Offers Search, retry, timeout, error handling) in src/lib/providers/flights/amadeus.ts
- [x] T087 [P] Create SkyscannerFlightSearchProvider stub with documentation in src/lib/providers/flights/skyscanner.ts
- [x] T088 [P] Implement GooglePlacesProvider (field masks, search nearby, get details) in src/lib/providers/places/google.ts
- [x] T089 [P] Implement PexelsImageProvider (search, credits display) in src/lib/providers/images/pexels.ts
- [x] T090 Integrate ApiCache with all real providers (read-through cache with TTL per type) in src/lib/cache/api-cache.ts

**Checkpoint**: All external integrations functional with proper fallbacks

---

## Phase 10: Settings & Configuration (Priority: P3)

**Goal**: User can configure default airport, currency, and language preferences.

### Implementation

- [x] T091 [P] Create /configuracoes page (language, currency, default airports) in src/app/configuracoes/page.tsx
- [x] T092 Create user preferences storage (DB for authenticated, localStorage for anonymous) linked to settings page

**Checkpoint**: User preferences persisted and applied across the app

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, tests, error handling, security hardening

- [x] T093 [P] Create README.md (objective, stack, install, env vars, DB, run, demo mode, activate APIs, limitations)
- [x] T094 [P] Create docs/apis.md (provider contracts, Amadeus, Skyscanner, Google Places, Pexels, cache, limits, errors, swap provider)
- [x] T095 [P] Create docs/product-decisions.md (why no purchase, abstract providers, demo mode, cost estimation, avoiding fake data, limitations)
- [x] T096 [P] Unit test for currency conversion utility in tests/unit/validators.test.ts
- [x] T097 Add comprehensive error states to all pages (no flights found, city not recognized, API unavailable, rate limited, key not configured, trip too short, stale price)
- [x] T098 Add Prisma seed script with demo trip data in prisma/seed.ts
- [x] T099 Final TypeScript strict check — resolve all type errors across the project
- [x] T100 Security audit: verify no API keys in client bundles, Zod validation on all inputs, rate limiting on search routes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — MVP core
- **US4 (Phase 4)**: Depends on US1 (uses same mock data infrastructure)
- **US2 (Phase 5)**: Depends on Foundational — can run parallel to US1
- **US5 (Phase 6)**: Depends on US1 + US2 (needs components to audit)
- **US3 (Phase 7)**: Depends on Foundational + auth setup
- **US6 (Phase 8)**: Depends on US1 + US3
- **Providers (Phase 9)**: Depends on Foundational — can run parallel to user stories
- **Settings (Phase 10)**: Depends on US3 (auth)
- **Polish (Phase 11)**: Depends on all desired stories complete

### User Story Dependencies

- **US1 (P1)**: After Foundational → independently testable
- **US4 (P1)**: After US1 (shares mock data) → independently testable
- **US2 (P2)**: After Foundational → independently testable
- **US5 (P2)**: After US1 + US2 (needs existing UI) → independently testable
- **US3 (P3)**: After Foundational → independently testable
- **US6 (P3)**: After US1 + US3 → independently testable

### Within Each User Story

- Tests written FIRST (fail before implementation)
- Models/data before services
- Services before API routes
- API routes before UI pages
- Core implementation before integration

### Parallel Opportunities

- T003, T004, T005, T006, T008 (Phase 1 setup tasks)
- T011-T022 (Phase 2 foundational — all different files)
- T023-T026 (US1 tests)
- T027-T029, T032-T033 (US1 data/mock tasks)
- T035-T039 (US1 wizard step components)
- T043-T047 (US1 itinerary display components)
- T057-T059 (US2 tests)
- T063-T066 (US2 flight components)
- T071-T073 (US5 accessibility tasks)
- T086-T089 (Phase 9 provider implementations)
- T093-T096 (Phase 11 docs and tests)

---

## Parallel Example: User Story 1

```bash
# After foundational phase, launch tests in parallel:
T023: "Unit test for trip duration calculation"
T024: "Unit test for city day distribution algorithm"
T025: "Unit test for activity limits per pace"
T026: "Unit test for Zod trip form validation"

# Then launch data/mock tasks in parallel:
T027: "Create static city relevance data"
T028: "Create MockPlacesProvider"
T029: "Create MockImageProvider"
T032: "Create demo trip data"
T033: "Create demo places/attractions data"

# Then launch wizard components in parallel:
T035: "Create DateRangeStep"
T036: "Create OriginStep"
T037: "Create DestinationSelector"
T038: "Create TravelProfileStep"
T039: "Create TripSummaryStep"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 4)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (wizard + itinerary generation)
4. Complete Phase 4: User Story 4 (demo mode)
5. **STOP and VALIDATE**: Full demo trip works end-to-end without API keys
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 + US4 → Demo-able MVP (trip creation + itinerary + demo mode)
3. US2 → Add flight search capability
4. US5 → Mobile + accessibility polish
5. US3 → Persistence + sharing
6. US6 → Edit/regenerate
7. Phase 9 → Real API integrations
8. Phase 11 → Documentation + hardening

### Suggested MVP Scope

**Phases 1-4 (T001-T056)**: 56 tasks deliver a fully functional demo that generates itineraries and shows mock data. This is the minimum shippable product.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- All prices/data in demo mode explicitly marked "[Demonstração]"
- Interface entirely in pt-BR
