import { NextRequest, NextResponse } from "next/server";
import { tripPreferencesSchema } from "@/lib/validators/trip";
import { generateItinerary } from "@/lib/itinerary/generator";
import { checkRateLimit, ITINERARY_LIMIT } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { GeneratedItinerary } from "@/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(ip, ITINERARY_LIMIT);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message:
            "Muitas solicitacoes. Tente novamente em alguns minutos.",
        },
      },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = tripPreferencesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Dados invalidos.",
          details: parsed.error.issues,
        },
      },
      { status: 400 }
    );
  }

  try {
    const pref = parsed.data;
    let itinerary: GeneratedItinerary;

    // Use AI if OpenAI key is available, otherwise fallback to deterministic
    if (process.env.OPENAI_API_KEY) {
      const { OpenAIItineraryProvider } = await import(
        "@/lib/itinerary/openai-provider"
      );
      const provider = new OpenAIItineraryProvider();
      itinerary = await provider.generate(pref);
    } else {
      itinerary = generateItinerary(pref);
    }

    // Save trip + itinerary to database
    const session = await auth();

    const trip = await prisma.trip.create({
      data: {
        userId: session?.user?.id || null,
        title: itinerary.title,
        startDate: new Date(pref.startDate),
        endDate: new Date(pref.endDate),
        originCity: pref.originCity,
        originAirport: pref.originAirport || null,
        pace: pref.pace,
        budgetLevel: pref.budgetLevel,
        interests: pref.interests,
        transportationPreferences: pref.transportationPreferences,
        accessibilityNeeds: pref.accessibilityNeeds || null,
        dietaryPreferences: pref.dietaryPreferences || [],
        mandatoryPlaces: pref.mandatoryPlaces || [],
        acceptAlternativeAirports: false,
        status: "generated",
        generatedItinerary: itinerary as any,
        travelers: {
          create: [
            ...Array.from({ length: pref.travelers.adults }, () => ({
              type: "adult" as const,
            })),
            ...Array.from({ length: pref.travelers.children }, (_, i) => ({
              type: "child" as const,
              age: pref.travelers.childrenAges?.[i] || null,
            })),
          ],
        },
        countries: {
          create: pref.countries.map((c: string, i: number) => ({
            country: c,
            order: i,
          })),
        },
        cities: {
          create: itinerary.cities.map((c, i) => ({
            city: c.city,
            country: c.country,
            arrivalDate: new Date(c.arrivalDate),
            departureDate: new Date(c.departureDate),
            numberOfNights: c.numberOfNights,
            order: i,
            description: c.description || null,
          })),
        },
      },
    });

    return NextResponse.json({ id: trip.id, itinerary });
  } catch (error) {
    console.error("Itinerary generation error:", error);
    return NextResponse.json(
      {
        error: {
          code: "GENERATION_ERROR",
          message:
            "Nao foi possivel gerar o roteiro. Tente novamente.",
        },
      },
      { status: 500 }
    );
  }
}
