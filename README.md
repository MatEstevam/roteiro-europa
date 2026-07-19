# Roteiro Europa

Planejador inteligente de roteiros de viagem pela Europa, com foco em viajantes brasileiros. Gera itinerarios personalizados com estimativas de custo, sugestoes de atividades e busca de voos.

**Publico-alvo:** Viajantes brasileiros planejando sua primeira (ou proxima) viagem a Europa.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Autenticacao:** NextAuth v5
- **Validacao:** Zod
- **Testes:** Vitest + Testing Library
- **State Management:** TanStack React Query

---

## Pre-requisitos

- Node.js 20+
- PostgreSQL (local ou remoto)
- npm

---

## Instalacao

```bash
# Clonar o repositorio
git clone <url-do-repositorio>
cd viagem

# Instalar dependencias
npm install

# Copiar variaveis de ambiente
cp .env.example .env.local
```

---

## Variaveis de Ambiente

| Variavel | Descricao | Obrigatoria |
|----------|-----------|-------------|
| `DATABASE_URL` | URL de conexao PostgreSQL | Sim |
| `NEXTAUTH_URL` | URL base da aplicacao | Sim |
| `NEXTAUTH_SECRET` | Secret para NextAuth | Sim |
| `FLIGHT_PROVIDER` | Provider de voos (`mock` \| `amadeus`) | Nao (padrao: `mock`) |
| `PLACES_PROVIDER` | Provider de lugares (`mock` \| `google`) | Nao (padrao: `mock`) |
| `IMAGE_PROVIDER` | Provider de imagens (`mock` \| `pexels`) | Nao (padrao: `mock`) |
| `AMADEUS_CLIENT_ID` | Client ID Amadeus | Nao* |
| `AMADEUS_CLIENT_SECRET` | Client Secret Amadeus | Nao* |
| `AMADEUS_API_URL` | URL base Amadeus (test/prod) | Nao |
| `GOOGLE_PLACES_API_KEY` | Chave API Google Places | Nao* |
| `PEXELS_API_KEY` | Chave API Pexels | Nao* |

\* Obrigatorio apenas se o respectivo provider estiver ativo.

---

## Banco de Dados

```bash
# Criar as tabelas
npx prisma migrate dev

# Popular dados iniciais (opcional)
npx prisma db seed
```

---

## Executando

```bash
# Modo desenvolvimento
npm run dev

# Build de producao
npm run build
npm run start
```

A aplicacao estara disponivel em `http://localhost:3000`.

---

## Modo Demo

Por padrao, o projeto roda em **modo demo** (todos os providers = `mock`). Isso significa:

- Nenhuma API externa e chamada
- Dados pre-definidos sao retornados (voos, lugares, imagens)
- Todas as funcionalidades estao disponiveis para avaliacao
- Resultados marcados com `isDemo: true`

Para sair do modo demo, configure as variaveis de ambiente dos providers desejados.

---

## Ativando Amadeus (Voos Reais)

1. Criar conta em [developers.amadeus.com](https://developers.amadeus.com)
2. Criar uma aplicacao e obter Client ID e Secret
3. Configurar no `.env.local`:

```env
FLIGHT_PROVIDER=amadeus
AMADEUS_CLIENT_ID=seu_client_id
AMADEUS_CLIENT_SECRET=seu_client_secret
AMADEUS_API_URL=https://test.api.amadeus.com
```

4. Para producao, solicitar aprovacao e trocar a URL para `https://api.amadeus.com`

---

## Ativando Google Places (Lugares Reais)

1. Criar projeto no [Google Cloud Console](https://console.cloud.google.com)
2. Ativar a Places API (New)
3. Criar uma API Key com restricoes apropriadas
4. Configurar:

```env
PLACES_PROVIDER=google
GOOGLE_PLACES_API_KEY=sua_api_key
```

---

## Ativando Pexels (Imagens Reais)

1. Criar conta em [pexels.com/api](https://www.pexels.com/api/)
2. Obter API Key
3. Configurar:

```env
IMAGE_PROVIDER=pexels
PEXELS_API_KEY=sua_api_key
```

---

## Estrutura do Projeto

```
src/
├── app/                    # Rotas Next.js (App Router)
│   └── viagens/[id]/       # Pagina de roteiro individual
├── components/             # Componentes React
├── lib/
│   ├── demo/               # Dados de demonstracao
│   ├── flights/            # Logica de voos (sort, balance-score)
│   ├── itinerary/          # Geracao de roteiro (distribution, generator)
│   ├── providers/          # Abstracoes de API (flights, places, images)
│   └── validators/         # Schemas Zod
├── types/                  # Tipos TypeScript compartilhados
tests/
├── unit/                   # Testes unitarios
├── integration/            # Testes de integracao
└── setup.ts                # Setup do Vitest
docs/
├── apis.md                 # Documentacao de APIs e providers
└── product-decisions.md    # Decisoes de produto
```

---

## Limitacoes do MVP

- Sem compra de passagens (apenas consulta e redirecionamento)
- Sem reserva de hoteis
- Precos sao estimativas e podem variar
- Horarios de funcionamento podem estar desatualizados
- Cobertura limitada a Europa Ocidental e Central
- Sem suporte offline
- Sem notificacoes de alteracao de preco

---

## Contribuindo

1. Fork o repositorio
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Rode os testes (`npm test`)
4. Commit suas alteracoes
5. Abra um Pull Request

---

## Licenca

MIT
