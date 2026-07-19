import { PlacesProvider } from "./types";
import { AttractionSearchParams, Attraction, AttractionDetails } from "@/types";

/**
 * Google Places Provider
 *
 * Uses Google Places API (New) with field masks to minimize costs.
 *
 * Required environment variable:
 * - GOOGLE_PLACES_API_KEY
 *
 * See docs/apis.md for setup instructions.
 */
export class GooglePlacesProvider implements PlacesProvider {
  private apiKey: string;
  private baseUrl = "https://places.googleapis.com/v1";

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY!;
  }

  async searchAttractions(params: AttractionSearchParams): Promise<Attraction[]> {
    const query = `tourist attractions in ${params.city}, ${params.country}`;
    const fieldMask = "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.priceLevel,places.photos";

    const response = await fetch(`${this.baseUrl}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: params.limit || 10,
        languageCode: "pt-BR",
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Google Places search failed: ${response.status}`);
    }

    const data = await response.json();
    return (data.places || []).map((place: any) => this.mapAttraction(place));
  }

  async getPlaceDetails(placeId: string): Promise<AttractionDetails> {
    const fieldMask = "id,displayName,formattedAddress,location,rating,userRatingCount,types,priceLevel,photos,regularOpeningHours,websiteUri,internationalPhoneNumber";

    const response = await fetch(`${this.baseUrl}/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Google Places details failed: ${response.status}`);
    }

    const place = await response.json();
    return {
      ...this.mapAttraction(place),
      openingHours: place.regularOpeningHours?.weekdayDescriptions || undefined,
      website: place.websiteUri || undefined,
      phoneNumber: place.internationalPhoneNumber || undefined,
      photos: (place.photos || []).slice(0, 5).map(
        (p: any) => `https://places.googleapis.com/v1/${p.name}/media?maxHeightPx=400&key=${this.apiKey}`
      ),
    };
  }

  private mapAttraction(place: any): Attraction {
    const category = this.inferCategory(place.types || []);
    return {
      id: place.id || place.name?.replace("places/", "") || "",
      name: place.displayName?.text || "Desconhecido",
      category,
      description: undefined,
      address: place.formattedAddress || undefined,
      latitude: place.location?.latitude || undefined,
      longitude: place.location?.longitude || undefined,
      rating: place.rating || undefined,
      totalRatings: place.userRatingCount || undefined,
      imageUrl: place.photos?.[0]
        ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=400&key=${this.apiKey}`
        : undefined,
      priceLevel: place.priceLevel ? this.mapPriceLevel(place.priceLevel) : undefined,
      types: place.types || undefined,
    };
  }

  private inferCategory(types: string[]): string {
    if (types.includes("museum")) return "museu";
    if (types.includes("church") || types.includes("place_of_worship")) return "igreja";
    if (types.includes("park")) return "parque";
    if (types.includes("restaurant")) return "restaurante";
    if (types.includes("tourist_attraction")) return "monumento";
    return "atração";
  }

  private mapPriceLevel(level: string): number {
    const map: Record<string, number> = {
      PRICE_LEVEL_FREE: 0,
      PRICE_LEVEL_INEXPENSIVE: 1,
      PRICE_LEVEL_MODERATE: 2,
      PRICE_LEVEL_EXPENSIVE: 3,
      PRICE_LEVEL_VERY_EXPENSIVE: 4,
    };
    return map[level] ?? 2;
  }
}
