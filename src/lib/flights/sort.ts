import { FlightOffer } from "@/types";
import { calculateBalanceScore } from "./balance-score";

export type SortCriteria = "price" | "duration" | "stops" | "balance" | "departure";

export function sortFlights(
  offers: FlightOffer[],
  sortBy: SortCriteria
): FlightOffer[] {
  const sorted = [...offers];

  switch (sortBy) {
    case "price":
      return sorted.sort((a, b) => a.totalPrice - b.totalPrice);
    case "duration":
      return sorted.sort(
        (a, b) => a.outbound.durationMinutes - b.outbound.durationMinutes
      );
    case "stops":
      return sorted.sort((a, b) => a.outbound.stops - b.outbound.stops);
    case "balance":
      return sorted.sort((a, b) => {
        const scoreA = calculateBalanceScore(a, offers);
        const scoreB = calculateBalanceScore(b, offers);
        return scoreB - scoreA;
      });
    case "departure":
      return sorted.sort(
        (a, b) =>
          new Date(a.outbound.departureTime).getTime() -
          new Date(b.outbound.departureTime).getTime()
      );
    default:
      return sorted;
  }
}

export function highlightFlights(
  offers: FlightOffer[]
): { cheapest: string; fastest: string; bestBalance: string } {
  if (offers.length === 0) {
    return { cheapest: "", fastest: "", bestBalance: "" };
  }

  const cheapest = offers.reduce((min, o) =>
    o.totalPrice < min.totalPrice ? o : min
  );

  const fastest = offers.reduce((min, o) =>
    o.outbound.durationMinutes < min.outbound.durationMinutes ? o : min
  );

  const bestBalance = offers.reduce((best, o) => {
    const scoreO = calculateBalanceScore(o, offers);
    const scoreBest = calculateBalanceScore(best, offers);
    return scoreO > scoreBest ? o : best;
  });

  return {
    cheapest: cheapest.id,
    fastest: fastest.id,
    bestBalance: bestBalance.id,
  };
}
