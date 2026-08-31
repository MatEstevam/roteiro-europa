import { z } from "zod";

export const tripDatesSchema = z
  .object({
    startDate: z.string().refine(
      (date) => new Date(date) > new Date(),
      { message: "Start date must be in the future" }
    ),
    endDate: z.string(),
    adults: z.number().min(1).max(10),
    children: z.number().min(0).max(8),
    childrenAges: z.array(z.number().min(0).max(17)).optional(),
  })
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    { message: "End date must be after start date", path: ["endDate"] }
  )
  .refine(
    (data) => {
      if (data.children > 0) {
        return data.childrenAges?.length === data.children;
      }
      return true;
    },
    { message: "Children ages must match children count", path: ["childrenAges"] }
  );

export const tripOriginSchema = z.object({
  originCity: z.string().min(1, "Origin city is required"),
  originAirport: z.string().optional(),
  acceptAlternativeAirports: z.boolean(),
  maxAirportDistance: z.number().optional(),
});

export const tripDestinationsSchema = z.object({
  countries: z.array(z.string()).min(1, "At least one country is required"),
  preferredCities: z.array(z.string()).optional(),
  acceptSuggestions: z.boolean(),
});

export const tripProfileSchema = z.object({
  pace: z.enum(["slow", "balanced", "intense"]),
  interests: z.array(z.string()),
  budgetLevel: z.enum(["economic", "moderate", "comfortable"]),
  transportationPreferences: z.array(z.string()),
  accessibilityNeeds: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  mandatoryPlaces: z.array(z.string()).optional(),
});

export const tripPreferencesSchema = z.object({
  startDate: z.string().refine(
    (date) => {
      const start = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return start >= today;
    },
    { message: "Data de ida deve ser hoje ou no futuro" }
  ),
  endDate: z.string(),
  originCity: z.string().min(1, "Cidade de origem obrigatória"),
  originAirport: z.string().optional(),
  countries: z.array(z.string()).min(1, "Selecione pelo menos um país"),
  preferredCities: z.array(z.string()).optional(),
  travelers: z.object({
    adults: z.coerce.number().min(1).max(10),
    children: z.coerce.number().min(0).max(8),
    childrenAges: z.array(z.coerce.number().min(0).max(17)).optional(),
  }),
  pace: z.enum(["slow", "balanced", "intense"]).default("balanced"),
  interests: z.array(z.string()).default([]),
  budgetLevel: z.enum(["economic", "moderate", "comfortable"]).default("moderate"),
  transportationPreferences: z.array(z.string()).default([]),
  accessibilityNeeds: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  mandatoryPlaces: z.array(z.string()).optional(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: "Data de volta deve ser depois da ida", path: ["endDate"] }
);

export type TripDates = z.infer<typeof tripDatesSchema>;
export type TripOrigin = z.infer<typeof tripOriginSchema>;
export type TripDestinations = z.infer<typeof tripDestinationsSchema>;
export type TripProfile = z.infer<typeof tripProfileSchema>;
export type TripPreferencesInput = z.infer<typeof tripPreferencesSchema>;
