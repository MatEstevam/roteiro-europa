import { TripPreferences, GeneratedItinerary } from "@/types";

export interface AIItineraryProvider {
  generate(preferences: TripPreferences): Promise<GeneratedItinerary>;
}

// Not implemented in MVP. Interface only for future AI integration.
