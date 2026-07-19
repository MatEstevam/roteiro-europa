import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@viagem.app" },
    update: {},
    create: {
      email: "demo@viagem.app",
      name: "Usuário Demo",
    },
  });

  // Create demo trip
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      title: "Roteiro Europa - Portugal, França e Itália",
      startDate: new Date("2025-06-15"),
      endDate: new Date("2025-06-26"),
      originCity: "Vitória",
      originAirport: "VIX",
      pace: "balanced",
      budgetLevel: "moderate",
      interests: ["história", "arte", "gastronomia", "fotografia", "arquitetura"],
      transportationPreferences: ["trem", "metrô"],
      dietaryPreferences: [],
      mandatoryPlaces: ["Torre Eiffel", "Coliseu", "Torre de Belém"],
      status: "generated",
      cities: {
        create: [
          {
            city: "Lisboa",
            country: "Portugal",
            arrivalDate: new Date("2025-06-15"),
            departureDate: new Date("2025-06-19"),
            numberOfNights: 4,
            order: 1,
            description: "Capital portuguesa com história milenar e pastéis de nata.",
          },
          {
            city: "Paris",
            country: "França",
            arrivalDate: new Date("2025-06-19"),
            departureDate: new Date("2025-06-23"),
            numberOfNights: 4,
            order: 2,
            description: "Cidade Luz com a Torre Eiffel e gastronomia refinada.",
          },
          {
            city: "Roma",
            country: "Itália",
            arrivalDate: new Date("2025-06-23"),
            departureDate: new Date("2025-06-26"),
            numberOfNights: 3,
            order: 3,
            description: "Cidade eterna com o Coliseu e a culinária italiana.",
          },
        ],
      },
      itineraryDays: {
        create: [
          {
            dayNumber: 1,
            date: new Date("2025-06-15"),
            city: "Lisboa",
            country: "Portugal",
            title: "Chegada e Belém",
            summary: "Chegada em Lisboa e visita ao bairro de Belém.",
            estimatedCostMin: 150,
            estimatedCostMax: 250,
          },
          {
            dayNumber: 2,
            date: new Date("2025-06-16"),
            city: "Lisboa",
            country: "Portugal",
            title: "Alfama e Centro Histórico",
            summary: "Explorar os bairros históricos de Lisboa.",
            estimatedCostMin: 100,
            estimatedCostMax: 200,
          },
        ],
      },
    },
  });

  console.log(`Seed completed: user=${user.id}, trip=${trip.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
