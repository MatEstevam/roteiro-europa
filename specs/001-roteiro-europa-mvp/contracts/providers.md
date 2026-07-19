# Provider Interfaces Contract

**Date**: 2026-07-18

## FlightSearchProvider

```typescript
interface FlightSearchProvider {
  search(params: FlightSearchParams): Promise<FlightSearchResult>;
}

type FlightSearchParams = {
  origin: string;          // IATA code or city name
  destination: string;     // IATA code or city name
  departureDate: string;   // ISO date
  returnDate?: string;     // ISO date (optional for one-way)
  adults: number;
  children: number;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  directOnly: boolean;
  maxStops?: number;
  currency: string;        // ISO 4217
  maxResults: number;
};

type FlightSearchResult = {
  offers: FlightOffer[];
  provider: string;
  searchedAt: string;      // ISO datetime
  isDemo: boolean;
  metadata: {
    totalFound: number;
    cached?: boolean;
    cacheExpiresAt?: string;
  };
};

type FlightOffer = {
  id: string;
  airline: string;
  airlineLogo?: string;
  totalPrice: number;
  pricePerPerson: number;
  currency: string;
  outbound: FlightSegment;
  inbound?: FlightSegment;
  baggageIncluded?: boolean;
  bookingUrl?: string;
  balanceScore?: number;
  lastUpdatedAt: string;
};

type FlightSegment = {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  stopDetails: StopDetail[];
};

type StopDetail = {
  airport: string;
  city: string;
  durationMinutes: number;
};
```

**Implementations**: MockFlightSearchProvider, AmadeusFlightSearchProvider, SkyscannerFlightSearchProvider (stub)

---

## PlacesProvider

```typescript
interface PlacesProvider {
  searchAttractions(params: AttractionSearchParams): Promise<Attraction[]>;
  getPlaceDetails(placeId: string): Promise<AttractionDetails>;
}

type AttractionSearchParams = {
  city: string;
  country: string;
  categories?: string[];
  limit?: number;
};

type Attraction = {
  id: string;
  name: string;
  category: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  totalRatings?: number;
  imageUrl?: string;
  priceLevel?: number;     // 0-4
  types?: string[];
};

type AttractionDetails = Attraction & {
  openingHours?: string[];
  website?: string;
  phoneNumber?: string;
  photos?: string[];
  reviews?: { text: string; rating: number }[];
};
```

**Implementations**: MockPlacesProvider, GooglePlacesProvider

---

## ImageProvider

```typescript
interface ImageProvider {
  search(query: string): Promise<DestinationImage[]>;
}

type DestinationImage = {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  photographerUrl: string;
  source: string;          // "pexels", "mock"
};
```

**Implementations**: MockImageProvider, PexelsImageProvider

---

## AIItineraryProvider (future)

```typescript
interface AIItineraryProvider {
  generate(preferences: TripPreferences): Promise<GeneratedItinerary>;
}
```

**Not implemented in MVP** — interface only for future AI integration.

---

## Provider Factory Pattern

```typescript
// Each provider module exports a factory:
function getFlightProvider(): FlightSearchProvider;
function getPlacesProvider(): PlacesProvider;
function getImageProvider(): ImageProvider;

// Selection logic:
// - If AMADEUS_CLIENT_ID set → AmadeusFlightSearchProvider
// - If GOOGLE_PLACES_API_KEY set → GooglePlacesProvider
// - If PEXELS_API_KEY set → PexelsImageProvider
// - Otherwise → Mock*Provider (always works)
```
