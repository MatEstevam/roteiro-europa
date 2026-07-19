import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { DEMO_TRIP_PREFERENCES } from "@/lib/demo/trip-data";

// GET: list trips for authenticated user
export async function GET() {
  const session = await getSession();

  // For MVP without DB: return demo data
  const demoTrips = [
    {
      id: "demo-trip-1",
      title: "Roteiro Europa - Portugal, França e Itália",
      preferences: DEMO_TRIP_PREFERENCES,
      status: "generated",
      createdAt: "2025-06-01T10:00:00Z",
      updatedAt: "2025-06-01T12:30:00Z",
      userId: session?.user?.email ?? "anonymous",
    },
  ];

  return NextResponse.json({
    trips: demoTrips,
    total: demoTrips.length,
  });
}

// POST: save trip
export async function POST(request: NextRequest) {
  const session = await getSession();

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.preferences) {
      return NextResponse.json(
        { error: "Preferências são obrigatórias" },
        { status: 400 }
      );
    }

    // For MVP without DB: return created trip with demo ID
    const trip = {
      id: `trip-${Date.now()}`,
      title: body.title ?? "Nova Viagem",
      preferences: body.preferences,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: session?.user?.email ?? "anonymous",
      shareToken: crypto.randomUUID(),
    };

    return NextResponse.json(trip, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Dados inválidos" },
      { status: 400 }
    );
  }
}
