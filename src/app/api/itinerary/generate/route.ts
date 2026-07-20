import { NextRequest, NextResponse } from "next/server";
import { tripPreferencesSchema } from "@/lib/validators/trip";
import { generateItinerary } from "@/lib/itinerary/generator";
import { checkRateLimit, ITINERARY_LIMIT } from "@/lib/rate-limit";
import { GeneratedItinerary } from "@/types";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(ip, ITINERARY_LIMIT);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Muitas solicitacoes. Tente novamente em alguns minutos.",
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

    if (process.env.OPENAI_API_KEY) {
      const { OpenAIItineraryProvider } = await import(
        "@/lib/itinerary/openai-provider"
      );
      const provider = new OpenAIItineraryProvider();
      itinerary = await provider.generate(pref);
    } else {
      itinerary = generateItinerary(pref);
    }

    // Return itinerary without saving to DB (client will save via POST /api/trips)
    return NextResponse.json({ itinerary, preferences: pref });
  } catch (error: any) {
    console.error("Itinerary generation error:", error?.message || error);
    return NextResponse.json(
      {
        error: {
          code: "GENERATION_ERROR",
          message:
            error?.message || "Nao foi possivel gerar o roteiro. Tente novamente.",
        },
      },
      { status: 500 }
    );
  }
}
