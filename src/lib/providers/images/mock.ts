import { ImageProvider } from "./types";
import { DestinationImage } from "@/types";

export class MockImageProvider implements ImageProvider {
  async search(query: string): Promise<DestinationImage[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const slug = query.replace(/\s/g, "-").toLowerCase();

    return [
      {
        id: `mock-${slug}-1`,
        url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
        width: 800,
        height: 600,
        alt: `Imagem de ${query} [Demonstração]`,
        photographer: "Demo Photographer",
        photographerUrl: "#",
        source: "mock",
      },
      {
        id: `mock-${slug}-2`,
        url: "https://images.unsplash.com/photo-1493707553966-283afac8c358?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1493707553966-283afac8c358?w=400",
        width: 800,
        height: 600,
        alt: `Vista panorâmica de ${query} [Demonstração]`,
        photographer: "Demo Photographer",
        photographerUrl: "#",
        source: "mock",
      },
      {
        id: `mock-${slug}-3`,
        url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400",
        width: 800,
        height: 600,
        alt: `Paisagem urbana de ${query} [Demonstração]`,
        photographer: "Demo Photographer",
        photographerUrl: "#",
        source: "mock",
      },
    ];
  }
}
