import { PlacesProvider } from "./types";
import { MockPlacesProvider } from "./mock";

export function getPlacesProvider(): PlacesProvider {
  if (process.env.GOOGLE_PLACES_API_KEY) {
    const { GooglePlacesProvider } = require("./google");
    return new GooglePlacesProvider();
  }
  return new MockPlacesProvider();
}
