# Data Model: Roteiro Europa MVP

**Date**: 2026-07-18

## Entity Relationship Overview

```
User 1──* Trip
Trip 1──* TripTraveler
Trip 1──* TripCountry
Trip 1──* TripCity
Trip 1──* ItineraryDay
Trip 1──* FlightSearch
ItineraryDay 1──* ItineraryActivity
FlightSearch 1──* FlightOffer
User 1──* SavedPlace
```

## Entities

### User

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| name | String | Optional |
| email | String | Unique, required |
| emailVerified | DateTime | Optional |
| image | String | Optional (avatar URL) |
| passwordHash | String | Optional (null if OAuth-only) |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto-updated |

**Notes**: Standard Auth.js User model. Includes Account/Session/VerificationToken models per Auth.js Prisma adapter requirements.

### Trip

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → User, nullable (anonymous trips before linking) |
| title | String | Required |
| startDate | DateTime | Required |
| endDate | DateTime | Required |
| originCity | String | Required |
| originAirport | String | Optional (IATA code) |
| pace | Enum | "slow" / "balanced" / "intense" |
| budgetLevel | Enum | "economic" / "moderate" / "comfortable" |
| interests | String[] | Array of interest tags |
| transportationPreferences | String[] | Array |
| accessibilityNeeds | String | Optional |
| dietaryPreferences | String[] | Optional array |
| mandatoryPlaces | String[] | Optional array |
| acceptAlternativeAirports | Boolean | Default: false |
| maxAirportDistance | Int | Optional (km) |
| shareToken | UUID | Nullable, unique (for public sharing) |
| status | Enum | "draft" / "generated" / "saved" |
| generatedItinerary | JSON | Full GeneratedItinerary object (denormalized for quick load) |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto-updated |

**State transitions**: draft → generated (after algorithm runs) → saved (after user explicitly saves)

**Notes**: `generatedItinerary` stores the full JSON for fast retrieval. Normalized tables (TripCity, ItineraryDay, ItineraryActivity) enable querying/filtering.

### TripTraveler

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| tripId | UUID | FK → Trip |
| type | Enum | "adult" / "child" |
| age | Int | Optional (required if child) |

### TripCountry

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| tripId | UUID | FK → Trip |
| country | String | Required |
| order | Int | Display order |

### TripCity

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| tripId | UUID | FK → Trip |
| city | String | Required |
| country | String | Required |
| arrivalDate | DateTime | Required |
| departureDate | DateTime | Required |
| numberOfNights | Int | Required, min: 1 |
| order | Int | Sequence in itinerary |
| imageUrl | String | Optional |
| description | String | Optional |

### ItineraryDay

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| tripId | UUID | FK → Trip |
| dayNumber | Int | Required (1-based) |
| date | DateTime | Required |
| city | String | Required |
| country | String | Required |
| title | String | Required |
| summary | String | Optional |
| estimatedCostMin | Decimal | Required |
| estimatedCostMax | Decimal | Required |
| currency | String | Default: "BRL" |

### ItineraryActivity

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| dayId | UUID | FK → ItineraryDay |
| name | String | Required |
| description | String | Optional |
| category | String | Required |
| date | DateTime | Required |
| startTime | String | Required (HH:mm format) |
| endTime | String | Required (HH:mm format) |
| durationMinutes | Int | Required |
| estimatedCostMin | Decimal | Default: 0 |
| estimatedCostMax | Decimal | Default: 0 |
| currency | String | Default: "BRL" |
| openingHours | JSON | Optional (array of strings) |
| address | String | Optional |
| latitude | Float | Optional |
| longitude | Float | Optional |
| imageUrl | String | Optional |
| bookingRecommended | Boolean | Default: false |
| bookingUrl | String | Optional |
| website | String | Optional |
| source | String | Optional (provider name) |
| sourcePlaceId | String | Optional |
| lastCheckedAt | DateTime | Optional |
| order | Int | Sequence within day |
| notes | String[] | Optional array |

### FlightSearch

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| tripId | UUID | FK → Trip, optional |
| userId | UUID | FK → User, optional |
| origin | String | Required (IATA or city) |
| destination | String | Required (IATA or city) |
| departureDate | DateTime | Required |
| returnDate | DateTime | Optional |
| adults | Int | Required, min: 1 |
| children | Int | Default: 0 |
| cabinClass | String | Default: "economy" |
| directOnly | Boolean | Default: false |
| maxStops | Int | Optional |
| provider | String | Required (mock/amadeus/skyscanner) |
| searchedAt | DateTime | Default: now() |

### FlightOffer

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| searchId | UUID | FK → FlightSearch |
| airline | String | Required |
| airlineLogo | String | Optional |
| totalPrice | Decimal | Required |
| pricePerPerson | Decimal | Required |
| currency | String | Default: "BRL" |
| departureAirport | String | Required (IATA) |
| arrivalAirport | String | Required (IATA) |
| departureTime | DateTime | Required |
| arrivalTime | DateTime | Required |
| durationMinutes | Int | Required |
| stops | Int | Default: 0 |
| stopDetails | JSON | Optional (array of connection info) |
| baggageIncluded | Boolean | Optional |
| bookingUrl | String | Optional |
| balanceScore | Float | Optional (calculated) |
| provider | String | Required |
| lastUpdatedAt | DateTime | Required |

### SavedPlace

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| userId | UUID | FK → User |
| name | String | Required |
| city | String | Required |
| country | String | Required |
| placeId | String | Optional (external provider ID) |
| notes | String | Optional |
| createdAt | DateTime | Default: now() |

### ApiCache

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| key | String | Unique, indexed |
| type | String | Required (attractions/places/images/flights/hours) |
| data | JSON | Required |
| expiresAt | DateTime | Required |
| createdAt | DateTime | Default: now() |

**Index**: `(key)` unique, `(type, expiresAt)` for cleanup queries

## Validation Rules

- Trip.startDate must be in the future
- Trip.endDate must be after startDate
- Trip must have at least 1 adult traveler
- TripCity.numberOfNights >= 1 (algorithm enforces >= 2 except edge cases)
- ItineraryActivity.startTime < endTime
- FlightOffer.totalPrice > 0
- ApiCache entries are soft-deleted (filtered by expiresAt > now())

## Enums

```
TripPace: slow | balanced | intense
BudgetLevel: economic | moderate | comfortable
TripStatus: draft | generated | saved
TravelerType: adult | child
```
