export type CityInfo = {
  city: string;
  country: string;
  relevanceWeight: number; // 1-5, higher = more tourist-relevant
  suggestedMinNights: number;
  description: string;
  imageUrl?: string;
  dailyCostPerPerson: {
    economic: { min: number; max: number };
    moderate: { min: number; max: number };
    comfortable: { min: number; max: number };
  };
};

export const EUROPEAN_COUNTRIES = [
  "Portugal",
  "Espanha",
  "França",
  "Itália",
  "Reino Unido",
  "Holanda",
  "Alemanha",
  "Suíça",
  "Áustria",
  "República Tcheca",
  "Bélgica",
];

export const CITIES_BY_COUNTRY: Record<string, CityInfo[]> = {
  Portugal: [
    {
      city: "Lisboa",
      country: "Portugal",
      relevanceWeight: 4,
      suggestedMinNights: 3,
      description:
        "Capital portuguesa com história milenar, miradouros deslumbrantes, pastéis de nata e o charme dos elétricos.",
      dailyCostPerPerson: {
        economic: { min: 250, max: 350 },
        moderate: { min: 400, max: 600 },
        comfortable: { min: 700, max: 1000 },
      },
    },
    {
      city: "Porto",
      country: "Portugal",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Cidade do vinho do Porto, com a Ribeira patrimônio mundial, pontes icônicas e gastronomia marcante.",
      dailyCostPerPerson: {
        economic: { min: 250, max: 330 },
        moderate: { min: 380, max: 550 },
        comfortable: { min: 650, max: 950 },
      },
    },
    {
      city: "Sintra",
      country: "Portugal",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Vila encantada com palácios coloridos, castelos mouros e jardins românticos nas serras próximas a Lisboa.",
      dailyCostPerPerson: {
        economic: { min: 270, max: 370 },
        moderate: { min: 420, max: 620 },
        comfortable: { min: 750, max: 1050 },
      },
    },
    {
      city: "Faro",
      country: "Portugal",
      relevanceWeight: 2,
      suggestedMinNights: 2,
      description:
        "Porta de entrada do Algarve, com praias paradisíacas, lagoas e a charmosa cidade velha murada.",
      dailyCostPerPerson: {
        economic: { min: 260, max: 360 },
        moderate: { min: 400, max: 580 },
        comfortable: { min: 680, max: 980 },
      },
    },
  ],
  Espanha: [
    {
      city: "Madrid",
      country: "Espanha",
      relevanceWeight: 4,
      suggestedMinNights: 3,
      description:
        "Capital espanhola com museus de classe mundial (Prado, Reina Sofía), vida noturna vibrante e tapas inesquecíveis.",
      dailyCostPerPerson: {
        economic: { min: 270, max: 380 },
        moderate: { min: 420, max: 650 },
        comfortable: { min: 750, max: 1100 },
      },
    },
    {
      city: "Barcelona",
      country: "Espanha",
      relevanceWeight: 4,
      suggestedMinNights: 3,
      description:
        "Cidade de Gaudí com a Sagrada Família, Las Ramblas, praias mediterrâneas e arquitetura modernista.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 390 },
        moderate: { min: 430, max: 670 },
        comfortable: { min: 780, max: 1150 },
      },
    },
    {
      city: "Sevilha",
      country: "Espanha",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Alma do flamenco, com a Giralda, o Real Alcázar e a atmosfera andaluza de laranjeiras e azulejos.",
      dailyCostPerPerson: {
        economic: { min: 250, max: 350 },
        moderate: { min: 380, max: 580 },
        comfortable: { min: 680, max: 980 },
      },
    },
    {
      city: "Granada",
      country: "Espanha",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Cidade da Alhambra, onde a herança mourisca encontra a Serra Nevada e as tapas são servidas de graça.",
      dailyCostPerPerson: {
        economic: { min: 240, max: 340 },
        moderate: { min: 370, max: 560 },
        comfortable: { min: 650, max: 950 },
      },
    },
  ],
  França: [
    {
      city: "Paris",
      country: "França",
      relevanceWeight: 5,
      suggestedMinNights: 4,
      description:
        "Cidade Luz com a Torre Eiffel, Louvre, Notre-Dame, gastronomia refinada e a atmosfera romântica dos boulevards.",
      dailyCostPerPerson: {
        economic: { min: 300, max: 400 },
        moderate: { min: 500, max: 700 },
        comfortable: { min: 850, max: 1200 },
      },
    },
    {
      city: "Nice",
      country: "França",
      relevanceWeight: 2,
      suggestedMinNights: 2,
      description:
        "Joia da Riviera Francesa com a Promenade des Anglais, mar azul-turquesa e mercados provençais.",
      dailyCostPerPerson: {
        economic: { min: 290, max: 380 },
        moderate: { min: 470, max: 670 },
        comfortable: { min: 800, max: 1100 },
      },
    },
    {
      city: "Lyon",
      country: "França",
      relevanceWeight: 2,
      suggestedMinNights: 2,
      description:
        "Capital gastronômica da França com traboules históricas, basílicas no alto da colina e culinária premiada.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 370 },
        moderate: { min: 450, max: 650 },
        comfortable: { min: 780, max: 1080 },
      },
    },
    {
      city: "Marselha",
      country: "França",
      relevanceWeight: 2,
      suggestedMinNights: 2,
      description:
        "Porto histórico mediterrâneo com o Vieux-Port, calanques deslumbrantes e a bouillabaisse tradicional.",
      dailyCostPerPerson: {
        economic: { min: 270, max: 370 },
        moderate: { min: 440, max: 640 },
        comfortable: { min: 750, max: 1050 },
      },
    },
  ],
  Itália: [
    {
      city: "Roma",
      country: "Itália",
      relevanceWeight: 5,
      suggestedMinNights: 4,
      description:
        "Cidade Eterna com o Coliseu, Vaticano, Fontana di Trevi e milênios de história a cada esquina.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 380 },
        moderate: { min: 450, max: 680 },
        comfortable: { min: 800, max: 1150 },
      },
    },
    {
      city: "Florença",
      country: "Itália",
      relevanceWeight: 3,
      suggestedMinNights: 3,
      description:
        "Berço do Renascimento com o Duomo, Uffizi, Ponte Vecchio e a beleza toscana em cada detalhe.",
      dailyCostPerPerson: {
        economic: { min: 270, max: 370 },
        moderate: { min: 430, max: 660 },
        comfortable: { min: 780, max: 1100 },
      },
    },
    {
      city: "Veneza",
      country: "Itália",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Cidade flutuante com canais, gôndolas, Praça São Marcos e a magia de um lugar único no mundo.",
      dailyCostPerPerson: {
        economic: { min: 300, max: 400 },
        moderate: { min: 480, max: 700 },
        comfortable: { min: 850, max: 1200 },
      },
    },
    {
      city: "Milão",
      country: "Itália",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Capital da moda e do design com o Duomo, La Scala, a Última Ceia de Da Vinci e compras de luxo.",
      dailyCostPerPerson: {
        economic: { min: 290, max: 390 },
        moderate: { min: 470, max: 690 },
        comfortable: { min: 820, max: 1180 },
      },
    },
  ],
  "Reino Unido": [
    {
      city: "Londres",
      country: "Reino Unido",
      relevanceWeight: 5,
      suggestedMinNights: 4,
      description:
        "Metrópole cosmopolita com o Big Ben, British Museum, pubs históricos e a diversidade cultural de um império.",
      dailyCostPerPerson: {
        economic: { min: 320, max: 400 },
        moderate: { min: 550, max: 700 },
        comfortable: { min: 900, max: 1200 },
      },
    },
    {
      city: "Edimburgo",
      country: "Reino Unido",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Capital escocesa com castelo medieval, Royal Mile, Arthur's Seat e festivais de arte renomados.",
      dailyCostPerPerson: {
        economic: { min: 300, max: 380 },
        moderate: { min: 500, max: 680 },
        comfortable: { min: 850, max: 1150 },
      },
    },
    {
      city: "Oxford",
      country: "Reino Unido",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Cidade universitária histórica com colleges centenários, bibliotecas icônicas e atmosfera acadêmica.",
      dailyCostPerPerson: {
        economic: { min: 310, max: 390 },
        moderate: { min: 520, max: 690 },
        comfortable: { min: 870, max: 1170 },
      },
    },
  ],
  Holanda: [
    {
      city: "Amsterdam",
      country: "Holanda",
      relevanceWeight: 4,
      suggestedMinNights: 3,
      description:
        "Cidade dos canais com Van Gogh Museum, Anne Frank House, bicicletas e arquitetura do Século de Ouro.",
      dailyCostPerPerson: {
        economic: { min: 300, max: 390 },
        moderate: { min: 500, max: 690 },
        comfortable: { min: 850, max: 1150 },
      },
    },
    {
      city: "Roterdã",
      country: "Holanda",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Cidade da arquitetura moderna com o Markthal, casas-cubo e o maior porto da Europa.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 370 },
        moderate: { min: 460, max: 650 },
        comfortable: { min: 800, max: 1100 },
      },
    },
    {
      city: "Haia",
      country: "Holanda",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Sede do governo holandês com o Mauritshuis, Praia de Scheveningen e tribunais internacionais.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 370 },
        moderate: { min: 460, max: 650 },
        comfortable: { min: 800, max: 1100 },
      },
    },
  ],
  Alemanha: [
    {
      city: "Berlim",
      country: "Alemanha",
      relevanceWeight: 4,
      suggestedMinNights: 3,
      description:
        "Capital reunificada com história do século XX, arte de rua, cena cultural vibrante e Portão de Brandemburgo.",
      dailyCostPerPerson: {
        economic: { min: 260, max: 360 },
        moderate: { min: 420, max: 630 },
        comfortable: { min: 750, max: 1050 },
      },
    },
    {
      city: "Munique",
      country: "Alemanha",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Capital da Baviera com cervejarias tradicionais, Marienplatz, museus e proximidade dos Alpes.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 380 },
        moderate: { min: 450, max: 660 },
        comfortable: { min: 800, max: 1100 },
      },
    },
    {
      city: "Frankfurt",
      country: "Alemanha",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Centro financeiro com skyline moderno, Römerberg medieval e museus à beira do rio Meno.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 370 },
        moderate: { min: 450, max: 650 },
        comfortable: { min: 790, max: 1080 },
      },
    },
    {
      city: "Hamburgo",
      country: "Alemanha",
      relevanceWeight: 2,
      suggestedMinNights: 2,
      description:
        "Cidade portuária com a Elbphilharmonie, Speicherstadt e a vibrante vida noturna do Reeperbahn.",
      dailyCostPerPerson: {
        economic: { min: 270, max: 360 },
        moderate: { min: 440, max: 640 },
        comfortable: { min: 770, max: 1060 },
      },
    },
  ],
  Suíça: [
    {
      city: "Zurique",
      country: "Suíça",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Cidade financeira com lago cristalino, Altstadt medieval e chocolaterias de renome mundial.",
      dailyCostPerPerson: {
        economic: { min: 350, max: 400 },
        moderate: { min: 600, max: 700 },
        comfortable: { min: 1000, max: 1200 },
      },
    },
    {
      city: "Berna",
      country: "Suíça",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Capital federal com centro medieval patrimônio UNESCO, arcadas históricas e o rio Aare esmeralda.",
      dailyCostPerPerson: {
        economic: { min: 340, max: 400 },
        moderate: { min: 580, max: 700 },
        comfortable: { min: 980, max: 1200 },
      },
    },
    {
      city: "Genebra",
      country: "Suíça",
      relevanceWeight: 2,
      suggestedMinNights: 2,
      description:
        "Cidade internacional com o Jet d'Eau, sede da ONU, relojoarias de luxo e vista para o Mont Blanc.",
      dailyCostPerPerson: {
        economic: { min: 360, max: 400 },
        moderate: { min: 620, max: 700 },
        comfortable: { min: 1050, max: 1200 },
      },
    },
    {
      city: "Lucerna",
      country: "Suíça",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Cidade pitoresca com a ponte de madeira Kapellbrücke, lago cercado por montanhas e charme alpino.",
      dailyCostPerPerson: {
        economic: { min: 340, max: 400 },
        moderate: { min: 580, max: 700 },
        comfortable: { min: 980, max: 1200 },
      },
    },
  ],
  Áustria: [
    {
      city: "Viena",
      country: "Áustria",
      relevanceWeight: 4,
      suggestedMinNights: 3,
      description:
        "Capital imperial com palácios barrocos, ópera de classe mundial, cafés vienenses e a herança de Mozart.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 370 },
        moderate: { min: 450, max: 660 },
        comfortable: { min: 800, max: 1100 },
      },
    },
    {
      city: "Salzburgo",
      country: "Áustria",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Cidade natal de Mozart com fortaleza medieval, jardins Mirabell e cenários de 'A Noviça Rebelde'.",
      dailyCostPerPerson: {
        economic: { min: 270, max: 360 },
        moderate: { min: 440, max: 640 },
        comfortable: { min: 780, max: 1080 },
      },
    },
    {
      city: "Innsbruck",
      country: "Áustria",
      relevanceWeight: 2,
      suggestedMinNights: 2,
      description:
        "Cidade alpina com o Telhado de Ouro, esportes de inverno e panoramas deslumbrantes do Tirol.",
      dailyCostPerPerson: {
        economic: { min: 270, max: 360 },
        moderate: { min: 430, max: 630 },
        comfortable: { min: 760, max: 1060 },
      },
    },
  ],
  "República Tcheca": [
    {
      city: "Praga",
      country: "República Tcheca",
      relevanceWeight: 4,
      suggestedMinNights: 3,
      description:
        "Cidade das Cem Torres com a Ponte Carlos, Castelo de Praga, cerveja artesanal e arquitetura gótica.",
      dailyCostPerPerson: {
        economic: { min: 250, max: 330 },
        moderate: { min: 380, max: 550 },
        comfortable: { min: 650, max: 900 },
      },
    },
    {
      city: "Český Krumlov",
      country: "República Tcheca",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Vila medieval com castelo renascentista, rio Vltava serpenteando e atmosfera de conto de fadas.",
      dailyCostPerPerson: {
        economic: { min: 230, max: 310 },
        moderate: { min: 350, max: 520 },
        comfortable: { min: 600, max: 850 },
      },
    },
    {
      city: "Brno",
      country: "República Tcheca",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Segunda cidade tcheca com catedral gótica, Vila Tugendhat modernista e cena de cervejarias locais.",
      dailyCostPerPerson: {
        economic: { min: 230, max: 310 },
        moderate: { min: 350, max: 520 },
        comfortable: { min: 600, max: 850 },
      },
    },
  ],
  Bélgica: [
    {
      city: "Bruxelas",
      country: "Bélgica",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Capital da Europa com Grand-Place, chocolates, waffles, cerveja trapista e a sede da União Europeia.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 370 },
        moderate: { min: 450, max: 650 },
        comfortable: { min: 800, max: 1100 },
      },
    },
    {
      city: "Bruges",
      country: "Bélgica",
      relevanceWeight: 3,
      suggestedMinNights: 2,
      description:
        "Veneza do Norte com canais medievais, praças de paralelepípedo, chocolaterias e cervejarias centenárias.",
      dailyCostPerPerson: {
        economic: { min: 280, max: 370 },
        moderate: { min: 450, max: 650 },
        comfortable: { min: 800, max: 1100 },
      },
    },
    {
      city: "Gante",
      country: "Bélgica",
      relevanceWeight: 2,
      suggestedMinNights: 1,
      description:
        "Cidade universitária com o Altar de Gante, castelo medieval e vida cultural alternativa.",
      dailyCostPerPerson: {
        economic: { min: 270, max: 360 },
        moderate: { min: 430, max: 630 },
        comfortable: { min: 770, max: 1060 },
      },
    },
  ],
};

