import {
  TripPreferences,
  GeneratedItinerary,
  ItineraryDay,
  ItineraryActivity,
  ItineraryCity,
  CostEstimate,
} from "@/types";
import { distributeDays, CityAllocation } from "./distribution";
import {
  getCityInfo,
  getCitiesForCountries,
  getCityAttractions,
  CityInfo,
  CityAttraction,
} from "./city-data";
import { v4 as uuid } from "uuid";
import { format, addDays, differenceInDays, parseISO } from "date-fns";

function activityFromAttraction(
  attraction: CityAttraction,
  startTime: string,
  budgetLevel: "economic" | "moderate" | "comfortable"
): ItineraryActivity {
  const durationMinutes = attraction.estimatedDurationMinutes;
  const [startH, startM] = startTime.split(":").map(Number);
  const endMinutes = startH * 60 + startM + durationMinutes;
  const endH = Math.floor(endMinutes / 60);
  const endM = endMinutes % 60;
  const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

  const costMultiplier =
    budgetLevel === "economic" ? 0.8 : budgetLevel === "comfortable" ? 1.3 : 1;

  return {
    id: uuid(),
    name: attraction.name,
    category: attraction.category,
    description: attraction.description,
    address: attraction.address,
    latitude: attraction.latitude,
    longitude: attraction.longitude,
    suggestedStartTime: startTime,
    suggestedEndTime: endTime,
    estimatedDurationMinutes: durationMinutes,
    estimatedCostPerPerson: {
      min: Math.round(attraction.estimatedCostBRL.min * costMultiplier),
      max: Math.round(attraction.estimatedCostBRL.max * costMultiplier),
      currency: "BRL",
    },
    openingHours: attraction.openingHours,
    website: attraction.website,
    bookingRecommended: attraction.bookingRecommended,
    source: "algoritmo",
  };
}

function createMealActivity(
  type: "café da manhã" | "almoço" | "jantar",
  city: string,
  budgetLevel: "economic" | "moderate" | "comfortable"
): ItineraryActivity {
  const meals = {
    "café da manhã": {
      start: "08:00",
      end: "09:00",
      duration: 60,
      cost:
        budgetLevel === "economic"
          ? { min: 20, max: 40 }
          : budgetLevel === "moderate"
            ? { min: 40, max: 80 }
            : { min: 80, max: 150 },
      description: `Café da manhã no hotel ou em café local em ${city}.`,
    },
    almoço: {
      start: "12:30",
      end: "14:00",
      duration: 90,
      cost:
        budgetLevel === "economic"
          ? { min: 40, max: 70 }
          : budgetLevel === "moderate"
            ? { min: 70, max: 130 }
            : { min: 130, max: 220 },
      description: `Almoço em restaurante local com culinária típica de ${city}.`,
    },
    jantar: {
      start: "19:30",
      end: "21:00",
      duration: 90,
      cost:
        budgetLevel === "economic"
          ? { min: 50, max: 90 }
          : budgetLevel === "moderate"
            ? { min: 90, max: 160 }
            : { min: 160, max: 280 },
      description: `Jantar em restaurante recomendado em ${city}.`,
    },
  };

  const meal = meals[type];
  return {
    id: uuid(),
    name: type === "café da manhã" ? "Café da manhã" : type === "almoço" ? "Almoço" : "Jantar",
    category: "refeição",
    description: meal.description,
    suggestedStartTime: meal.start,
    suggestedEndTime: meal.end,
    estimatedDurationMinutes: meal.duration,
    estimatedCostPerPerson: { ...meal.cost, currency: "BRL" },
    bookingRecommended: type === "jantar" && budgetLevel !== "economic",
    source: "algoritmo",
  };
}

function selectAttractions(
  attractions: CityAttraction[],
  interests: string[],
  count: number,
  usedNames: Set<string>
): CityAttraction[] {
  // Score attractions by interest match
  const scored = attractions
    .filter((a) => !usedNames.has(a.name))
    .map((a) => {
      const interestMatch = a.interests.filter((i) =>
        interests.some(
          (ui) => ui.toLowerCase().includes(i) || i.includes(ui.toLowerCase())
        )
      ).length;
      return { attraction: a, score: interestMatch * 2 + Math.random() };
    })
    .sort((a, b) => b.score - a.score);

  const selected = scored.slice(0, count).map((s) => s.attraction);
  selected.forEach((a) => usedNames.add(a.name));
  return selected;
}

