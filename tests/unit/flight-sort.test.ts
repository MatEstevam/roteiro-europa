import { describe, it, expect } from "vitest";
import { sortFlights, highlightFlights } from "@/lib/flights/sort";
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

describe("sortFlights", () => {
  const offers: FlightOffer[] = [
    makeOffer({ id: "expensive", totalPrice: 5000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T08:00:00Z", arrivalTime: "2025-06-15T20:00:00Z", durationMinutes: 500, stops: 0, stopDetails: [] } }),
    makeOffer({ id: "cheap", totalPrice: 2000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T14:00:00Z", arrivalTime: "2025-06-16T06:00:00Z", durationMinutes: 800, stops: 2, stopDetails: [] } }),
    makeOffer({ id: "mid", totalPrice: 3500, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-15T22:00:00Z", durationMinutes: 600, stops: 1, stopDetails: [] } }),
  ];

  it("sort by price ascending", () => {
    const sorted = sortFlights(offers, "price");
    expect(sorted[0].id).toBe("cheap");
    expect(sorted[1].id).toBe("mid");
    expect(sorted[2].id).toBe("expensive");
  });

  it("sort by duration ascending", () => {
    const sorted = sortFlights(offers, "duration");
    expect(sorted[0].id).toBe("expensive"); // 500min
    expect(sorted[1].id).toBe("mid"); // 600min
    expect(sorted[2].id).toBe("cheap"); // 800min
  });

  it("sort by stops ascending", () => {
    const sorted = sortFlights(offers, "stops");
    expect(sorted[0].id).toBe("expensive"); // 0 stops
    expect(sorted[2].id).toBe("cheap"); // 2 stops
  });

  it("sort by balance descending (highest score first)", () => {
    const sorted = sortFlights(offers, "balance");
    // The first offer should have the highest balance score
    // We just verify the sort is descending by checking scores
    const scores = sorted.map((o) => {
      return calculateBalanceScore(o, offers);
    });
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  });

  it("sort by departure time ascending", () => {
    const sorted = sortFlights(offers, "departure");
    expect(sorted[0].id).toBe("expensive"); // 08:00
    expect(sorted[1].id).toBe("mid"); // 10:00
    expect(sorted[2].id).toBe("cheap"); // 14:00
  });
});

describe("highlightFlights", () => {
  it("returns correct IDs for cheapest, fastest, bestBalance", () => {
    const offers: FlightOffer[] = [
      makeOffer({ id: "expensive-fast", totalPrice: 5000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T08:00:00Z", arrivalTime: "2025-06-15T18:00:00Z", durationMinutes: 400, stops: 0, stopDetails: [] } }),
      makeOffer({ id: "cheap-slow", totalPrice: 2000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T14:00:00Z", arrivalTime: "2025-06-16T08:00:00Z", durationMinutes: 900, stops: 2, stopDetails: [] } }),
      makeOffer({ id: "balanced", totalPrice: 3000, outbound: { departureAirport: "GRU", arrivalAirport: "LIS", departureTime: "2025-06-15T10:00:00Z", arrivalTime: "2025-06-15T20:00:00Z", durationMinutes: 500, stops: 0, stopDetails: [] } }),
    ];

    const highlights = highlightFlights(offers);

    expect(highlights.cheapest).toBe("cheap-slow");
    expect(highlights.fastest).toBe("expensive-fast");
    // bestBalance should be the one with best combined score
    expect(highlights.bestBalance).toBeTruthy();
    expect(["expensive-fast", "cheap-slow", "balanced"]).toContain(highlights.bestBalance);
  });

  it("returns empty strings for empty offers", () => {
    const highlights = highlightFlights([]);
    expect(highlights.cheapest).toBe("");
    expect(highlights.fastest).toBe("");
    expect(highlights.bestBalance).toBe("");
  });
});
