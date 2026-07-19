import { ImageProvider } from "./types";
import { DestinationImage } from "@/types";

/**
 * Pexels Image Provider
 *
 * Required environment variable:
 * - PEXELS_API_KEY
 *
 * Note: Pexels requires attribution. Images must display photographer credit.
 * See docs/apis.md for setup instructions.
 */
export class PexelsImageProvider implements ImageProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY!;
  }

  async search(query: string): Promise<DestinationImage[]> {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      {
        headers: { Authorization: this.apiKey },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels search failed: ${response.status}`);
    }

    const data = await response.json();
    return (data.photos || []).map((photo: any) => ({
      id: String(photo.id),
      url: photo.src.large2x || photo.src.large,
      thumbnailUrl: photo.src.medium,
      width: photo.width,
      height: photo.height,
      alt: photo.alt || `Foto de ${query}`,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      source: "pexels",
    }));
  }
}
