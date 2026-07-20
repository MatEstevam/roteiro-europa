/**
 * Builds a Skyscanner deeplink URL for flight search.
 */
export function buildSkyscannerUrl(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
}): string {
  const outDate = formatDateForSkyscanner(params.departureDate);
  const retDate = params.returnDate
    ? formatDateForSkyscanner(params.returnDate)
    : "";

  const base = "https://www.skyscanner.com.br/transporte/voos";
  const origin = params.origin.toUpperCase();
  const dest = params.destination.toUpperCase();

  const path = retDate
    ? `${base}/${origin}/${dest}/${outDate}/${retDate}/`
    : `${base}/${origin}/${dest}/${outDate}/`;

  const searchParams = new URLSearchParams({
    adults: String(params.adults),
    cabinclass: "economy",
  });
  if (params.children && params.children > 0) {
    searchParams.set("children", String(params.children));
  }

  return `${path}?${searchParams.toString()}`;
}

/**
 * Converts "YYYY-MM-DD" to "YYMMDD" for Skyscanner URLs.
 */
function formatDateForSkyscanner(date: string): string {
  return date.replace(/-/g, "").slice(2);
}
