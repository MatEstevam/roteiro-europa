import { CityInfo } from "./city-data";

export type CityAllocation = {
  city: CityInfo;
  nights: number;
  arrivalDay: number; // 1-based
  departureDay: number;
};

/**
 * Geographic regions for sorting cities to minimize travel.
 * Lower region number = further west/south, higher = further east/north.
 */
const REGION_ORDER: Record<string, number> = {
  // Iberian Peninsula
  Portugal: 1,
  Espanha: 2,
  // Western Europe
  França: 3,
  Bélgica: 4,
  Holanda: 5,
  "Reino Unido": 5,
  // Central Europe
  Alemanha: 6,
  Suíça: 7,
  Áustria: 8,
  "República Tcheca": 8,
  // Southern Europe
  Itália: 6,
};

/**
 * Sub-region order within a country for sorting cities.
 */
const CITY_SUBREGION: Record<string, number> = {
  Lisboa: 1,
  Porto: 2,
  Sintra: 1,
  Faro: 0,
  Madrid: 1,
  Barcelona: 2,
  Sevilha: 0,
  Granada: 0,
  Paris: 1,
  Nice: 2,
  Lyon: 2,
  Marselha: 2,
  Roma: 1,
  Florença: 2,
  Veneza: 3,
  Milão: 4,
  Londres: 1,
  Edimburgo: 2,
  Oxford: 1,
  Amsterdam: 1,
  Roterdã: 1,
  Haia: 1,
  Berlim: 2,
  Munique: 1,
  Frankfurt: 1,
  Hamburgo: 3,
  Zurique: 1,
  Berna: 1,
  Genebra: 0,
  Lucerna: 1,
  Viena: 1,
  Salzburgo: 0,
  Innsbruck: 0,
  Praga: 1,
  "Český Krumlov": 0,
  Brno: 1,
  Bruxelas: 1,
  Bruges: 1,
  Gante: 1,
};

function getRegionSort(city: CityInfo): number {
  const countryRegion = REGION_ORDER[city.country] ?? 5;
  const subRegion = CITY_SUBREGION[city.city] ?? 1;
  return countryRegion * 10 + subRegion;
}

/**
 * Distributes available days among selected cities based on their relevance weight
 * and the chosen travel pace.
 */
export function distributeDays(
  cities: CityInfo[],
  totalDays: number,
  pace: "slow" | "balanced" | "intense"
): CityAllocation[] {
  if (cities.length === 0 || totalDays < 2) return [];

  const totalNights = totalDays - 1;
  const minNightsPerCity = 2;

  // Sort cities geographically to minimize travel
  const sortedCities = [...cities].sort(
    (a, b) => getRegionSort(a) - getRegionSort(b)
  );

  // Determine how many cities we can actually fit
  let fitCities = sortedCities;
  if (fitCities.length * minNightsPerCity > totalNights) {
    // Too many cities — take the most relevant ones
    const byRelevance = [...sortedCities].sort(
      (a, b) => b.relevanceWeight - a.relevanceWeight
    );
    const maxCities = Math.floor(totalNights / minNightsPerCity);
    const selectedNames = new Set(
      byRelevance.slice(0, maxCities).map((c) => c.city)
    );
    fitCities = sortedCities.filter((c) => selectedNames.has(c.city));
  }

  // Calculate proportional distribution
  const totalWeight = fitCities.reduce((s, c) => s + c.relevanceWeight, 0);

  // Base allocation proportional to weight
  let allocations = fitCities.map((city) => {
    const proportional = (city.relevanceWeight / totalWeight) * totalNights;
    return {
      city,
      nights: Math.max(minNightsPerCity, Math.round(proportional)),
    };
  });

  // Adjust for pace
  const paceMultiplier = pace === "slow" ? 1.2 : pace === "intense" ? 0.8 : 1;
  if (pace !== "balanced") {
    allocations = allocations.map((a) => ({
      ...a,
      nights: Math.max(
        minNightsPerCity,
        Math.round(a.nights * paceMultiplier)
      ),
    }));
  }

  // Normalize to fit total nights
  let totalAllocated = allocations.reduce((s, a) => s + a.nights, 0);
  while (totalAllocated !== totalNights) {
    if (totalAllocated > totalNights) {
      // Remove from the city with most nights (that's above minimum)
      const maxIdx = allocations.reduce(
        (best, a, i) =>
          a.nights > allocations[best].nights && a.nights > minNightsPerCity
            ? i
            : best,
        0
      );
      if (allocations[maxIdx].nights > minNightsPerCity) {
        allocations[maxIdx].nights--;
        totalAllocated--;
      } else {
        break; // Can't reduce further
      }
    } else {
      // Add to the city with highest weight that has fewest nights relative to weight
      const bestIdx = allocations.reduce((best, a, i) => {
        const ratio = a.nights / a.city.relevanceWeight;
        const bestRatio =
          allocations[best].nights / allocations[best].city.relevanceWeight;
        return ratio < bestRatio ? i : best;
      }, 0);
      allocations[bestIdx].nights++;
      totalAllocated++;
    }
  }

  // Assign arrival/departure days
  let currentDay = 1;
  const result: CityAllocation[] = allocations.map((a) => {
    const allocation: CityAllocation = {
      city: a.city,
      nights: a.nights,
      arrivalDay: currentDay,
      departureDay: currentDay + a.nights,
    };
    currentDay += a.nights;
    return allocation;
  });

  return result;
}