export type CityAttraction = {
  name: string;
  category: string;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  estimatedDurationMinutes: number;
  estimatedCostBRL: { min: number; max: number };
  openingHours?: string[];
  website?: string;
  bookingRecommended: boolean;
  interests: string[];
};

export function getCityAttractions(city: string): CityAttraction[] {
  return CITY_ATTRACTIONS[city] || [];
}

export function getCityInfo(cityName: string): CityInfo | undefined {
  for (const country of Object.values(CITIES_BY_COUNTRY)) {
    const found = country.find((c) => c.city === cityName);
    if (found) return found;
  }
  return undefined;
}

export function getCitiesForCountries(countries: string[]): CityInfo[] {
  const result: CityInfo[] = [];
  for (const country of countries) {
    const cities = CITIES_BY_COUNTRY[country];
    if (cities) result.push(...cities);
  }
  return result;
}

const CITY_ATTRACTIONS: Record<string, CityAttraction[]> = {
  Lisboa: [
    { name: "Torre de Belém", category: "monumento", description: "Torre manuelina à beira do Tejo, símbolo dos Descobrimentos portugueses.", address: "Av. Brasília, 1400-038 Lisboa", latitude: 38.6916, longitude: -9.2159, estimatedDurationMinutes: 60, estimatedCostBRL: { min: 40, max: 60 }, openingHours: ["10:00-17:30"], website: "http://www.torrebelem.gov.pt", bookingRecommended: false, interests: ["história", "arquitetura"] },
    { name: "Mosteiro dos Jerónimos", category: "monumento", description: "Obra-prima do estilo manuelino, patrimônio mundial da UNESCO.", address: "Praça do Império, 1400-206 Lisboa", latitude: 38.6979, longitude: -9.2068, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 50, max: 70 }, openingHours: ["10:00-17:30"], website: "http://www.mosteirojeronimos.gov.pt", bookingRecommended: true, interests: ["história", "arquitetura", "religião"] },
    { name: "Bairro de Alfama", category: "bairro", description: "Bairro mais antigo de Lisboa com ruelas medievais, fado e miradouros.", address: "Alfama, Lisboa", latitude: 38.7114, longitude: -9.1304, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 30 }, bookingRecommended: false, interests: ["cultura", "fotografia", "gastronomia"] },
    { name: "Castelo de São Jorge", category: "monumento", description: "Castelo mouro com vistas panorâmicas sobre Lisboa e o Tejo.", address: "R. de Santa Cruz do Castelo, 1100-129 Lisboa", latitude: 38.7139, longitude: -9.1334, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 50, max: 70 }, openingHours: ["09:00-21:00"], website: "http://castelodesaojorge.pt", bookingRecommended: false, interests: ["história", "fotografia"] },
    { name: "Pastéis de Belém", category: "gastronomia", description: "Pastelaria histórica desde 1837 com os famosos pastéis de nata originais.", address: "R. de Belém 84-92, 1300-085 Lisboa", latitude: 38.6975, longitude: -9.2030, estimatedDurationMinutes: 45, estimatedCostBRL: { min: 20, max: 50 }, openingHours: ["08:00-23:00"], website: "http://pasteisdebelem.pt", bookingRecommended: false, interests: ["gastronomia"] },
    { name: "Praça do Comércio", category: "praça", description: "Grande praça ribeirinha com arco triunfal e vista para o Tejo.", address: "Praça do Comércio, 1100-148 Lisboa", latitude: 38.7075, longitude: -9.1364, estimatedDurationMinutes: 45, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["história", "fotografia"] },
    { name: "Bairro Alto e Chiado", category: "bairro", description: "Bairros boêmios com lojas, cafés literários, livrarias e vida noturna.", address: "Chiado, Lisboa", latitude: 38.7107, longitude: -9.1418, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 80 }, bookingRecommended: false, interests: ["cultura", "compras", "gastronomia"] },
    { name: "Oceanário de Lisboa", category: "museu", description: "Um dos maiores aquários da Europa, com oceanos de todo o mundo.", address: "Esplanada Dom Carlos I, 1990-005 Lisboa", latitude: 38.7636, longitude: -9.0937, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 100, max: 130 }, openingHours: ["10:00-20:00"], website: "http://www.oceanario.pt", bookingRecommended: true, interests: ["família", "natureza"] },
    { name: "Elétrico 28", category: "transporte", description: "Passeio icônico de bonde pelas colinas históricas de Lisboa.", address: "Vários pontos, Lisboa", latitude: 38.7139, longitude: -9.1399, estimatedDurationMinutes: 60, estimatedCostBRL: { min: 15, max: 25 }, bookingRecommended: false, interests: ["cultura", "fotografia"] },
    { name: "Miradouro da Senhora do Monte", category: "miradouro", description: "O miradouro mais alto de Lisboa com vista 360° da cidade.", address: "R. da Senhora do Monte, Lisboa", latitude: 38.7192, longitude: -9.1336, estimatedDurationMinutes: 30, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["fotografia", "romance"] },
  ],
  Paris: [
    { name: "Torre Eiffel", category: "monumento", description: "Símbolo máximo de Paris com vista panorâmica da Cidade Luz.", address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris", latitude: 48.8584, longitude: 2.2945, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 80, max: 150 }, openingHours: ["09:30-23:45"], website: "https://www.toureiffel.paris", bookingRecommended: true, interests: ["fotografia", "romance", "arquitetura"] },
    { name: "Museu do Louvre", category: "museu", description: "Maior museu de arte do mundo com a Mona Lisa, Vênus de Milo e 35.000 obras.", address: "Rue de Rivoli, 75001 Paris", latitude: 48.8606, longitude: 2.3376, estimatedDurationMinutes: 240, estimatedCostBRL: { min: 80, max: 110 }, openingHours: ["09:00-18:00"], website: "https://www.louvre.fr", bookingRecommended: true, interests: ["arte", "história", "cultura"] },
    { name: "Montmartre e Sacré-Cœur", category: "bairro", description: "Bairro artístico com a basílica branca, artistas de rua e vistas de Paris.", address: "35 Rue du Chevalier de la Barre, 75018 Paris", latitude: 48.8867, longitude: 2.3431, estimatedDurationMinutes: 150, estimatedCostBRL: { min: 0, max: 30 }, openingHours: ["06:00-22:30"], bookingRecommended: false, interests: ["arte", "fotografia", "cultura"] },
    { name: "Champs-Élysées e Arco do Triunfo", category: "avenida", description: "A avenida mais famosa do mundo com lojas de luxo e o Arco do Triunfo.", address: "Place Charles de Gaulle, 75008 Paris", latitude: 48.8738, longitude: 2.2950, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 60, max: 100 }, openingHours: ["10:00-23:00"], website: "http://www.paris-arc-de-triomphe.fr", bookingRecommended: false, interests: ["compras", "história", "fotografia"] },
    { name: "Catedral Notre-Dame (exterior)", category: "monumento", description: "Catedral gótica icônica em processo de restauração após o incêndio de 2019.", address: "6 Parvis Notre-Dame, 75004 Paris", latitude: 48.8530, longitude: 2.3499, estimatedDurationMinutes: 60, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["história", "arquitetura", "religião"] },
    { name: "Museu d'Orsay", category: "museu", description: "Museu impressionista numa antiga estação ferroviária com Monet, Renoir e Van Gogh.", address: "1 Rue de la Légion d'Honneur, 75007 Paris", latitude: 48.8600, longitude: 2.3266, estimatedDurationMinutes: 180, estimatedCostBRL: { min: 70, max: 100 }, openingHours: ["09:30-18:00"], website: "https://www.musee-orsay.fr", bookingRecommended: true, interests: ["arte", "cultura"] },
    { name: "Palácio de Versalhes", category: "palácio", description: "Residência real com Salão dos Espelhos, jardins geométricos e fontes monumentais.", address: "Place d'Armes, 78000 Versailles", latitude: 48.8049, longitude: 2.1204, estimatedDurationMinutes: 300, estimatedCostBRL: { min: 100, max: 150 }, openingHours: ["09:00-18:30"], website: "http://www.chateauversailles.fr", bookingRecommended: true, interests: ["história", "arquitetura", "jardins"] },
    { name: "Jardim de Luxemburgo", category: "parque", description: "Jardim parisiense elegante com fontes, estátuas e área para relaxar.", address: "75006 Paris", latitude: 48.8462, longitude: 2.3372, estimatedDurationMinutes: 60, estimatedCostBRL: { min: 0, max: 0 }, openingHours: ["07:30-21:30"], bookingRecommended: false, interests: ["natureza", "romance", "família"] },
    { name: "Quartier Latin", category: "bairro", description: "Bairro universitário com livrarias, bistrôs e a atmosfera intelectual de Paris.", address: "Quartier Latin, 75005 Paris", latitude: 48.8498, longitude: 2.3447, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 0, max: 50 }, bookingRecommended: false, interests: ["cultura", "gastronomia", "história"] },
    { name: "Cruzeiro pelo Rio Sena", category: "passeio", description: "Passeio de barco pelos principais monumentos de Paris vistos da água.", address: "Port de la Bourdonnais, 75007 Paris", latitude: 48.8600, longitude: 2.2900, estimatedDurationMinutes: 75, estimatedCostBRL: { min: 70, max: 120 }, openingHours: ["10:00-22:00"], website: "https://www.bateaux-mouches.fr", bookingRecommended: true, interests: ["romance", "fotografia"] },
  ],
  Roma: [
    { name: "Coliseu", category: "monumento", description: "Anfiteatro romano do século I, palco de gladiadores e símbolo do Império Romano.", address: "Piazza del Colosseo, 1, 00184 Roma", latitude: 41.8902, longitude: 12.4922, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 80, max: 120 }, openingHours: ["09:00-19:00"], website: "https://www.colosseumrome.it", bookingRecommended: true, interests: ["história", "arquitetura"] },
    { name: "Fórum Romano e Palatino", category: "sítio arqueológico", description: "Centro político da Roma Antiga com templos, arcos e ruínas imperiais.", address: "Via della Salara Vecchia, 5/6, 00186 Roma", latitude: 41.8925, longitude: 12.4853, estimatedDurationMinutes: 150, estimatedCostBRL: { min: 0, max: 20 }, openingHours: ["09:00-19:00"], bookingRecommended: true, interests: ["história", "arqueologia"] },
    { name: "Museus do Vaticano e Capela Sistina", category: "museu", description: "Coleção papal com obras-primas de Michelangelo, Rafael e séculos de arte sacra.", address: "Viale Vaticano, 00165 Roma", latitude: 41.9065, longitude: 12.4536, estimatedDurationMinutes: 240, estimatedCostBRL: { min: 100, max: 150 }, openingHours: ["09:00-18:00"], website: "https://www.museivaticani.va", bookingRecommended: true, interests: ["arte", "história", "religião"] },
    { name: "Basílica de São Pedro", category: "igreja", description: "Maior igreja do mundo com a Pietà de Michelangelo e a cúpula monumental.", address: "Piazza San Pietro, 00120 Città del Vaticano", latitude: 41.9022, longitude: 12.4539, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 50 }, openingHours: ["07:00-19:00"], website: "http://www.vatican.va", bookingRecommended: false, interests: ["arquitetura", "religião", "arte"] },
    { name: "Fontana di Trevi", category: "monumento", description: "Fonte barroca monumental onde jogar uma moeda garante o retorno a Roma.", address: "Piazza di Trevi, 00187 Roma", latitude: 41.9009, longitude: 12.4833, estimatedDurationMinutes: 30, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["fotografia", "romance"] },
    { name: "Panteão", category: "monumento", description: "Templo romano com a maior cúpula de concreto não armado do mundo, intacto há 2000 anos.", address: "Piazza della Rotonda, 00186 Roma", latitude: 41.8986, longitude: 12.4769, estimatedDurationMinutes: 45, estimatedCostBRL: { min: 25, max: 40 }, openingHours: ["09:00-19:00"], website: "https://www.pantheonroma.com", bookingRecommended: false, interests: ["história", "arquitetura"] },
    { name: "Trastevere", category: "bairro", description: "Bairro boêmio com trattorias autênticas, ruas de paralelepípedo e vida noturna romana.", address: "Trastevere, Roma", latitude: 41.8895, longitude: 12.4699, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 80 }, bookingRecommended: false, interests: ["gastronomia", "cultura", "vida noturna"] },
    { name: "Piazza Navona", category: "praça", description: "Praça barroca com três fontes, artistas de rua e cafés ao ar livre.", address: "Piazza Navona, 00186 Roma", latitude: 41.8992, longitude: 12.4731, estimatedDurationMinutes: 45, estimatedCostBRL: { min: 0, max: 30 }, bookingRecommended: false, interests: ["fotografia", "arte", "cultura"] },
    { name: "Escadaria da Praça de Espanha", category: "monumento", description: "Escadaria monumental do século XVIII, ponto de encontro e compras de luxo.", address: "Piazza di Spagna, 00187 Roma", latitude: 41.9060, longitude: 12.4823, estimatedDurationMinutes: 30, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["fotografia", "compras"] },
    { name: "Villa Borghese", category: "parque", description: "Grande parque romano com museu de arte, jardins, lago e aluguel de bicicletas.", address: "Piazzale Napoleone I, 00197 Roma", latitude: 41.9145, longitude: 12.4855, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 70 }, openingHours: ["09:00-19:00"], bookingRecommended: false, interests: ["natureza", "arte", "família"] },
  ],
  Madrid: [
    { name: "Museu do Prado", category: "museu", description: "Um dos maiores museus de arte do mundo com obras de Velázquez, Goya e El Greco.", address: "C. de Ruiz de Alarcón, 23, 28014 Madrid", latitude: 40.4138, longitude: -3.6921, estimatedDurationMinutes: 180, estimatedCostBRL: { min: 70, max: 100 }, openingHours: ["10:00-20:00"], website: "https://www.museodelprado.es", bookingRecommended: true, interests: ["arte", "cultura"] },
    { name: "Parque del Retiro", category: "parque", description: "Parque real com lago, Palácio de Cristal e jardins de rosas.", address: "Plaza de la Independencia, 7, 28001 Madrid", latitude: 40.4153, longitude: -3.6844, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 20 }, openingHours: ["06:00-22:00"], bookingRecommended: false, interests: ["natureza", "família", "romance"] },
    { name: "Palácio Real de Madrid", category: "palácio", description: "Maior palácio real da Europa Ocidental com mais de 3.000 salas.", address: "C. de Bailén, s/n, 28071 Madrid", latitude: 40.4180, longitude: -3.7142, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 60, max: 90 }, openingHours: ["10:00-18:00"], website: "https://www.patrimonionacional.es", bookingRecommended: true, interests: ["história", "arquitetura"] },
    { name: "Puerta del Sol e Gran Vía", category: "praça", description: "Centro nevrálgico de Madrid com a estátua do Urso e o Madroño e a grande avenida comercial.", address: "Puerta del Sol, 28013 Madrid", latitude: 40.4169, longitude: -3.7035, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 0, max: 50 }, bookingRecommended: false, interests: ["compras", "cultura", "fotografia"] },
  ],
  Barcelona: [
    { name: "Sagrada Família", category: "igreja", description: "Obra-prima inacabada de Gaudí, a basílica mais visitada da Europa.", address: "C. de Mallorca, 401, 08013 Barcelona", latitude: 41.4036, longitude: 2.1744, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 120, max: 160 }, openingHours: ["09:00-20:00"], website: "https://sagradafamilia.org", bookingRecommended: true, interests: ["arquitetura", "arte", "religião"] },
    { name: "Parque Güell", category: "parque", description: "Parque público com mosaicos coloridos de Gaudí e vistas de Barcelona.", address: "08024 Barcelona", latitude: 41.4145, longitude: 2.1527, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 50, max: 80 }, openingHours: ["09:30-19:30"], website: "https://parkguell.barcelona", bookingRecommended: true, interests: ["arquitetura", "natureza", "fotografia"] },
    { name: "Las Ramblas", category: "avenida", description: "Boulevard mais famoso de Barcelona com artistas, mercado e vida urbana.", address: "La Rambla, 08002 Barcelona", latitude: 41.3809, longitude: 2.1734, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 0, max: 40 }, bookingRecommended: false, interests: ["cultura", "compras", "gastronomia"] },
    { name: "Bairro Gótico", category: "bairro", description: "Labirinto medieval com catedral gótica, pracinhas e bares de tapas.", address: "Barri Gòtic, 08002 Barcelona", latitude: 41.3833, longitude: 2.1761, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 40 }, bookingRecommended: false, interests: ["história", "cultura", "gastronomia"] },
  ],
  Amsterdam: [
    { name: "Museu Van Gogh", category: "museu", description: "Maior coleção de Van Gogh do mundo com mais de 200 pinturas.", address: "Museumplein 6, 1071 DJ Amsterdam", latitude: 52.3584, longitude: 4.8811, estimatedDurationMinutes: 150, estimatedCostBRL: { min: 100, max: 130 }, openingHours: ["09:00-18:00"], website: "https://www.vangoghmuseum.nl", bookingRecommended: true, interests: ["arte", "cultura"] },
    { name: "Casa de Anne Frank", category: "museu", description: "Esconderijo onde Anne Frank escreveu seu diário durante a Segunda Guerra.", address: "Prinsengracht 263-267, 1016 GV Amsterdam", latitude: 52.3752, longitude: 4.8840, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 70, max: 90 }, openingHours: ["09:00-22:00"], website: "https://www.annefrank.org", bookingRecommended: true, interests: ["história", "cultura"] },
    { name: "Canais de Jordaan", category: "bairro", description: "Bairro charmoso com canais, galerias, cafés e mercados de flores.", address: "Jordaan, Amsterdam", latitude: 52.3747, longitude: 4.8810, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 40 }, bookingRecommended: false, interests: ["fotografia", "cultura", "romance"] },
    { name: "Rijksmuseum", category: "museu", description: "Museu nacional com a Ronda Noturna de Rembrandt e arte holandesa clássica.", address: "Museumstraat 1, 1071 XX Amsterdam", latitude: 52.3600, longitude: 4.8852, estimatedDurationMinutes: 180, estimatedCostBRL: { min: 100, max: 130 }, openingHours: ["09:00-17:00"], website: "https://www.rijksmuseum.nl", bookingRecommended: true, interests: ["arte", "história"] },
  ],
  Berlim: [
    { name: "Portão de Brandemburgo", category: "monumento", description: "Símbolo da reunificação alemã e marco neoclássico de Berlim.", address: "Pariser Platz, 10117 Berlin", latitude: 52.5163, longitude: 13.3777, estimatedDurationMinutes: 30, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["história", "fotografia"] },
    { name: "Muro de Berlim - East Side Gallery", category: "monumento", description: "Trecho preservado do Muro com murais de artistas internacionais.", address: "Mühlenstraße 3-100, 10243 Berlin", latitude: 52.5052, longitude: 13.4398, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 0, max: 20 }, bookingRecommended: false, interests: ["história", "arte"] },
    { name: "Ilha dos Museus", category: "museu", description: "Complexo de 5 museus patrimônio UNESCO com arte desde o Egito antigo.", address: "Bodestraße, 10178 Berlin", latitude: 52.5169, longitude: 13.4019, estimatedDurationMinutes: 240, estimatedCostBRL: { min: 80, max: 120 }, openingHours: ["10:00-18:00"], website: "https://www.smb.museum", bookingRecommended: true, interests: ["arte", "história", "cultura"] },
    { name: "Memorial do Holocausto", category: "memorial", description: "Campo de estelas de concreto em memória dos judeus assassinados na Europa.", address: "Cora-Berliner-Straße 1, 10117 Berlin", latitude: 52.5139, longitude: 13.3786, estimatedDurationMinutes: 60, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["história"] },
  ],
  Viena: [
    { name: "Palácio de Schönbrunn", category: "palácio", description: "Residência de verão imperial com 1.441 salas e jardins barrocos grandiosos.", address: "Schönbrunner Schloßstraße 47, 1130 Wien", latitude: 48.1845, longitude: 16.3122, estimatedDurationMinutes: 180, estimatedCostBRL: { min: 80, max: 130 }, openingHours: ["09:00-17:00"], website: "https://www.schoenbrunn.at", bookingRecommended: true, interests: ["história", "arquitetura"] },
    { name: "Ópera Estatal de Viena", category: "teatro", description: "Uma das maiores casas de ópera do mundo com visitas guiadas e apresentações diárias.", address: "Opernring 2, 1010 Wien", latitude: 48.2035, longitude: 16.3690, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 50, max: 200 }, openingHours: ["10:00-18:00"], website: "https://www.wiener-staatsoper.at", bookingRecommended: true, interests: ["música", "cultura", "arquitetura"] },
    { name: "Catedral de Santo Estêvão", category: "igreja", description: "Catedral gótica com telhado de mosaicos coloridos e torre com vista panorâmica.", address: "Stephansplatz 3, 1010 Wien", latitude: 48.2084, longitude: 16.3731, estimatedDurationMinutes: 60, estimatedCostBRL: { min: 25, max: 50 }, openingHours: ["06:00-22:00"], bookingRecommended: false, interests: ["arquitetura", "religião", "história"] },
    { name: "Museu de História da Arte", category: "museu", description: "Museu imperial com obras de Vermeer, Bruegel e coleção egípcia.", address: "Maria-Theresien-Platz, 1010 Wien", latitude: 48.2034, longitude: 16.3614, estimatedDurationMinutes: 180, estimatedCostBRL: { min: 70, max: 100 }, openingHours: ["10:00-18:00"], website: "https://www.khm.at", bookingRecommended: false, interests: ["arte", "história"] },
  ],
  Praga: [
    { name: "Ponte Carlos", category: "monumento", description: "Ponte gótica do século XIV com 30 estátuas barrocas e vista para o castelo.", address: "Karlův most, 110 00 Praha 1", latitude: 50.0865, longitude: 14.4114, estimatedDurationMinutes: 45, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["história", "fotografia", "arquitetura"] },
    { name: "Castelo de Praga", category: "castelo", description: "Maior castelo antigo do mundo com catedral, palácios e Viela Dourada.", address: "Hradčany, 119 08 Praha 1", latitude: 50.0910, longitude: 14.4015, estimatedDurationMinutes: 180, estimatedCostBRL: { min: 60, max: 100 }, openingHours: ["09:00-17:00"], website: "https://www.hrad.cz", bookingRecommended: true, interests: ["história", "arquitetura"] },
    { name: "Praça da Cidade Velha", category: "praça", description: "Praça medieval com relógio astronômico, igrejas góticas e cafés.", address: "Staroměstské nám., 110 00 Praha 1", latitude: 50.0875, longitude: 14.4213, estimatedDurationMinutes: 60, estimatedCostBRL: { min: 0, max: 20 }, bookingRecommended: false, interests: ["história", "fotografia", "cultura"] },
    { name: "Bairro Judeu (Josefov)", category: "bairro", description: "Antigo gueto com sinagogas históricas, cemitério medieval e museu judaico.", address: "Josefov, 110 00 Praha 1", latitude: 50.0898, longitude: 14.4178, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 60, max: 90 }, openingHours: ["09:00-18:00"], bookingRecommended: false, interests: ["história", "cultura", "religião"] },
  ],
  Munique: [
    { name: "Marienplatz e Glockenspiel", category: "praça", description: "Praça central com prefeitura neogótica e carrilhão animado.", address: "Marienplatz, 80331 München", latitude: 48.1374, longitude: 11.5755, estimatedDurationMinutes: 45, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["fotografia", "história", "cultura"] },
    { name: "Hofbräuhaus", category: "gastronomia", description: "Cervejaria mais famosa do mundo, fundada em 1589, com música bávara ao vivo.", address: "Platzl 9, 80331 München", latitude: 48.1376, longitude: 11.5799, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 60, max: 120 }, openingHours: ["11:00-23:30"], website: "https://www.hofbraeuhaus.de", bookingRecommended: false, interests: ["gastronomia", "cultura"] },
    { name: "Englischer Garten", category: "parque", description: "Um dos maiores parques urbanos do mundo com beer gardens e surfistas no rio.", address: "80538 München", latitude: 48.1642, longitude: 11.6054, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 30 }, bookingRecommended: false, interests: ["natureza", "esporte", "família"] },
  ],
  Zurique: [
    { name: "Altstadt (Cidade Velha)", category: "bairro", description: "Centro medieval com guildas históricas, igrejas românicas e ruas de paralelepípedo.", address: "Altstadt, 8001 Zürich", latitude: 47.3717, longitude: 8.5420, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 0, max: 40 }, bookingRecommended: false, interests: ["história", "fotografia", "cultura"] },
    { name: "Lago de Zurique", category: "natureza", description: "Lago alpino com cruzeiros panorâmicos e vista para os Alpes.", address: "Zürichsee, Zürich", latitude: 47.3530, longitude: 8.5420, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 40, max: 100 }, bookingRecommended: false, interests: ["natureza", "fotografia", "romance"] },
    { name: "Museu Nacional Suíço", category: "museu", description: "Museu no estilo castelo com história cultural suíça desde a pré-história.", address: "Museumstrasse 2, 8001 Zürich", latitude: 47.3792, longitude: 8.5400, estimatedDurationMinutes: 120, estimatedCostBRL: { min: 50, max: 80 }, openingHours: ["10:00-17:00"], website: "https://www.nationalmuseum.ch", bookingRecommended: false, interests: ["história", "cultura"] },
  ],
  Bruxelas: [
    { name: "Grand-Place", category: "praça", description: "Praça patrimônio UNESCO com guildas barrocas e a Maison du Roi.", address: "Grand-Place, 1000 Bruxelles", latitude: 50.8467, longitude: 4.3525, estimatedDurationMinutes: 60, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["história", "fotografia", "arquitetura"] },
    { name: "Manneken Pis", category: "monumento", description: "Pequena estátua-fonte icônica símbolo do humor e irreverência belga.", address: "1000 Bruxelles", latitude: 50.8450, longitude: 4.3498, estimatedDurationMinutes: 15, estimatedCostBRL: { min: 0, max: 0 }, bookingRecommended: false, interests: ["cultura", "fotografia"] },
    { name: "Museu Magritte", category: "museu", description: "Maior coleção do surrealista belga René Magritte.", address: "Rue de la Régence 3, 1000 Bruxelles", latitude: 50.8420, longitude: 4.3580, estimatedDurationMinutes: 90, estimatedCostBRL: { min: 50, max: 70 }, openingHours: ["10:00-17:00"], website: "https://www.musee-magritte-museum.be", bookingRecommended: false, interests: ["arte", "cultura"] },
  ],
};