export function generateItinerary(
  preferences: TripPreferences
): GeneratedItinerary {
  const startDate = parseISO(preferences.startDate);
  const endDate = parseISO(preferences.endDate);
  const totalDays = differenceInDays(endDate, startDate) + 1;

  // Get cities
  let selectedCities: CityInfo[] = [];
  if (preferences.preferredCities && preferences.preferredCities.length > 0) {
    for (const cityName of preferences.preferredCities) {
      const info = getCityInfo(cityName);
      if (info) selectedCities.push(info);
    }
  }

  if (selectedCities.length === 0) {
    // Auto-select from countries
    const allCities = getCitiesForCountries(preferences.countries);
    // Take top cities by relevance
    selectedCities = allCities
      .sort((a, b) => b.relevanceWeight - a.relevanceWeight)
      .slice(0, Math.min(5, Math.floor(totalDays / 2)));
  }

  // Distribute days
  const allocations = distributeDays(
    selectedCities,
    totalDays,
    preferences.pace
  );

  // Generate warnings
  const warnings: string[] = [];
  if (totalDays < selectedCities.length * 2) {
    warnings.push(
      `A viagem de ${totalDays} dias é curta para ${selectedCities.length} cidades. Considere reduzir o número de destinos.`
    );
  }
  if (
    preferences.pace === "intense" &&
    preferences.travelers.children > 0 &&
    preferences.travelers.childrenAges?.some((age) => age < 10)
  ) {
    warnings.push(
      "Ritmo intenso pode ser cansativo para crianças pequenas. Considere o ritmo equilibrado."
    );
  }
  if (totalDays > 14 && preferences.pace === "intense") {
    warnings.push(
      "Viagens longas em ritmo intenso podem causar fadiga. Considere incluir dias de descanso."
    );
  }

  // Generate recommendations
  const recommendations: string[] = [
    "Reserve ingressos para atrações populares com antecedência, especialmente em alta temporada.",
    "Considere um seguro viagem que cubra cancelamentos e emergências médicas.",
    "Mantenha cópias digitais de documentos importantes (passaporte, reservas, seguro).",
  ];
  if (preferences.countries.length > 2) {
    recommendations.push(
      "Para múltiplos países, verifique se precisa de adaptadores de tomada diferentes."
    );
  }
  if (
    preferences.budgetLevel === "economic" &&
    preferences.countries.includes("Suíça")
  ) {
    recommendations.push(
      "A Suíça é significativamente mais cara. Considere comprar mantimentos em supermercados como Migros ou Coop."
    );
  }

  // Build itinerary cities
  const itineraryCities: ItineraryCity[] = allocations.map((alloc) => {
    const arrivalDate = addDays(startDate, alloc.arrivalDay - 1);
    const departureDate = addDays(startDate, alloc.departureDay - 1);
    const dailyCost =
      alloc.city.dailyCostPerPerson[preferences.budgetLevel];

    return {
      city: alloc.city.city,
      country: alloc.city.country,
      arrivalDate: format(arrivalDate, "yyyy-MM-dd"),
      departureDate: format(departureDate, "yyyy-MM-dd"),
      numberOfNights: alloc.nights,
      description: alloc.city.description,
      imageUrl: alloc.city.imageUrl,
      estimatedDailyCostPerPerson: {
        min: dailyCost.min,
        max: dailyCost.max,
        currency: "BRL",
      },
    };
  });

  // Generate days
  const days: ItineraryDay[] = [];
  const activitiesPerDay =
    preferences.pace === "slow" ? 2 : preferences.pace === "intense" ? 4 : 3;
  const usedAttractions = new Set<string>();
  let freeTimeCounter = 0;

  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const dayDate = addDays(startDate, dayNum - 1);
    const currentAlloc = allocations.find(
      (a) => dayNum >= a.arrivalDay && dayNum < a.departureDay
    ) || allocations[allocations.length - 1];

    const cityName = currentAlloc.city.city;
    const countryName = currentAlloc.city.country;
    const attractions = getCityAttractions(cityName);
    const isFirstDay = dayNum === 1;
    const isLastDay = dayNum === totalDays;
    const isTravelDay =
      allocations.some((a) => a.arrivalDay === dayNum) && dayNum > 1;

    const dayActivities: ItineraryActivity[] = [];

    // Breakfast
    dayActivities.push(
      createMealActivity("café da manhã", cityName, preferences.budgetLevel)
    );

    if (isFirstDay) {
      // Arrival day
      dayActivities.push({
        id: uuid(),
        name: "Chegada e acomodação",
        category: "logística",
        description: `Chegada em ${cityName}, transfer para o hotel e acomodação.`,
        suggestedStartTime: "14:00",
        suggestedEndTime: "15:30",
        estimatedDurationMinutes: 90,
        estimatedCostPerPerson: { min: 50, max: 150, currency: "BRL" },
        bookingRecommended: false,
        source: "algoritmo",
      });

      // 1 light activity
      const selected = selectAttractions(
        attractions,
        preferences.interests,
        1,
        usedAttractions
      );
      if (selected.length > 0) {
        dayActivities.push(
          activityFromAttraction(selected[0], "16:00", preferences.budgetLevel)
        );
      }
    } else if (isLastDay) {
      // Departure day
      const selected = selectAttractions(
        attractions,
        preferences.interests,
        1,
        usedAttractions
      );
      if (selected.length > 0) {
        dayActivities.push(
          activityFromAttraction(selected[0], "09:30", preferences.budgetLevel)
        );
      }

      dayActivities.push({
        id: uuid(),
        name: "Check-out e ida ao aeroporto",
        category: "logística",
        description: `Check-out do hotel e deslocamento ao aeroporto para voo de retorno.`,
        suggestedStartTime: "12:00",
        suggestedEndTime: "14:00",
        estimatedDurationMinutes: 120,
        estimatedCostPerPerson: { min: 50, max: 150, currency: "BRL" },
        bookingRecommended: false,
        source: "algoritmo",
      });
    } else if (isTravelDay) {
      // Travel between cities day
      const prevAlloc = allocations.find((a) => a.departureDay === dayNum);
      const prevCity = prevAlloc ? prevAlloc.city.city : "";

      dayActivities.push({
        id: uuid(),
        name: `Viagem de ${prevCity} para ${cityName}`,
        category: "transporte",
        description: `Deslocamento de ${prevCity} para ${cityName}. Considere trem de alta velocidade ou voo curto.`,
        suggestedStartTime: "09:30",
        suggestedEndTime: "13:00",
        estimatedDurationMinutes: 210,
        estimatedCostPerPerson: { min: 150, max: 500, currency: "BRL" },
        bookingRecommended: true,
        source: "algoritmo",
      });

      // 1-2 afternoon activities
      const count = Math.min(2, activitiesPerDay - 1);
      const selected = selectAttractions(
        attractions,
        preferences.interests,
        count,
        usedAttractions
      );
      let time = "15:00";
      for (const attr of selected) {
        dayActivities.push(
          activityFromAttraction(attr, time, preferences.budgetLevel)
        );
        const [h, m] = time.split(":").map(Number);
        const next = h * 60 + m + attr.estimatedDurationMinutes + 45;
        time = `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`;
      }
    } else {
      // Normal day - check for free time
      freeTimeCounter++;
      const isFreeAfternoon =
        totalDays > 7 && freeTimeCounter % 4 === 0;

      if (isFreeAfternoon) {
        // Morning activities only
        const selected = selectAttractions(
          attractions,
          preferences.interests,
          2,
          usedAttractions
        );
        let time = "09:30";
        for (const attr of selected) {
          dayActivities.push(
            activityFromAttraction(attr, time, preferences.budgetLevel)
          );
          const [h, m] = time.split(":").map(Number);
          const next = h * 60 + m + attr.estimatedDurationMinutes + 45;
          time = `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`;
        }

        dayActivities.push(
          createMealActivity("almoço", cityName, preferences.budgetLevel)
        );
        dayActivities.push({
          id: uuid(),
          name: "Tarde livre",
          category: "lazer",
          description: `Tarde livre para explorar ${cityName} por conta própria, descansar ou fazer compras.`,
          suggestedStartTime: "15:00",
          suggestedEndTime: "18:00",
          estimatedDurationMinutes: 180,
          estimatedCostPerPerson: { min: 0, max: 100, currency: "BRL" },
          bookingRecommended: false,
          source: "algoritmo",
        });
      } else {
        // Full day with activities
        const selected = selectAttractions(
          attractions,
          preferences.interests,
          activitiesPerDay,
          usedAttractions
        );

        let time = "09:30";
        let addedLunch = false;
        for (let i = 0; i < selected.length; i++) {
          // Insert lunch between morning and afternoon
          if (!addedLunch && i >= Math.ceil(selected.length / 2)) {
            dayActivities.push(
              createMealActivity("almoço", cityName, preferences.budgetLevel)
            );
            time = "14:30";
            addedLunch = true;
          }

          dayActivities.push(
            activityFromAttraction(selected[i], time, preferences.budgetLevel)
          );
          const [h, m] = time.split(":").map(Number);
          const next =
            h * 60 + m + selected[i].estimatedDurationMinutes + 45;
          time = `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}`;
        }

        if (!addedLunch) {
          dayActivities.push(
            createMealActivity("almoço", cityName, preferences.budgetLevel)
          );
        }
      }
    }

    // Add dinner for non-departure days
    if (!isLastDay) {
      dayActivities.push(
        createMealActivity("jantar", cityName, preferences.budgetLevel)
      );
    }

    // Sort activities by start time
    dayActivities.sort((a, b) =>
      a.suggestedStartTime.localeCompare(b.suggestedStartTime)
    );

    // Calculate day cost
    const dayCost: CostEstimate = {
      min: dayActivities.reduce(
        (s, a) => s + a.estimatedCostPerPerson.min,
        0
      ),
      max: dayActivities.reduce(
        (s, a) => s + a.estimatedCostPerPerson.max,
        0
      ),
      currency: "BRL",
    };

    // Generate title
    let title: string;
    if (isFirstDay) title = `Chegada em ${cityName}`;
    else if (isLastDay) title = `Partida de ${cityName}`;
    else if (isTravelDay) title = `Viagem para ${cityName}`;
    else title = `Explorando ${cityName}`;

    days.push({
      dayNumber: dayNum,
      date: format(dayDate, "yyyy-MM-dd"),
      city: cityName,
      country: countryName,
      title,
      summary: generateDaySummary(dayActivities, cityName, isFirstDay, isLastDay),
      activities: dayActivities,
      estimatedDailyCostPerPerson: dayCost,
    });
  }

  // Calculate total cost
  const totalCost: CostEstimate = {
    min: days.reduce((s, d) => s + d.estimatedDailyCostPerPerson.min, 0),
    max: days.reduce((s, d) => s + d.estimatedDailyCostPerPerson.max, 0),
    currency: "BRL",
  };

  const cityNames = allocations.map((a) => a.city.city);
  const title = `Roteiro ${cityNames.join(" → ")} - ${totalDays} dias`;
  const summary = `Viagem de ${totalDays} dias passando por ${cityNames.join(", ")} com ritmo ${preferences.pace === "slow" ? "tranquilo" : preferences.pace === "intense" ? "intenso" : "equilibrado"} e orçamento ${preferences.budgetLevel === "economic" ? "econômico" : preferences.budgetLevel === "comfortable" ? "confortável" : "moderado"}.`;

  return {
    title,
    summary,
    totalDays,
    estimatedTotalCostPerPerson: totalCost,
    cities: itineraryCities,
    days,
    warnings,
    recommendations,
  };
}

function generateDaySummary(
  activities: ItineraryActivity[],
  city: string,
  isFirst: boolean,
  isLast: boolean
): string {
  if (isFirst) return `Dia de chegada em ${city} com acomodação e primeiro passeio.`;
  if (isLast) return `Último dia em ${city} com atividade matinal e partida.`;

  const mainActivities = activities
    .filter((a) => !["refeição", "logística"].includes(a.category))
    .map((a) => a.name);

  if (mainActivities.length === 0) return `Dia em ${city}.`;
  if (mainActivities.length <= 2) return mainActivities.join(" e ") + ".";
  return (
    mainActivities.slice(0, -1).join(", ") +
    " e " +
    mainActivities[mainActivities.length - 1] +
    "."
  );
}
