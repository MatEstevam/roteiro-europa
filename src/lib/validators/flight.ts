import { z } from "zod";

export const flightSearchSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  adults: z.number().min(1),
  children: z.number().min(0),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]),
  directOnly: z.boolean(),
  maxStops: z.number().optional(),
  currency: z.string().optional().default("BRL"),
  maxResults: z.number().optional().default(20),
});

export type FlightSearchInput = z.infer<typeof flightSearchSchema>;
