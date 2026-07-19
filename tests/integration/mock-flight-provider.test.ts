import { describe, it, expect } from "vitest";
import { MockFlightSearchProvider } from "@/lib/providers/flights/mock";
import { FlightSearchParams } from "@/types";

function makeSearchParams(overrides: Partial<FlightSearchParams> = {}): FlightSearchParams {
  return {
    origin: "VIX",
    destination: "LIS",
    departureDate: "2025-06-15",
    adults: 2,
    children: 0,
    cabinClass: "economy",
    directOnly: false,
    currency: "BRL",
    maxResults: 20,
    ...overrides,
  };
}

describe("MockFlightSearchProvider", () => {
  const provider = new MockFlightSearchProvider();

  it("returns results with isDemo true", async () => {
    const params = makeSearchParams();
    const result = await provider.search(params);

    expect(result.isDemo).toBe(true);
    expect(result.provider).toBe("mock");
    expect(result.searchedAt).toBeTruthy();
  });

  it("respects directOnly filter", async () => {
    const params = makeSearchParams({ directOnly: true });
    const result = await provider.search(params);

    for (const offer of result.offers) {
      expect(offer.outbound.stops).toBe(0);
    }
  });

  it("respects maxStops filter", async () => {
    const params = makeSearchParams({ maxStops: 1 });
    const result = await provider.search(params);

    for (const offer of result.offers) {
      expect(offer.outbound.stops).toBeLessThanOrEqual(1);
    }
  });

  it("returns within maxResults limit", async () => {
    const params = makeSearchParams({ maxResults: 3 });
    const result = await provider.search(params);

    expect(result.offers.length).toBeLessThanOrEqual(3);
  });

  it("all offers have required fields", async () => {
    const params = makeSearchParams();
    const result = await provider.search(params);

    for (const offer of result.offers) {
      expect(offer.id).toBeTruthy();
      expect(offer.airline).toBeTruthy();
      expect(offer.totalPrice).toBeGreaterThan(0);
      expect(offer.pricePerPerson).toBeGreaterThan(0);
      expect(offer.currency).toBeTruthy();
      expect(offer.outbound).toBeDefined();
      expect(offer.outbound.departureAirport).toBeTruthy();
      expect(offer.outbound.arrivalAirport).toBeTruthy();
      expect(offer.outbound.departureTime).toBeTruthy();
      expect(offer.outbound.arrivalTime).toBeTruthy();
      expect(offer.outbound.durationMinutes).toBeGreaterThan(0);
      expect(typeof offer.outbound.stops).toBe("number");
      expect(offer.lastUpdatedAt).toBeTruthy();
    }
  });
});
