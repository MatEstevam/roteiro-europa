import { FlightSearchParams, FlightSearchResult } from "@/types";

export interface FlightSearchProvider {
  search(params: FlightSearchParams): Promise<FlightSearchResult>;
}
