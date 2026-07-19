"use client";

import { useState, useCallback } from "react";
import { sortFlights, highlightFlights, SortCriteria } from "@/lib/flights/sort";
import type { FlightOffer, FlightSearchParams, FlightSearchResult } from "@/types";

export function useFlightSearch() {
  const [results, setResults] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortByState] = useState<SortCriteria>("price");
  const [metadata, setMetadata] = useState<FlightSearchResult["metadata"] | null>(null);

  const search = useCallback(async (params: Partial<FlightSearchParams>) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar passagens.");
      }

      const data: FlightSearchResult = await res.json();
      const sorted = sortFlights(data.offers, sortBy);
      setResults(sorted);
      setMetadata(data.metadata);
    } catch (err: any) {
      setError(err.message || "Erro na busca de voos.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const setSortBy = useCallback((criteria: SortCriteria) => {
    setSortByState(criteria);
    setResults((prev) => sortFlights(prev, criteria));
  }, []);

  const highlights = highlightFlights(results);

  return {
    results,
    loading,
    error,
    sortBy,
    setSortBy,
    search,
    highlights,
    metadata,
  };
}
