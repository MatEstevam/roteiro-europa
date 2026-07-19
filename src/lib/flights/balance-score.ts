import { FlightOffer } from "@/types";

/**
 * Calculates a balance score for a flight offer based on price, duration, and stops.
 *
 * Formula: 0.5 * priceScore + 0.3 * durationScore + 0.2 * stopsScore
 *
 * Each score is normalized: 1 - (value - min) / (max - min)
 * If max === min for a dimension, score = 1 (all offers are equal in that dimension).
 *
 * Higher score = better balance between price, duration, and stops.
 *
 * @param offer - The flight offer to score
 * @param allOffers - All flight offers for normalization
 * @returns A score between 0 and 1
 */
export function calculateBalanceScore(
  offer: FlightOffer,
  allOffers: FlightOffer[]
): number {
  if (allOffers.length === 0) return 0;
  if (allOffers.length === 1) return 1;

  const prices = allOffers.map((o) => o.totalPrice);
  const durations = allOffers.map((o) => o.outbound.durationMinutes);
  const stops = allOffers.map((o) => o.outbound.stops);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minStops = Math.min(...stops);
  const maxStops = Math.max(...stops);

  const priceScore =
    maxPrice === minPrice
      ? 1
      : 1 - (offer.totalPrice - minPrice) / (maxPrice - minPrice);

  const durationScore =
    maxDuration === minDuration
      ? 1
      : 1 - (offer.outbound.durationMinutes - minDuration) / (maxDuration - minDuration);

  const stopsScore =
    maxStops === minStops
      ? 1
      : 1 - (offer.outbound.stops - minStops) / (maxStops - minStops);

  return 0.5 * priceScore + 0.3 * durationScore + 0.2 * stopsScore;
}
