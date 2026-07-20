import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  DEMO_TRIP_PREFERENCES,
  DEMO_GENERATED_ITINERARY,
} from "@/lib/demo/trip-data";

// GET: fetch trip by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Demo trip always available
  if (id === "demo-trip-1" || id === "demo") {
    return NextResponse.json({
      id: "demo-trip-1",
      title: "Roteiro Europa - Portugal, Franca e Italia",
      preferences: DEMO_TRIP_PREFERENCES,
      itinerary: DEMO_GENERATED_ITINERARY,
      status: "generated",
      createdAt: "2025-06-01T10:00:00Z",
      updatedAt: "2025-06-01T12:30:00Z",
      isDemo: true,
    });
  }

  const session = await auth();

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      travelers: true,
      countries: { orderBy: { order: "asc" } },
      cities: { orderBy: { order: "asc" } },
      itineraryDays: {
        orderBy: { dayNumber: "asc" },
        include: {
          activities: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!trip) {
    return NextResponse.json(
      { error: "Viagem nao encontrada" },
      { status: 404 }
    );
  }

  // Check access: owner or shared
  const url = new URL(request.url);
  const shareToken = url.searchParams.get("shareToken");

  if (trip.userId !== session?.user?.id && trip.shareToken !== shareToken) {
    return NextResponse.json(
      { error: "Acesso negado" },
      { status: 403 }
    );
  }

  return NextResponse.json(trip);
}

// PUT: update trip preferences
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Autenticacao necessaria" },
      { status: 401 }
    );
  }

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || trip.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Viagem nao encontrada" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const pref = body.preferences;

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title: body.title ?? trip.title,
        pace: pref?.pace ?? trip.pace,
        budgetLevel: pref?.budgetLevel ?? trip.budgetLevel,
        interests: pref?.interests ?? trip.interests,
        transportationPreferences:
          pref?.transportationPreferences ?? trip.transportationPreferences,
        accessibilityNeeds: pref?.accessibilityNeeds ?? trip.accessibilityNeeds,
        dietaryPreferences: pref?.dietaryPreferences ?? trip.dietaryPreferences,
        mandatoryPlaces: pref?.mandatoryPlaces ?? trip.mandatoryPlaces,
        status: body.status ?? trip.status,
        generatedItinerary: body.itinerary ?? trip.generatedItinerary,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
  }
}

// DELETE: delete trip
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Autenticacao necessaria" },
      { status: 401 }
    );
  }

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || trip.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Viagem nao encontrada" },
      { status: 404 }
    );
  }

  await prisma.trip.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
