import { NextRequest, NextResponse } from "next/server";
import { flightSearchSchema } from "@/lib/validators/flight";
import { getFlightProvider } from "@/lib/providers/flights";
import { checkRateLimit, FLIGHT_SEARCH_LIMIT } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = checkRateLimit(ip, FLIGHT_SEARCH_LIMIT);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Muitas pesquisas. Aguarde um minuto." } },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = flightSearchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Dados de pesquisa inválidos.", details: parsed.error.issues } },
      { status: 400 }
    );
  }

  try {
    const provider = getFlightProvider();
    const results = await provider.search(parsed.data);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json(
      { error: { code: "API_UNAVAILABLE", message: "Não foi possível pesquisar voos. Tente novamente." } },
      { status: 503 }
    );
  }
}
