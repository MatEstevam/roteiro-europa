import { NextRequest, NextResponse } from "next/server";
import { tripPreferencesSchema } from "@/lib/validators/trip";
import { generateItinerary } from "@/lib/itinerary/generator";
import { checkRateLimit, ITINERARY_LIMIT } from "@/lib/rate-limit";

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
          message: parsed.error.issues.map((i) => i.message).join(". ") || "Dados invalidos.",
          details: parsed.error.issues,
        },
      },
      { status: 400 }
    );
  }

  try {
    const pref = parsed.data;

    if (process.env.OPENAI_API_KEY) {
      // Stream the OpenAI response to avoid Vercel Hobby 60s timeout
      const { OpenAIItineraryProvider } = await import(
        "@/lib/itinerary/openai-provider"
      );
      const provider = new OpenAIItineraryProvider();
      const stream = await provider.generateStream(pref);

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      const itinerary = generateItinerary(pref);
      return NextResponse.json({ itinerary, preferences: pref });
    }
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
