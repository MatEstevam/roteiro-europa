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

    const systemPrompt = `Voce e um especialista brasileiro em planejamento de viagens internacionais. Voce cria roteiros detalhados, realistas e personalizados.

REGRAS OBRIGATORIAS:
- Responda APENAS com um objeto JSON valido, sem texto adicional.
- Todos os nomes de atracoes, enderecos e descricoes devem ser REAIS e precisos.
- Todos os custos devem ser em BRL (Real brasileiro).
- Respeite o ritmo do viajante: ${paceLabel}.
- Respeite o nivel de orcamento: ${budgetLabel}.
- Distribua os dias proporcionalmente ao peso turistico de cada cidade.
- Minimo 2 noites por cidade.
- Inclua cafe da manha, almoco e jantar como atividades do tipo "meal".
- Dia 1: atividades de chegada. Ultimo dia: atividades de partida.
- Dias de troca de cidade: inclua "transit" e menos atividades.
- Horarios realistas (atracoes abrem ~9h, jantar ~19h).
- Inclua fotos reais como URLs de imagens quando possivel (use URLs do Unsplash ou Pexels).

O JSON deve seguir EXATAMENTE esta estrutura:
{
  "title": "string - titulo do roteiro em portugues",
  "summary": "string - resumo de 2-3 frases",
  "totalDays": number,
  "estimatedTotalCostPerPerson": { "min": number, "max": number, "currency": "BRL" },
  "cities": [
    {
      "city": "string", "country": "string",
      "arrivalDate": "YYYY-MM-DD", "departureDate": "YYYY-MM-DD",
      "numberOfNights": number,
      "description": "string - descricao curta da cidade",
      "estimatedDailyCostPerPerson": { "min": number, "max": number, "currency": "BRL" }
    }
  ],
  "days": [
    {
      "dayNumber": number, "date": "YYYY-MM-DD",
      "city": "string", "country": "string",
      "title": "string - titulo do dia",
      "summary": "string",
      "estimatedDailyCostPerPerson": { "min": number, "max": number, "currency": "BRL" },
      "activities": [
        {
          "id": "string-uuid",
          "name": "string", "category": "string (sightseeing|museum|food|nature|shopping|entertainment|transit|meal|rest)",
          "description": "string",
          "address": "string - endereco real",
          "suggestedStartTime": "HH:MM", "suggestedEndTime": "HH:MM",
          "estimatedDurationMinutes": number,
          "estimatedCostPerPerson": { "min": number, "max": number, "currency": "BRL" },
          "bookingRecommended": boolean,
          "website": "string ou null",
          "notes": ["string"]
        }
      ]
    }
  ],
  "warnings": ["string"],
  "recommendations": ["string"]
}`;

    const userPrompt = `Crie um roteiro de viagem com estas preferencias:

- Destinos: ${preferences.countries.join(", ")}${preferences.preferredCities?.length ? ` (cidades preferidas: ${preferences.preferredCities.join(", ")})` : ""}
- Datas: ${preferences.startDate} a ${preferences.endDate} (${totalDays} dias)
- Origem: ${preferences.originCity}${preferences.originAirport ? ` (${preferences.originAirport})` : ""}
- Viajantes: ${preferences.travelers.adults} adulto(s)${preferences.travelers.children > 0 ? `, ${preferences.travelers.children} crianca(s)${preferences.travelers.childrenAges?.length ? ` (idades: ${preferences.travelers.childrenAges.join(", ")})` : ""}` : ""}
- Ritmo: ${paceLabel}
- Orcamento: ${budgetLabel}
- Interesses: ${preferences.interests.length > 0 ? preferences.interests.join(", ") : "variedade geral"}
- Transporte preferido: ${preferences.transportationPreferences.length > 0 ? preferences.transportationPreferences.join(", ") : "qualquer"}
${preferences.accessibilityNeeds ? `- Acessibilidade: ${preferences.accessibilityNeeds}` : ""}
${preferences.dietaryPreferences?.length ? `- Restricoes alimentares: ${preferences.dietaryPreferences.join(", ")}` : ""}
${preferences.mandatoryPlaces?.length ? `- Lugares obrigatorios: ${preferences.mandatoryPlaces.join(", ")}` : ""}

Gere o roteiro completo em JSON.`;

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }, { timeout: 60000 });

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
