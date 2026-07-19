import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
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
  const session = await getSession();

  // For demo trip: return demo data
  if (id === "demo-trip-1" || id === "demo") {
    return NextResponse.json({
      id: "demo-trip-1",
      title: "Roteiro Europa - Portugal, França e Itália",
      preferences: DEMO_TRIP_PREFERENCES,
      itinerary: DEMO_GENERATED_ITINERARY,
      status: "generated",
      createdAt: "2025-06-01T10:00:00Z",
      updatedAt: "2025-06-01T12:30:00Z",
      userId: session?.user?.email ?? "anonymous",
      isDemo: true,
    });
  }

  return NextResponse.json(
    { error: "Viagem não encontrada" },
    { status: 404 }
  );
}

// PUT: update trip preferences
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Autenticação necessária" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const trip = {
      id,
      title: body.title ?? "Viagem Atualizada",
      preferences: body.preferences ?? DEMO_TRIP_PREFERENCES,
      status: body.status ?? "draft",
      updatedAt: new Date().toISOString(),
      userId: session.user.email,
    };

    return NextResponse.json(trip);
  } catch {
    return NextResponse.json(
      { error: "Dados inválidos" },
      { status: 400 }
    );
  }
}
