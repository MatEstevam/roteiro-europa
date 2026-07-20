import OpenAI from "openai";
import { TripPreferences, GeneratedItinerary } from "@/types";
import { AIItineraryProvider } from "./ai-provider";
import { v4 as uuidv4 } from "uuid";

export class OpenAIItineraryProvider implements AIItineraryProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generate(preferences: TripPreferences): Promise<GeneratedItinerary> {
    const totalDays = this.calculateDays(preferences.startDate, preferences.endDate);
    const paceLabel = { slow: "tranquilo (max 2 atividades/dia)", balanced: "equilibrado (3 atividades/dia)", intense: "intenso (4 atividades/dia)" }[preferences.pace];
    const budgetLabel = { economic: "economico", moderate: "moderado", comfortable: "confortavel" }[preferences.budgetLevel];

    const systemPrompt = `Especialista em viagens. Responda APENAS com JSON valido. Custos em BRL. Atracoes e enderecos REAIS. Ritmo: ${paceLabel}. Orcamento: ${budgetLabel}. Min 2 noites/cidade. Inclua meals. Dia 1=chegada, ultimo=partida.

JSON: {"title":"string","summary":"string","totalDays":N,"estimatedTotalCostPerPerson":{"min":N,"max":N,"currency":"BRL"},"cities":[{"city":"","country":"","arrivalDate":"YYYY-MM-DD","departureDate":"YYYY-MM-DD","numberOfNights":N,"description":"","estimatedDailyCostPerPerson":{"min":N,"max":N,"currency":"BRL"}}],"days":[{"dayNumber":N,"date":"YYYY-MM-DD","city":"","country":"","title":"","summary":"","estimatedDailyCostPerPerson":{"min":N,"max":N,"currency":"BRL"},"activities":[{"id":"uuid","name":"","category":"sightseeing|museum|food|nature|shopping|entertainment|transit|meal|rest","description":"","address":"","suggestedStartTime":"HH:MM","suggestedEndTime":"HH:MM","estimatedDurationMinutes":N,"estimatedCostPerPerson":{"min":N,"max":N,"currency":"BRL"},"bookingRecommended":false,"website":null,"notes":[]}]}],"warnings":[],"recommendations":[]}`;

    const userPrompt = `Roteiro ${totalDays} dias. Destinos: ${preferences.countries.join(", ")}${preferences.preferredCities?.length ? ` (${preferences.preferredCities.join(", ")})` : ""}. Datas: ${preferences.startDate} a ${preferences.endDate}. Origem: ${preferences.originCity}. ${preferences.travelers.adults} adultos${preferences.travelers.children > 0 ? `, ${preferences.travelers.children} criancas` : ""}. Interesses: ${preferences.interests.length > 0 ? preferences.interests.join(", ") : "geral"}. ${preferences.mandatoryPlaces?.length ? `Obrigatorio: ${preferences.mandatoryPlaces.join(", ")}.` : ""} Descricoes curtas. JSON completo.`;

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 16000,
    }, { timeout: 55000 });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI retornou resposta vazia");
    }

    const parsed = JSON.parse(content) as GeneratedItinerary;
    return this.sanitize(parsed);
  }

  private sanitize(itinerary: GeneratedItinerary): GeneratedItinerary {
    // Ensure all activities have IDs
    for (const day of itinerary.days) {
      for (const activity of day.activities) {
        if (!activity.id) {
          activity.id = uuidv4();
        }
        // Ensure cost structure
        if (!activity.estimatedCostPerPerson) {
          activity.estimatedCostPerPerson = { min: 0, max: 0, currency: "BRL" };
        }
        if (!activity.estimatedCostPerPerson.currency) {
          activity.estimatedCostPerPerson.currency = "BRL";
        }
        if (activity.bookingRecommended === undefined) {
          activity.bookingRecommended = false;
        }
        if (!activity.notes) {
          activity.notes = [];
        }
      }
      // Ensure day cost structure
      if (!day.estimatedDailyCostPerPerson) {
        day.estimatedDailyCostPerPerson = { min: 0, max: 0, currency: "BRL" };
      }
    }

    // Ensure cities have cost structure
    for (const city of itinerary.cities) {
      if (!city.estimatedDailyCostPerPerson) {
        city.estimatedDailyCostPerPerson = { min: 0, max: 0, currency: "BRL" };
      }
    }

    if (!itinerary.estimatedTotalCostPerPerson) {
      itinerary.estimatedTotalCostPerPerson = { min: 0, max: 0, currency: "BRL" };
    }

    if (!itinerary.warnings) itinerary.warnings = [];
    if (!itinerary.recommendations) itinerary.recommendations = [];

    return itinerary;
  }

  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }
}
