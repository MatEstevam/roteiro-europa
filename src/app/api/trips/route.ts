import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET: list trips for authenticated user
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Autenticacao necessaria" },
      { status: 401 }
    );
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: {
      travelers: true,
      countries: { orderBy: { order: "asc" } },
      cities: { orderBy: { order: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    trips,
    total: trips.length,
  });
}

// POST: save trip
export async function POST(request: NextRequest) {
  const session = await auth();

  try {
    const body = await request.json();

    if (!body.preferences) {
      return NextResponse.json(
        { error: "Preferencias sao obrigatorias" },
        { status: 400 }
      );
    }

    const pref = body.preferences;

    const trip = await prisma.trip.create({
      data: {
        userId: session?.user?.id || null,
        title: body.title ?? "Nova Viagem",
        startDate: new Date(pref.startDate),
        endDate: new Date(pref.endDate),
        originCity: pref.originCity ?? "",
        originAirport: pref.originAirport ?? null,
        pace: pref.pace ?? "balanced",
        budgetLevel: pref.budgetLevel ?? "moderate",
        interests: pref.interests ?? [],
        transportationPreferences: pref.transportationPreferences ?? [],
        accessibilityNeeds: pref.accessibilityNeeds ?? null,
        dietaryPreferences: pref.dietaryPreferences ?? [],
        mandatoryPlaces: pref.mandatoryPlaces ?? [],
        acceptAlternativeAirports: pref.acceptAlternativeAirports ?? false,
        maxAirportDistance: pref.maxAirportDistance ?? null,
        status: body.itinerary ? "generated" : "draft",
        generatedItinerary: body.itinerary ?? null,
        travelers: pref.travelers
          ? {
              create: Array.isArray(pref.travelers)
                ? pref.travelers.map((t: { type: string; age?: number }) => ({
                    type: t.type,
                    age: t.age ?? null,
                  }))
                : [
                    ...Array.from(
                      { length: pref.travelers.adults || 1 },
                      () => ({ type: "adult" as const })
                    ),
                    ...Array.from(
                      { length: pref.travelers.children || 0 },
                      (_, i) => ({
                        type: "child" as const,
                        age: pref.travelers.childrenAges?.[i] ?? null,
                      })
                    ),
                  ],
            }
          : undefined,
        countries: pref.countries
          ? {
              create: pref.countries.map((c: string, i: number) => ({
                country: c,
                order: i,
              })),
            }
          : undefined,
        cities: (body.itinerary?.cities || pref.cities)
          ? {
              create: (body.itinerary?.cities || pref.cities).map(
                (
                  c: {
                    city: string;
                    country: string;
                    arrivalDate: string;
                    departureDate: string;
                    numberOfNights: number;
                    imageUrl?: string;
                    description?: string;
                  },
                  i: number
                ) => ({
                  city: c.city,
                  country: c.country,
                  arrivalDate: new Date(c.arrivalDate),
                  departureDate: new Date(c.departureDate),
                  numberOfNights: c.numberOfNights,
                  order: i,
                  imageUrl: c.imageUrl ?? null,
                  description: c.description ?? null,
                })
              ),
            }
          : undefined,
      },
      include: {
        travelers: true,
        countries: true,
        cities: true,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    console.error("Error creating trip:", error?.message || error);
    const message = error?.code === "P2002"
      ? "Viagem duplicada"
      : error?.message || "Erro ao salvar viagem";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
