import { describe, it, expect } from "vitest";
import { MockPlacesProvider } from "@/lib/providers/places/mock";

describe("MockPlacesProvider", () => {
  const provider = new MockPlacesProvider();

  it("returns attractions for Lisboa", async () => {
    const results = await provider.searchAttractions({
      city: "Lisboa",
      country: "Portugal",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBeTruthy();
    expect(results[0].id).toBeTruthy();
  });

  it("returns attractions for Paris", async () => {
    const results = await provider.searchAttractions({
      city: "Paris",
      country: "França",
    });

    expect(results.length).toBeGreaterThan(0);
  });

  it("filters by category", async () => {
    const results = await provider.searchAttractions({
      city: "Lisboa",
      country: "Portugal",
      categories: ["monumento"],
    });

    expect(results.length).toBeGreaterThan(0);
    for (const attraction of results) {
      const matchesCategory =
        attraction.category === "monumento" ||
        (attraction.types && attraction.types.includes("monumento"));
      expect(matchesCategory).toBe(true);
    }
  });

  it("getPlaceDetails returns details for known ID", async () => {
    const details = await provider.getPlaceDetails("lis-001");

    expect(details).toBeDefined();
    expect(details.name).toBe("Torre de Belém");
    expect(details.openingHours).toBeDefined();
  });

  it("returns empty for unknown city", async () => {
    const results = await provider.searchAttractions({
      city: "CidadeInexistente",
      country: "PaisInexistente",
    });

    expect(results).toEqual([]);
  });
});
