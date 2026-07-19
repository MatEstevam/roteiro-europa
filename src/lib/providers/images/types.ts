import { DestinationImage } from "@/types";

export interface ImageProvider {
  search(query: string): Promise<DestinationImage[]>;
}
