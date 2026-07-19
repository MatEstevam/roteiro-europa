import { FlightSearchProvider } from "./types";
import { MockFlightSearchProvider } from "./mock";

export function getFlightProvider(): FlightSearchProvider {
  if (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
    const { AmadeusFlightSearchProvider } = require("./amadeus");
    return new AmadeusFlightSearchProvider();
  }
  return new MockFlightSearchProvider();
}
