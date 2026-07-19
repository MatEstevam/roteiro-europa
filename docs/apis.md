# APIs e Provedores

## Padrão de Provedores

O projeto utiliza o padrão **Provider** para abstrair integrações externas. Cada domínio (voos, lugares, imagens) possui:

1. Uma interface TypeScript definindo o contrato
2. Uma implementação mock para demonstração/testes
3. Uma implementação real conectada à API externa
4. Um factory/index que seleciona o provider ativo via variável de ambiente

### Estrutura

```
src/lib/providers/
├── flights/
│   ├── types.ts      # Interface FlightSearchProvider
│   ├── mock.ts       # MockFlightSearchProvider
│   └── index.ts      # Factory
├── places/
│   ├── types.ts      # Interface PlacesProvider
│   ├── mock.ts       # MockPlacesProvider
│   └── index.ts      # Factory
└── images/
    ├── types.ts      # Interface ImageProvider
    ├── mock.ts       # MockImageProvider
    └── index.ts      # Factory
```

---

## Contratos

### FlightSearchProvider

```typescript
interface FlightSearchProvider {
  search(params: FlightSearchParams): Promise<FlightSearchResult>;
}
```

**Parâmetros:**
- `origin` - Código IATA do aeroporto de origem
- `destination` - Código IATA do aeroporto de destino
- `departureDate` - Data de ida (ISO 8601)
- `returnDate` - Data de volta (opcional)
- `adults` - Número de adultos (1-10)
- `children` - Número de crianças (0-8)
- `cabinClass` - economy | premium_economy | business | first
- `directOnly` - Apenas voos diretos
- `maxStops` - Máximo de escalas
- `currency` - Moeda (padrão: BRL)
- `maxResults` - Limite de resultados (padrão: 20)

**Retorno:** `FlightSearchResult` com array de `FlightOffer`, provider utilizado, timestamp e flag `isDemo`.

### PlacesProvider

```typescript
interface PlacesProvider {
  searchAttractions(params: AttractionSearchParams): Promise<Attraction[]>;
  getPlaceDetails(placeId: string): Promise<AttractionDetails>;
}
```

**Parâmetros de busca:**
- `city` - Nome da cidade
- `country` - Nome do país
- `categories` - Filtro por categorias (opcional)
- `limit` - Limite de resultados (padrão: 10)

### ImageProvider

```typescript
interface ImageProvider {
  search(query: string): Promise<DestinationImage[]>;
}
```

---

## Como Trocar de Provider

O provider ativo é selecionado via variáveis de ambiente:

| Variável | Valores | Padrão |
|----------|---------|--------|
| `FLIGHT_PROVIDER` | `mock` \| `amadeus` | `mock` |
| `PLACES_PROVIDER` | `mock` \| `google` | `mock` |
| `IMAGE_PROVIDER` | `mock` \| `pexels` | `mock` |

Se nenhuma variável for definida, o modo demo (mock) é utilizado automaticamente.

---

## Amadeus (Voos)

### Autenticação

OAuth2 Client Credentials:
- **Token endpoint:** `https://test.api.amadeus.com/v1/security/oauth2/token` (teste) ou `https://api.amadeus.com/v1/security/oauth2/token` (produção)
- O token expira em ~1800 segundos. Renovar antes da expiração.

### Endpoints

- `POST /v2/shopping/flight-offers` - Busca de voos
- `GET /v1/reference-data/locations` - Busca de aeroportos

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `AMADEUS_CLIENT_ID` | Client ID da aplicação | Sim |
| `AMADEUS_CLIENT_SECRET` | Client Secret | Sim |
| `AMADEUS_API_URL` | URL base (test/production) | Não (padrão: test) |

### Ambiente de Teste vs Produção

- **Teste:** Dados limitados, gratuito, rate limit de 10 req/s
- **Produção:** Dados reais, requer aprovação e plano pago

---

## Google Places (Lugares)

### Configuração

- **API Key:** Obtida no Google Cloud Console
- **APIs necessárias:** Places API (New)
- **Field Masks:** Para otimizar custos, solicitar apenas campos necessários

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `GOOGLE_PLACES_API_KEY` | Chave de API | Sim |

### Custos

- A API cobra por requisição e por campo solicitado
- Field masks reduzem significativamente o custo
- Monitorar uso no Google Cloud Console > Billing

---

## Pexels (Imagens)

### Configuração

- **API Key:** Obtida em pexels.com/api
- **Rate Limit:** 200 requisições/hora
- **Atribuição:** Obrigatória - incluir créditos ao fotógrafo e link para o Pexels

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `PEXELS_API_KEY` | Chave de API | Sim |

---

## Skyscanner (Futuro)

Stub reservado para implementação futura. Interface já definida no padrão Provider.

---

## Estratégia de Cache

| Recurso | TTL | Motivo |
|---------|-----|--------|
| Voos | 15 minutos | Preços voláteis |
| Atrações/Lugares | 24 horas | Dados estáveis |
| Imagens | 7 dias | Conteúdo estático |
| Detalhes de lugar | 12 horas | Horários podem mudar |

---

## Rate Limiting

| Endpoint | Limite | Janela |
|----------|--------|--------|
| Busca de voos | 10 requisições | 1 minuto |
| Geração de roteiro | 30 requisições | 1 hora |

---

## Tratamento de Erros

Todos os providers seguem o padrão:

1. **Timeout:** 10 segundos para APIs externas
2. **Retry:** Máximo 2 tentativas com backoff exponencial (1s, 2s)
3. **Fallback:** Em caso de falha, retornar resultado vazio com flag de erro
4. **Logging:** Registrar erros com contexto (provider, params, status code)

```typescript
// Padrão de resposta em caso de erro
{
  offers: [],
  provider: "amadeus",
  searchedAt: new Date().toISOString(),
  isDemo: false,
  metadata: { totalFound: 0, error: "PROVIDER_TIMEOUT" }
}
```

---

## Como Adicionar um Novo Provider

1. Criar arquivo em `src/lib/providers/{domínio}/novo-provider.ts`
2. Implementar a interface do domínio (`FlightSearchProvider`, `PlacesProvider`, ou `ImageProvider`)
3. Atualizar o factory em `src/lib/providers/{domínio}/index.ts` para reconhecer a nova variável de ambiente
4. Adicionar variáveis de ambiente necessárias ao `.env.example`
5. Documentar aqui neste arquivo
6. Adicionar testes de integração em `tests/integration/`
