import { describe, it, expect } from "vitest";
import { calculateBalanceScore } from "@/lib/flights/balance-score";
import { FlightOffer } from "@/types";

function makeOffer(overrides: Partial<FlightOffer> & { id: string }): FlightOffer {
  return {
    airline: "TAP",
    totalPrice: 3000,
    pricePerPerson: 1500,
    currency: "BRL",
    outbound: {
      departureAirport: "GRU",
      arrivalAirport: "LIS",
      departureTime: "2025-06-15T10:00:00Z",
      arrivalTime: "2025-06-15T22:00:00Z",
      durationMinutes: 600,
      stops: 0,
      stopDetails: [],
    },
    baggageIncluded: true,
    lastUpdatedAt: "2025-01-15T10:00:00Z",
    ...overrides,
  };
}

describe("calculateBalanceScore", () => {
  it("returns 1.0 for the best offer in all dimensions", () => {
    const best = makeOffer({ id: "best", totalPrice: 1000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-15T20:00:00Z", durationMinutes: 300, stops: 0, stopDetails: [] } });
    const worst = makeOffer({ id: "worst", totalPrice: 5000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-16T10:00:00Z", durationMinutes: 900, stops: 2, stopDetails: [] } });

    const allOffers = [best, worst];
    const score = calculateBalanceScore(best, allOffers);

    expect(score).toBe(1.0);
  });

  it("returns 0.0 for the worst offer in all dimensions", () => {
    const best = makeOffer({ id: "best", totalPrice: 1000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-15T20:00:00Z", durationMinutes: 300, stops: 0, stopDetails: [] } });
    const worst = makeOffer({ id: "worst", totalPrice: 5000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-16T10:00:00Z", durationMinutes: 900, stops: 2, stopDetails: [] } });

    const allOffers = [best, worst];
    const score = calculateBalanceScore(worst, allOffers);

    expect(score).toBe(0.0);
  });

  it("price weight is 50% (verify with controlled data)", () => {
    // Offer with best price but worst duration and stops
    const cheapSlow = makeOffer({ id: "cheap-slow", totalPrice: 1000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-16T10:00:00Z", durationMinutes: 900, stops: 2, stopDetails: [] } });
    // Offer with worst price but best duration and stops
    const expensiveFast = makeOffer({ id: "expensive-fast", totalPrice: 5000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-15T20:00:00Z", durationMinutes: 300, stops: 0, stopDetails: [] } });

    const allOffers = [cheapSlow, expensiveFast];

    const cheapScore = calculateBalanceScore(cheapSlow, allOffers);
    const expensiveScore = calculateBalanceScore(expensiveFast, allOffers);

    // cheapSlow: priceScore=1, durationScore=0, stopsScore=0 => 0.5*1 + 0.3*0 + 0.2*0 = 0.5
    expect(cheapScore).toBeCloseTo(0.5, 5);
    // expensiveFast: priceScore=0, durationScore=1, stopsScore=1 => 0.5*0 + 0.3*1 + 0.2*1 = 0.5
    expect(expensiveScore).toBeCloseTo(0.5, 5);
  });

  it("single offer always gets score 1.0", () => {
    const single = makeOffer({ id: "single", totalPrice: 3000 });
    const score = calculateBalanceScore(single, [single]);
    expect(score).toBe(1.0);
  });

  it("handles equal values (all same price -> all get 1.0 for price component)", () => {
    const offer1 = makeOffer({ id: "1", totalPrice: 3000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-15T22:00:00Z", durationMinutes: 600, stops: 0, stopDetails: [] } });
    const offer2 = makeOffer({ id: "2", totalPrice: 3000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T12:00:00Z", arrivalTime: "2025-06-16T00:00:00Z", durationMinutes: 600, stops: 0, stopDetails: [] } });

    const allOffers = [offer1, offer2];
    const score1 = calculateBalanceScore(offer1, allOffers);
    const score2 = calculateBalanceScore(offer2, allOffers);

    // All dimensions equal => all scores are 1
    expect(score1).toBe(1.0);
    expect(score2).toBe(1.0);
  });
});
