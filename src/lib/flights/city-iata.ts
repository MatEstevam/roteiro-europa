/**
 * Maps city names to their main airport IATA codes.
 * Used for Duffel flight search and Skyscanner deeplinks.
 */
export const CITY_IATA: Record<string, string> = {
  // Europa
  Lisboa: "LIS",
  Porto: "OPO",
  Paris: "CDG",
  Lyon: "LYS",
  Nice: "NCE",
  Marselha: "MRS",
  Roma: "FCO",
  Milao: "MXP",
  Veneza: "VCE",
  Florenca: "FLR",
  Napoles: "NAP",
  Madrid: "MAD",
  Barcelona: "BCN",
  Sevilha: "SVQ",
  Amsterdam: "AMS",
  Berlim: "BER",
  Munique: "MUC",
  Frankfurt: "FRA",
  Viena: "VIE",
  Praga: "PRG",
  Zurique: "ZRH",
  Genebra: "GVA",
  Bruxelas: "BRU",
  Dublin: "DUB",
  Londres: "LHR",
  Edimburgo: "EDI",
  Atenas: "ATH",
  Istambul: "IST",
  Budapeste: "BUD",
  Varsovia: "WAW",
  Copenhague: "CPH",
  Estocolmo: "ARN",
  Oslo: "OSL",
  Helsinki: "HEL",
  // Americas
  "Nova York": "JFK",
  "Los Angeles": "LAX",
  Miami: "MIA",
  Orlando: "MCO",
  Chicago: "ORD",
  "San Francisco": "SFO",
  Toronto: "YYZ",
  Vancouver: "YVR",
  "Cidade do Mexico": "MEX",
  "Buenos Aires": "EZE",
  Santiago: "SCL",
  Lima: "LIM",
  Bogota: "BOG",
  // Asia
  Toquio: "NRT",
  Osaka: "KIX",
  Kyoto: "KIX",
  Pequim: "PEK",
  Xangai: "PVG",
  "Hong Kong": "HKG",
  Singapura: "SIN",
  Bangkok: "BKK",
  Seul: "ICN",
  Dubai: "DXB",
  // Oceania
  Sydney: "SYD",
  Melbourne: "MEL",
  Auckland: "AKL",
  // Africa
  "Cidade do Cabo": "CPT",
  Cairo: "CAI",
  Marrakech: "RAK",
  // Brasil
  "Sao Paulo": "GRU",
  "Rio de Janeiro": "GIG",
  Vitoria: "VIX",
  "Belo Horizonte": "CNF",
  Brasilia: "BSB",
  Salvador: "SSA",
  Recife: "REC",
  Fortaleza: "FOR",
  Curitiba: "CWB",
  "Porto Alegre": "POA",
  Florianopolis: "FLN",
  Manaus: "MAO",
  Belem: "BEL",
};

/**
 * Looks up the IATA code for a city name.
 * Tries exact match first, then case-insensitive, then partial match.
 */
export function getCityIata(cityName: string): string | null {
  // Exact match
  if (CITY_IATA[cityName]) return CITY_IATA[cityName];

  // Case-insensitive match
  const lower = cityName.toLowerCase();
  for (const [city, iata] of Object.entries(CITY_IATA)) {
    if (city.toLowerCase() === lower) return iata;
  }

  // Partial match (e.g. "São Paulo" matches "Sao Paulo")
  const normalized = lower
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  for (const [city, iata] of Object.entries(CITY_IATA)) {
    const cityNorm = city
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (cityNorm === normalized) return iata;
  }

  return null;
}
