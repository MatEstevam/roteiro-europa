import { PlacesProvider } from "./types";
import { AttractionSearchParams, Attraction, AttractionDetails } from "@/types";
import { DEMO_ATTRACTIONS } from "@/lib/demo/places-data";

export class MockPlacesProvider implements PlacesProvider {
  async searchAttractions(params: AttractionSearchParams): Promise<Attraction[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Find attractions for the city
    const cityAttractions = DEMO_ATTRACTIONS[params.city] || [];

    // Filter by categories if specified
    let filtered = cityAttractions;
    if (params.categories && params.categories.length > 0) {
      filtered = cityAttractions.filter(
        (attraction) =>
          params.categories!.includes(attraction.category) ||
          (attraction.types &&
            attraction.types.some((t) => params.categories!.includes(t)))
      );
    }

    // Limit results
    const limit = params.limit || 10;
    return filtered.slice(0, limit);
  }

  async getPlaceDetails(placeId: string): Promise<AttractionDetails> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find by id across all cities
    for (const attractions of Object.values(DEMO_ATTRACTIONS)) {
      const found = attractions.find((a) => a.id === placeId);
      if (found) {
        return {
          ...found,
          openingHours: ["09:00 - 18:00"],
          website: "#",
          phoneNumber: undefined,
          photos: found.imageUrl ? [found.imageUrl] : [],
        };
      }
    }

    throw new Error(`Place not found: ${placeId}`);
  }
}
