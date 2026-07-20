import { TripPreferences, GeneratedItinerary } from "@/types";

export interface AIItineraryProvider {
  generate(preferences: TripPreferences): Promise<GeneratedItinerary>;
}

export { OpenAIItineraryProvider } from "./openai-provider";
