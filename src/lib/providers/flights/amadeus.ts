import { FlightSearchProvider } from "./types";
import { FlightSearchParams, FlightSearchResult } from "@/types";

/**
 * Amadeus Flight Search Provider
 *
 * Requires environment variables:
 * - AMADEUS_CLIENT_ID
 * - AMADEUS_CLIENT_SECRET
 * - AMADEUS_ENV (test or production)
 *
 * Uses OAuth2 authentication with token caching.
 * See docs/apis.md for full setup instructions.
 */
export class AmadeusFlightSearchProvider implements FlightSearchProvider {
  private tokenCache: { token: string; expiresAt: number } | null = null;
  private baseUrl: string;

  constructor() {
    const env = process.env.AMADEUS_ENV || "test";
    this.baseUrl =
      env === "production"
        ? "https://api.amadeus.com"
        : "https://test.api.amadeus.com";
  }

  private async getAccessToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID!,
        client_secret: process.env.AMADEUS_CLIENT_SECRET!,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Amadeus auth failed: ${response.status}`);
    }

    const data = await response.json();
    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return data.access_token;
  }

  async search(params: FlightSearchParams): Promise<FlightSearchResult> {
    const token = await this.getAccessToken();

    const searchParams = new URLSearchParams({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: String(params.adults),
      currencyCode: params.currency,
      max: String(params.maxResults),
    });

    if (params.returnDate) {
      searchParams.set("returnDate", params.returnDate);
    }
    if (params.children > 0) {
      searchParams.set("children", String(params.children));
    }
    if (params.directOnly) {
      searchParams.set("nonStop", "true");
    }

    const response = await fetch(
      `${this.baseUrl}/v2/shopping/flight-offers?${searchParams}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("RATE_LIMITED");
      }
      throw new Error(`Amadeus search failed: ${response.status}`);
    }

    const data = await response.json();
    const offers = (data.data || []).map((offer: any) => this.mapOffer(offer, params));

    return {
      offers,
      provider: "amadeus",
      searchedAt: new Date().toISOString(),
      isDemo: false,
      metadata: { totalFound: offers.length },
    };
  }

  private mapOffer(raw: any, params: FlightSearchParams): any {
    const outboundSegments = raw.itineraries?.[0]?.segments || [];
    const inboundSegments = raw.itineraries?.[1]?.segments || [];

    const firstSeg = outboundSegments[0];
    const lastSeg = outboundSegments[outboundSegments.length - 1];

    return {
      id: raw.id,
      airline: firstSeg?.carrierCode || "Unknown",
      totalPrice: parseFloat(raw.price?.total || "0"),
      pricePerPerson: parseFloat(raw.price?.total || "0") / params.adults,
      currency: raw.price?.currency || params.currency,
      outbound: {
        departureAirport: firstSeg?.departure?.iataCode || params.origin,
        arrivalAirport: lastSeg?.arrival?.iataCode || params.destination,
        departureTime: firstSeg?.departure?.at || "",
        arrivalTime: lastSeg?.arrival?.at || "",
        durationMinutes: this.parseDuration(raw.itineraries?.[0]?.duration),
        stops: outboundSegments.length - 1,
        stopDetails: outboundSegments.slice(1).map((seg: any) => ({
          airport: seg.departure?.iataCode || "",
          city: seg.departure?.iataCode || "",
          durationMinutes: 0,
        })),
      },
      ...(inboundSegments.length > 0 && {
        inbound: {
          departureAirport: inboundSegments[0]?.departure?.iataCode || "",
          arrivalAirport: inboundSegments[inboundSegments.length - 1]?.arrival?.iataCode || "",
          departureTime: inboundSegments[0]?.departure?.at || "",
          arrivalTime: inboundSegments[inboundSegments.length - 1]?.arrival?.at || "",
          durationMinutes: this.parseDuration(raw.itineraries?.[1]?.duration),
          stops: inboundSegments.length - 1,
          stopDetails: [],
        },
      }),
      baggageIncluded: raw.pricingOptions?.includedCheckedBagsOnly ?? undefined,
      bookingUrl: undefined,
      lastUpdatedAt: new Date().toISOString(),
    };
  }

  private parseDuration(iso: string | undefined): number {
    if (!iso) return 0;
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    return (parseInt(match[1] || "0") * 60) + parseInt(match[2] || "0");
  }
}
