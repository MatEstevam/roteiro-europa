# Research: Roteiro Europa MVP

**Date**: 2026-07-18

## Decision: Authentication Strategy

**Decision**: Auth.js v5 (NextAuth v5) with Credentials + Google OAuth providers

**Rationale**: Auth.js v5 integrates natively with Next.js App Router, supports session-based auth with JWT strategy, and has built-in adapter for Prisma. Credentials provider enables email/password for users who don't have Google. Anonymous sessions tracked via cookies for trip-to-account linking.

**Alternatives considered**:
- Clerk: Too expensive for MVP, vendor lock-in
- Supabase Auth: Requires separate Supabase instance
- Custom JWT: Too much security surface to maintain

**Implementation note**: Anonymous trip linking via a session cookie `anonymousTripId` — on login, check cookie and associate trip with user.

## Decision: Itinerary Generation Algorithm

**Decision**: Deterministic algorithm using static attraction database per city with weighted distribution

**Rationale**: No AI dependency means the MVP works offline and has predictable, testable output. City relevance weights are hardcoded based on tourism data (e.g., Paris=5, Bruxelas=2). The algorithm is a pure function: preferences in → itinerary out.

**Alternatives considered**:
- OpenAI/Claude API: Adds cost, latency, and external dependency — conflicts with "funcionar sem APIs externas"
- Rule-based with random variation: Less predictable, harder to test
- Template-based (pre-built itineraries): Too rigid, doesn't adapt to user preferences

**Implementation note**: The `AIItineraryProvider` interface is defined but not implemented in MVP. Generator uses `MockPlacesProvider` data to populate activities.

## Decision: Flight Search Provider Architecture

**Decision**: Strategy pattern with factory function selecting provider based on environment variables

**Rationale**: Clean separation allows adding new providers without touching existing code. Factory checks `AMADEUS_CLIENT_ID` presence to decide. Mock provider returns realistic but clearly marked data.

**Alternatives considered**:
- Single provider with feature flag: Less extensible
- Plugin system: Over-engineered for 3 providers

**Implementation note**: 
- `getFlightProvider()` → checks env vars → returns appropriate instance
- Amadeus uses OAuth2 token with in-memory cache (token valid ~30min)
- Retry: max 2 retries with exponential backoff (1s, 3s)
- Timeout: 10s per request

## Decision: "Melhor Equilíbrio" Score Formula

**Decision**: Normalized weighted score: `0.5 * priceScore + 0.3 * durationScore + 0.2 * stopsScore`

**Rationale**: Per user clarification. Each component normalized 0-1 within the result set (best=1, worst=0). This means scores are relative to the current search results, not absolute.

**Formula**:
```
priceScore = 1 - (price - minPrice) / (maxPrice - minPrice)
durationScore = 1 - (duration - minDuration) / (maxDuration - minDuration)
stopsScore = 1 - (stops - minStops) / (maxStops - minStops)
balanceScore = 0.5 * priceScore + 0.3 * durationScore + 0.2 * stopsScore
```

If all values are equal for a dimension (e.g., all same price), that score = 1 for all.

## Decision: City Day Distribution Algorithm

**Decision**: Weighted proportional distribution based on city tourism relevance scores

**Rationale**: Per user clarification. Capital/major tourist cities get more days. Minimum 2 nights enforced. Arrival/departure days are lighter.

**Algorithm**:
1. Assign relevance weight to each city (from static data: Paris=5, Rome=4, Lisbon=3, etc.)
2. Calculate total available nights (totalDays - 1, minus travel days)
3. Distribute proportionally: `cityNights = round(weight/totalWeight * availableNights)`
4. Enforce minimum 2 nights per city
5. If total exceeds available, reduce from lowest-weight cities
6. If total is under, add to highest-weight cities
7. First day = arrival (light schedule), last day = departure (morning only)

## Decision: Sharing via Public Link

**Decision**: UUID-based share token stored on Trip model, accessible without auth

**Rationale**: Simple to implement — add `shareToken` field (nullable UUID). When set, `/viagens/compartilhado/[token]` renders read-only view. No complex permission system needed for MVP.

**Alternatives considered**:
- Signed URLs with expiry: More complex, unnecessary for MVP
- User-to-user sharing: Requires invitation system, too complex

## Decision: Cache Strategy

**Decision**: Database-backed cache (ApiCache model) with TTL per resource type

**Rationale**: Simple, persistent across restarts, queryable for debugging. PostgreSQL JSONB for cached responses. Cleanup via periodic check (not cron — on-read expiry check).

**TTLs**:
- Attractions: 7 days
- Place details: 7 days  
- Images: 30 days
- Opening hours: 24 hours
- Flight results: 15 minutes

## Decision: Rate Limiting

**Decision**: In-memory sliding window rate limiter (per IP) on API routes

**Rationale**: Simple for MVP, no Redis needed. Limits: 10 flight searches/min, 30 itinerary generations/hour per IP.

**Implementation**: Custom middleware using Map<string, number[]> with timestamp arrays. Resets on server restart (acceptable for MVP).

## Decision: Anonymous Trip Linking

**Decision**: Store generated trip data in browser sessionStorage + set httpOnly cookie with trip reference

**Rationale**: sessionStorage holds the full itinerary client-side for immediate display. On login, the API route checks for `pendingTripId` cookie, loads from sessionStorage via client-side POST, and persists to DB under the new user.

**Flow**:
1. Anonymous user completes wizard → itinerary generated server-side → returned to client
2. Client stores in React state (and optionally sessionStorage for page refresh resilience)
3. User clicks "Salvar" → prompted to login/register
4. After auth callback → client POSTs the pending trip to `/api/trips` → persisted with userId

## Decision: Testing Framework

**Decision**: Vitest for unit/integration tests

**Rationale**: Fast, TypeScript-native, Jest-compatible API, works well with Next.js. React Testing Library for component tests if needed later.

**Scope for MVP**:
- Unit: itinerary algorithm, balance score, distribution, validators, sorting
- Integration: mock providers return expected shapes, cache read/write
- No E2E in MVP (would add Playwright later)
