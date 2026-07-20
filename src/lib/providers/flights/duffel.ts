import { FlightSearchProvider } from "./types";
import { FlightSearchParams, FlightSearchResult, FlightOffer } from "@/types";

/**
 * Duffel Flight Search Provider
 *
 * Requires environment variable:
 * - DUFFEL_API_TOKEN (test token starts with duffel_test_, live with duffel_live_)
 */
export class DuffelFlightSearchProvider implements FlightSearchProvider {
  private baseUrl = "https://api.duffel.com";
  private token: string;

  constructor() {
    this.token = process.env.DUFFEL_API_TOKEN!;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Duffel-Version": "v2",
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async search(params: FlightSearchParams): Promise<FlightSearchResult> {
    const slices: any[] = [
      {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departureDate,
      },
    ];

    if (params.returnDate) {
      slices.push({
        origin: params.destination,
        destination: params.origin,
        departure_date: params.returnDate,
      });
    }

    const passengers: any[] = [];
    for (let i = 0; i < params.adults; i++) {
      passengers.push({ type: "adult" });
    }
    for (let i = 0; i < params.children; i++) {
      passengers.push({ type: "child", age: 10 });
    }

    const body = {
      data: {
        slices,
        passengers,
        cabin_class: params.cabinClass,
        ...(params.maxStops !== undefined && {
          max_connections: params.maxStops,
        }),
        ...(params.directOnly && { max_connections: 0 }),
      },
    };

    const response = await fetch(
      `${this.baseUrl}/air/offer_requests?return_offers=true`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("RATE_LIMITED");
      }
      const errorBody = await response.text();
      console.error("Duffel search error:", response.status, errorBody);
      throw new Error(`Duffel search failed: ${response.status}`);
    }

    const data = await response.json();
    const rawOffers = data.data?.offers || [];

    const offers: FlightOffer[] = rawOffers
      .slice(0, params.maxResults)
      .map((offer: any) => this.mapOffer(offer, params));

    return {
      offers,
      provider: "duffel",
      searchedAt: new Date().toISOString(),
      isDemo: false,
      metadata: { totalFound: rawOffers.length },
    };
  }

  private mapOffer(offer: any, params: FlightSearchParams): FlightOffer {
    const outboundSlice = offer.slices?.[0];
    const inboundSlice = offer.slices?.[1];

    return {
      id: offer.id,
      airline: outboundSlice?.segments?.[0]?.operating_carrier?.name || outboundSlice?.segments?.[0]?.marketing_carrier?.name || "Unknown",
      airlineLogo: outboundSlice?.segments?.[0]?.operating_carrier?.logo_symbol_url || outboundSlice?.segments?.[0]?.marketing_carrier?.logo_symbol_url || undefined,
      totalPrice: parseFloat(offer.total_amount || "0"),
      pricePerPerson: parseFloat(offer.total_amount || "0") / params.adults,
      currency: offer.total_currency || params.currency,
      outbound: this.mapSlice(outboundSlice),
      ...(inboundSlice && { inbound: this.mapSlice(inboundSlice) }),
      baggageIncluded: this.hasBaggage(offer),
      bookingUrl: undefined,
      lastUpdatedAt: new Date().toISOString(),
    };
  }

  private mapSlice(slice: any) {
    const segments = slice?.segments || [];
    const first = segments[0];
    const last = segments[segments.length - 1];

    const durationMinutes = segments.reduce(
      (total: number, seg: any) =>
        total + this.parseDuration(seg.duration),
      0
    );

    return {
      departureAirport: first?.origin?.iata_code || "",
      arrivalAirport: last?.destination?.iata_code || "",
      departureTime: first?.departing_at || "",
      arrivalTime: last?.arriving_at || "",
      durationMinutes,
      stops: segments.length - 1,
      stopDetails: segments.slice(1).map((seg: any) => ({
        airport: seg.origin?.iata_code || "",
        city: seg.origin?.city_name || seg.origin?.iata_code || "",
        durationMinutes: 0,
      })),
    };
  }

  private hasBaggage(offer: any): boolean | undefined {
    const passengerBags =
      offer.passengers?.[0]?.baggages;
    if (!passengerBags) return undefined;
    return passengerBags.some(
      (b: any) => b.type === "checked" && b.quantity > 0
    );
  }

  private parseDuration(iso: string | undefined): number {
    if (!iso) return 0;
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    return parseInt(match[1] || "0") * 60 + parseInt(match[2] || "0");
  }
}
