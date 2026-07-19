import { describe, it, expect } from "vitest";
import { generateItinerary } from "@/lib/itinerary/generator";
import { DEMO_TRIP_PREFERENCES } from "@/lib/demo/trip-data";
import { TripPreferences } from "@/types";

function makePreferences(overrides: Partial<TripPreferences> = {}): TripPreferences {
  return {
    ...DEMO_TRIP_PREFERENCES,
    ...overrides,
  };
}

describe("generateItinerary", () => {
  it("generates correct number of days", () => {
    const prefs = makePreferences();
    const result = generateItinerary(prefs);

    // 2025-06-15 to 2025-06-26 = 12 days
    expect(result.totalDays).toBe(12);
    expect(result.days.length).toBe(12);
  });

  it("first day is arrival (light schedule)", () => {
    const prefs = makePreferences();
    const result = generateItinerary(prefs);

    const firstDay = result.days[0];
    expect(firstDay.title).toContain("Chegada");

    // First day should have logistics activity
    const hasLogistics = firstDay.activities.some(
      (a) => a.category === "logística"
    );
    expect(hasLogistics).toBe(true);
  });

  it("last day is departure", () => {
    const prefs = makePreferences();
    const result = generateItinerary(prefs);

    const lastDay = result.days[result.days.length - 1];
    expect(lastDay.title).toContain("Partida");

    const hasDepartureActivity = lastDay.activities.some(
      (a) => a.name.toLowerCase().includes("aeroporto") || a.name.toLowerCase().includes("check-out")
    );
    expect(hasDepartureActivity).toBe(true);
  });

  it("balanced pace: max 3 main activities per normal day", () => {
    const prefs = makePreferences({ pace: "balanced" });
    const result = generateItinerary(prefs);

    // Check a normal day (not first, last, or travel day)
    const normalDays = result.days.filter(
      (d) =>
        d.dayNumber > 1 &&
        d.dayNumber < result.totalDays &&
        !d.title.includes("Viagem")
    );

    for (const day of normalDays) {
      const mainActivities = day.activities.filter(
        (a) => !["refeição", "logística", "transporte", "lazer"].includes(a.category)
      );
      expect(mainActivities.length).toBeLessThanOrEqual(3);
    }
  });

  it("slow pace: max 2 main activities", () => {
    const prefs = makePreferences({ pace: "slow" });
    const result = generateItinerary(prefs);

    const normalDays = result.days.filter(
      (d) =>
        d.dayNumber > 1 &&
        d.dayNumber < result.totalDays &&
        !d.title.includes("Viagem")
    );

    for (const day of normalDays) {
      const mainActivities = day.activities.filter(
        (a) => !["refeição", "logística", "transporte", "lazer"].includes(a.category)
      );
      expect(mainActivities.length).toBeLessThanOrEqual(2);
    }
  });

  it("intense pace: max 4 main activities", () => {
    const prefs = makePreferences({ pace: "intense" });
    const result = generateItinerary(prefs);

    const normalDays = result.days.filter(
      (d) =>
        d.dayNumber > 1 &&
        d.dayNumber < result.totalDays &&
        !d.title.includes("Viagem")
    );

    for (const day of normalDays) {
      const mainActivities = day.activities.filter(
        (a) => !["refeição", "logística", "transporte", "lazer"].includes(a.category)
      );
      expect(mainActivities.length).toBeLessThanOrEqual(4);
    }
  });

  it("includes free time for trips > 7 days", () => {
    const prefs = makePreferences(); // 12 days
    const result = generateItinerary(prefs);

    const hasFreeTime = result.days.some((d) =>
      d.activities.some((a) => a.name.toLowerCase().includes("livre"))
    );
    expect(hasFreeTime).toBe(true);
  });

  it("all days have city and country filled", () => {
    const prefs = makePreferences();
    const result = generateItinerary(prefs);

    for (const day of result.days) {
      expect(day.city).toBeTruthy();
      expect(day.country).toBeTruthy();
    }
  });
});
