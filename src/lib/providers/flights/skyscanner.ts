import { FlightSearchProvider } from "./types";
import { FlightSearchParams, FlightSearchResult } from "@/types";

/**
 * Skyscanner Flight Search Provider (STUB)
 *
 * This provider is not yet implemented. It serves as a placeholder
 * for future Skyscanner API integration.
 *
 * Required environment variable:
 * - SKYSCANNER_API_KEY
 *
 * To activate:
 * 1. Obtain API key from Skyscanner Partners
 * 2. Set SKYSCANNER_API_KEY in .env
 * 3. Implement the search method below
 * 4. Update the factory in index.ts to include this provider
 *
 * See docs/apis.md for more details.
 */
export class SkyscannerFlightSearchProvider implements FlightSearchProvider {
  async search(_params: FlightSearchParams): Promise<FlightSearchResult> {
    throw new Error(
      "SkyscannerFlightSearchProvider is not yet implemented. " +
        "See docs/apis.md for integration instructions."
    );
  }
}
