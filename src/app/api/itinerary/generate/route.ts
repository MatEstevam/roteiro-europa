import { NextRequest, NextResponse } from "next/server";
import { tripPreferencesSchema } from "@/lib/validators/trip";
import { generateItinerary } from "@/lib/itinerary/generator";
import { checkRateLimit, ITINERARY_LIMIT } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(ip, ITINERARY_LIMIT);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Muitas solicitações. Tente novamente em alguns minutos." } },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = tripPreferencesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Dados inválidos.", details: parsed.error.issues } },
      { status: 400 }
    );
  }

  try {
    const itinerary = generateItinerary(parsed.data);
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("Itinerary generation error:", error);
    return NextResponse.json(
      { error: { code: "GENERATION_ERROR", message: "Não foi possível gerar o roteiro. Tente novamente." } },
      { status: 500 }
    );
  }
}
