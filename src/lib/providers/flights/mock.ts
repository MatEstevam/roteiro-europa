import { FlightSearchProvider } from "./types";
import { FlightSearchParams, FlightSearchResult } from "@/types";
import { getDemoFlights } from "@/lib/demo/flight-data";
import { calculateBalanceScore } from "@/lib/flights/balance-score";

export class MockFlightSearchProvider implements FlightSearchProvider {
  async search(params: FlightSearchParams): Promise<FlightSearchResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    // Find matching route or return empty results
    const demoResult = getDemoFlights(params.origin);

    if (!demoResult) {
      return {
        offers: [],
        provider: "mock",
        searchedAt: new Date().toISOString(),
        isDemo: true,
        metadata: { totalFound: 0 },
      };
    }

    // Apply filters
    let filteredOffers = [...demoResult.offers];

    // Filter by directOnly
    if (params.directOnly) {
      filteredOffers = filteredOffers.filter(
        (offer) => offer.outbound.stops === 0
      );
    }

    // Filter by maxStops
    if (params.maxStops !== undefined) {
      filteredOffers = filteredOffers.filter(
        (offer) => offer.outbound.stops <= params.maxStops!
      );
    }

    // Calculate balance scores for all filtered offers
    filteredOffers = filteredOffers.map((offer) => ({
      ...offer,
      balanceScore: calculateBalanceScore(offer, filteredOffers),
    }));

    // Limit to maxResults
    filteredOffers = filteredOffers.slice(0, params.maxResults);

    return {
      offers: filteredOffers,
      provider: "mock",
      searchedAt: new Date().toISOString(),
      isDemo: true,
      metadata: { totalFound: filteredOffers.length },
    };
  }
}
