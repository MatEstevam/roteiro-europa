# Decisoes de Produto

## Por que nao ha compra de passagens no MVP

- **Responsabilidade legal:** Intermediar compras gera responsabilidade por cancelamentos, reembolsos e problemas com companhias aereas
- **PCI Compliance:** Processar cartoes de credito exige certificacao PCI DSS, auditoria e infraestrutura dedicada
- **Complexidade operacional:** Gestao de reservas, e-tickets, alteracoes e suporte ao cliente sao operacoes complexas
- **Proposta de valor:** O foco do MVP e planejar e inspirar, nao ser uma OTA (Online Travel Agency)
- **Alternativa:** Redirecionar o usuario para o site oficial da companhia aerea ou agregador com deeplink

---

## Por que abstrair providers

- **Testabilidade:** Testes unitarios e de integracao rodam sem dependencia de APIs externas ou custos
- **Independencia de fornecedor:** Trocar Amadeus por Skyscanner (ou Google Places por Foursquare) sem alterar logica de negocio
- **Modo demo:** Permite demonstrar o produto completo sem necessidade de chaves de API
- **Desenvolvimento paralelo:** Frontend pode avancar com mocks enquanto integracao e desenvolvida

---

## Por que modo demo

- **Avaliacao:** Usuarios e stakeholders podem avaliar o produto sem configurar APIs externas
- **Testes:** CI/CD roda sem custos de API ou rate limits
- **Sem custo:** Nenhuma chave de API necessaria para rodar o projeto localmente
- **Sem chaves necessarias:** Desenvolvedores novos podem contribuir imediatamente

---

## Como custos sao estimados

- Baseados em **dados estaticos** pesquisados e curados manualmente
- Apresentados como **faixas** (min-max), nunca valores exatos
- **Nunca garantidos** - sempre exibir disclaimer ao usuario
- Multiplicadores por nivel de orcamento (economico: 0.8x, moderado: 1x, confortavel: 1.3x)
- Moeda padrao: BRL (Real Brasileiro)

---

## Como evitar dados inventados

- **Apenas mostrar o que a API retorna:** Nao preencher campos com suposicoes
- **Fallback explicito:** Quando informacao nao esta disponivel, exibir "Consultar site oficial" com link
- **Fonte indicada:** Cada atividade indica se veio de "algoritmo", "demonstracao" ou "API"
- **Sem horarios inventados:** Se horario de funcionamento nao e confirmado, nao exibir

---

## Limitacoes de horarios de funcionamento

- Podem estar **desatualizados** (fonte: Google Places ou dados estaticos)
- **Variam por temporada** (verao/inverno, feriados)
- **Sempre exibir disclaimer:** "Horarios sujeitos a alteracao. Consulte o site oficial antes da visita."
- Nao bloquear sugestoes por horario - apenas informar

---

## Limitacoes de precos de voos

- Precos sao **volateis** e mudam a cada minuto
- Cache de **15 minutos** para evitar dados muito defasados
- **Nunca garantidos** - exibir "Precos aproximados. Consulte a companhia para valor atualizado."
- Precos mostrados sao para o conjunto de passageiros (total), nao por pessoa isoladamente

---

## Formula do Balance Score

Formula: `0.5 * priceScore + 0.3 * durationScore + 0.2 * stopsScore`

| Dimensao | Peso | Justificativa |
|----------|------|---------------|
| Preco | 50% | Principal fator de decisao para viajantes brasileiros |
| Duracao | 30% | Conforto e aproveitamento do tempo de ferias |
| Escalas | 20% | Conveniencia, risco de perda de conexao |

Cada score e **normalizado dentro do conjunto de resultados:**
- `score = 1 - (valor - min) / (max - min)`
- Se todos os valores sao iguais numa dimensao, score = 1 para todos

---

## Algoritmo de distribuicao de cidades

1. **Entrada:** Lista de cidades, total de dias, ritmo
2. **Ordenacao geografica:** Cidades ordenadas por regiao para minimizar deslocamento
3. **Distribuicao proporcional:** Noites alocadas proporcionalmente ao `relevanceWeight` (1-5)
4. **Minimo de 2 noites** por cidade (tempo suficiente para conhecer minimamente)
5. **Ajuste por ritmo:** Slow (1.2x), Balanced (1x), Intense (0.8x) antes da normalizacao
6. **Normalizacao:** Ajuste iterativo para totalizar exatamente `totalDays - 1` noites
7. **Excesso de cidades:** Se ha mais cidades que o possivel, selecionar as mais relevantes

---

## Estrategia de autenticacao

- **Opcional:** O produto funciona 100% sem login
- **Apenas para salvar:** Login necessario somente para persistir roteiros e preferencias
- **Providers:** NextAuth com Google e Email magic link
- **Sem paywall:** Todas as funcionalidades de planejamento sao gratuitas e acessiveis sem conta
