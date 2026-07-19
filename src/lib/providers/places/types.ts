import { AttractionSearchParams, Attraction, AttractionDetails } from "@/types";

export interface PlacesProvider {
  searchAttractions(params: AttractionSearchParams): Promise<Attraction[]>;
  getPlaceDetails(placeId: string): Promise<AttractionDetails>;
}
