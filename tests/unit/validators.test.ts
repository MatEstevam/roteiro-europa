import { describe, it, expect } from "vitest";
import { tripPreferencesSchema } from "@/lib/validators/trip";
import { flightSearchSchema } from "@/lib/validators/flight";

describe("tripPreferencesSchema", () => {
  const validPreferences = {
    startDate: "2027-06-15",
    endDate: "2027-06-26",
    originCity: "Vitória",
    originAirport: "VIX",
    countries: ["Portugal", "França"],
    preferredCities: ["Lisboa", "Paris"],
    travelers: {
      adults: 2,
      children: 0,
    },
    pace: "balanced" as const,
    interests: ["história", "arte"],
    budgetLevel: "moderate" as const,
    transportationPreferences: ["trem"],
  };

  it("valid trip preferences pass", () => {
    const result = tripPreferencesSchema.safeParse(validPreferences);
    expect(result.success).toBe(true);
  });

  it("rejects 0 adults", () => {
    const result = tripPreferencesSchema.safeParse({
      ...validPreferences,
      travelers: { adults: 0, children: 0 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects endDate before startDate", () => {
    const result = tripPreferencesSchema.safeParse({
      ...validPreferences,
      startDate: "2027-06-20",
      endDate: "2027-06-10",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty countries array", () => {
    const result = tripPreferencesSchema.safeParse({
      ...validPreferences,
      countries: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("flightSearchSchema", () => {
  const validSearch = {
    origin: "GRU",
    destination: "LIS",
    departureDate: "2027-06-15",
    adults: 2,
    children: 0,
    cabinClass: "economy" as const,
    directOnly: false,
    currency: "BRL",
    maxResults: 20,
  };

  it("valid flight search passes", () => {
    const result = flightSearchSchema.safeParse(validSearch);
    expect(result.success).toBe(true);
  });

  it("rejects empty origin", () => {
    const result = flightSearchSchema.safeParse({
      ...validSearch,
      origin: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty destination", () => {
    const result = flightSearchSchema.safeParse({
      ...validSearch,
      destination: "",
    });
    expect(result.success).toBe(false);
  });
});
