export type TripPreferences = {
  startDate: string;
  endDate: string;
  originCity: string;
  originAirport?: string;
  countries: string[];
  preferredCities?: string[];
  travelers: {
    adults: number;
    children: number;
    childrenAges?: number[];
  };
  pace: "slow" | "balanced" | "intense";
  interests: string[];
  budgetLevel: "economic" | "moderate" | "comfortable";
  transportationPreferences: string[];
  accessibilityNeeds?: string;
  dietaryPreferences?: string[];
  mandatoryPlaces?: string[];
};

export type CostEstimate = {
  min: number;
  max: number;
  currency: string;
};

export type ItineraryCity = {
  city: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  numberOfNights: number;
  imageUrl?: string;
  description: string;
  estimatedDailyCostPerPerson?: CostEstimate;
};

export type ItineraryActivity = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  suggestedStartTime: string;
  suggestedEndTime: string;
  estimatedDurationMinutes: number;
  estimatedCostPerPerson: CostEstimate;
  openingHours?: string[];
  website?: string;
  bookingRecommended: boolean;
  bookingUrl?: string;
  source?: string;
  dataLastCheckedAt?: string;
  notes?: string[];
};

export type ItineraryDay = {
  dayNumber: number;
  date: string;
  city: string;
  country: string;
  title: string;
  summary: string;
  activities: ItineraryActivity[];
  estimatedDailyCostPerPerson: CostEstimate;
};

export type GeneratedItinerary = {
  title: string;
  summary: string;
  totalDays: number;
  estimatedTotalCostPerPerson: CostEstimate;
  cities: ItineraryCity[];
  days: ItineraryDay[];
  warnings: string[];
  recommendations: string[];
};

export type FlightSearchParams = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  directOnly: boolean;
  maxStops?: number;
  currency: string;
  maxResults: number;
};

export type StopDetail = {
  airport: string;
  city: string;
  durationMinutes: number;
};

export type FlightSegment = {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  stopDetails: StopDetail[];
};

export type FlightOffer = {
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

export type FlightSearchResult = {
  offers: FlightOffer[];
  provider: string;
  searchedAt: string;
  isDemo: boolean;
  metadata: {
    totalFound: number;
    cached?: boolean;
    cacheExpiresAt?: string;
  };
};

export type AttractionSearchParams = {
  city: string;
  country: string;
  categories?: string[];
  limit?: number;
};

export type Attraction = {
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
  priceLevel?: number;
  types?: string[];
};

export type AttractionDetails = Attraction & {
  openingHours?: string[];
  website?: string;
  phoneNumber?: string;
  photos?: string[];
};

export type DestinationImage = {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  photographerUrl: string;
  source: string;
};
