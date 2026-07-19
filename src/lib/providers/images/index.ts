import { ImageProvider } from "./types";
import { MockImageProvider } from "./mock";

export function getImageProvider(): ImageProvider {
  if (process.env.PEXELS_API_KEY) {
    const { PexelsImageProvider } = require("./pexels");
    return new PexelsImageProvider();
  }
  return new MockImageProvider();
}
