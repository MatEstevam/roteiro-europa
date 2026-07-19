# API Routes Contract

**Date**: 2026-07-18

## POST /api/itinerary/generate

Generates a trip itinerary from user preferences.

**Request Body** (TripPreferences):
```json
{
  "startDate": "2026-09-01",
  "endDate": "2026-09-12",
  "originCity": "Vitória",
  "originAirport": "VIX",
  "countries": ["Portugal", "França", "Itália"],
  "preferredCities": ["Lisboa", "Paris", "Roma"],
  "travelers": { "adults": 2, "children": 0, "childrenAges": [] },
  "pace": "balanced",
  "interests": ["história", "gastronomia", "museus"],
  "budgetLevel": "moderate",
  "transportationPreferences": ["trem"],
  "accessibilityNeeds": null,
  "dietaryPreferences": [],
  "mandatoryPlaces": []
}
```

**Response 200** (GeneratedItinerary):
```json
{
  "title": "Europa em 12 dias",
  "summary": "...",
  "totalDays": 12,
  "estimatedTotalCostPerPerson": { "min": 8000, "max": 12000, "currency": "BRL" },
  "cities": [...],
  "days": [...],
  "warnings": [],
  "recommendations": []
}
```

**Response 400**: Validation error (Zod)
**Response 429**: Rate limit exceeded

---

## POST /api/flights/search

Searches for flight offers.

**Request Body** (FlightSearchParams):
```json
{
  "origin": "VIX",
  "destination": "LIS",
  "departureDate": "2026-09-01",
  "returnDate": "2026-09-12",
  "adults": 2,
  "children": 0,
  "cabinClass": "economy",
  "directOnly": false,
  "maxStops": 2,
  "currency": "BRL",
  "maxResults": 20
}
```

**Response 200** (FlightSearchResult):
```json
{
  "offers": [...],
  "provider": "mock",
  "searchedAt": "2026-07-18T10:00:00Z",
  "isDemo": true,
  "metadata": { "totalFound": 15 }
}
```

**Response 400**: Validation error
**Response 429**: Rate limit exceeded
**Response 503**: External API unavailable (with fallback suggestion)

---

## POST /api/trips

Creates/saves a trip for authenticated user.

**Auth**: Required (returns 401 if not authenticated)

**Request Body**: Full trip data + generated itinerary

**Response 201**: Created trip with id
**Response 401**: Not authenticated

---

## GET /api/trips

Lists trips for authenticated user.

**Auth**: Required

**Response 200**: Array of trip summaries (id, title, dates, status, cities)

---

## GET /api/trips/[id]

Gets full trip with itinerary.

**Auth**: Required (owner) OR valid shareToken query param

**Response 200**: Full trip + itinerary
**Response 403**: Not owner and no valid share token
**Response 404**: Trip not found

---

## GET /api/trips/compartilhado/[token]

Gets shared trip (read-only, no auth).

**Response 200**: Trip + itinerary (read-only view)
**Response 404**: Invalid or expired token

---

## POST /api/trips/[id]/share

Generates share token for a trip.

**Auth**: Required (owner)

**Response 200**: `{ "shareToken": "uuid", "shareUrl": "/viagens/compartilhado/uuid" }`

---

## PUT /api/trips/[id]

Updates trip preferences.

**Auth**: Required (owner)

**Response 200**: Updated trip

---

## Common Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly message in pt-BR",
    "details": [...]
  }
}
```

Error codes: `VALIDATION_ERROR`, `RATE_LIMITED`, `NOT_FOUND`, `UNAUTHORIZED`, `API_UNAVAILABLE`, `TRIP_TOO_SHORT`
