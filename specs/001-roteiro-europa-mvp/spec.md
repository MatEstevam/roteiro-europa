# Feature Specification: Roteiro Europa MVP

**Feature Branch**: `001-roteiro-europa-mvp`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Planejador de viagens para Europa - MVP funcional com roteiro, passagens aéreas e modo demonstração para famílias brasileiras"

## Clarifications

### Session 2026-07-18

- Q: Quando o login é exigido? → A: Login exigido apenas para salvar a viagem. Usuários anônimos podem gerar e visualizar roteiros, mas perdem dados ao sair.
- Q: O que acontece com o roteiro anônimo ao fazer login? → A: Ao fazer login/cadastro, o roteiro gerado na sessão é automaticamente vinculado à conta.
- Q: Compartilhamento de viagem entre viajantes? → A: Viagem pode ser compartilhada via link público (somente leitura, sem login necessário).
- Q: Como distribuir dias entre cidades sem preferência explícita? → A: Distribuição proporcional à relevância turística da cidade (cidades maiores/mais famosas recebem mais dias).
- Q: Pesos da fórmula "Melhor equilíbrio" para voos? → A: 50% preço, 30% duração, 20% conexões.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar viagem com roteiro gerado automaticamente (Priority: P1)

Um usuário brasileiro (família planejando viagem para Europa) acessa a aplicação, preenche um assistente em etapas com datas, origem, destinos, perfil de viagem e preferências, e recebe um roteiro completo dividido por cidades e dias, com atividades, horários e custos estimados.

**Why this priority**: Esta é a funcionalidade central da aplicação — sem ela, não há produto. O roteiro é o principal entregável de valor.

**Independent Test**: Pode ser testado completamente usando dados mock, sem APIs externas. O usuário preenche o wizard e visualiza o roteiro gerado com a viagem de demonstração (Vitória → Lisboa → Paris → Roma, 12 dias).

**Acceptance Scenarios**:

1. **Given** o usuário está na landing page, **When** clica em "Planejar minha viagem", **Then** é direcionado ao assistente de criação em etapas.
2. **Given** o usuário está na etapa de datas, **When** seleciona ida e volta, **Then** o sistema calcula automaticamente a quantidade de dias e noites.
3. **Given** o usuário completou todas as 5 etapas do assistente, **When** clica em "Criar meu roteiro", **Then** o sistema gera um roteiro com divisão por cidades e programação diária.
4. **Given** o roteiro foi gerado, **When** o usuário visualiza a página do roteiro, **Then** vê cabeçalho com resumo, linha do tempo de cidades, cards de dias com atividades detalhadas (horário, duração, custo, endereço).
5. **Given** a viagem tem mais de 7 dias, **When** o roteiro é gerado, **Then** inclui pelo menos um período livre.
6. **Given** o ritmo selecionado é "equilibrado", **When** o roteiro é gerado, **Then** cada dia tem no máximo 3 atrações principais.

---

### User Story 2 - Pesquisar passagens aéreas simuladas (Priority: P2)

O usuário acessa a área de passagens, preenche origem, destino, datas e número de viajantes, e recebe uma lista de voos simulados com preços, duração, conexões e ordenação por diferentes critérios.

**Why this priority**: Passagens aéreas são a segunda maior necessidade declarada. No MVP, funciona com dados mock mas com a estrutura pronta para APIs reais.

**Independent Test**: Pode ser testado com o MockFlightSearchProvider sem credenciais externas. O usuário pesquisa e recebe resultados fictícios realistas.

**Acceptance Scenarios**:

1. **Given** o usuário está na página de passagens, **When** preenche o formulário e pesquisa, **Then** recebe cards de voos com companhia, preço, duração e conexões.
2. **Given** resultados foram exibidos, **When** o usuário ordena por "Menor preço", **Then** os resultados são reordenados corretamente.
3. **Given** o usuário habilitou aeroportos alternativos, **When** a pesquisa é realizada, **Then** vê comparação entre aeroportos com alertas sobre custos adicionais.
4. **Given** nenhum voo foi encontrado, **When** o resultado retorna vazio, **Then** exibe estado amigável com sugestões.

---

### User Story 3 - Salvar e reabrir viagem (Priority: P3)

O usuário autenticado pode salvar o roteiro gerado e reacessá-lo posteriormente na lista de viagens salvas.

**Why this priority**: Persistência permite que o usuário retorne à aplicação sem perder o trabalho. Essencial para uso real, mas o produto pode ser demonstrado sem isso.

**Independent Test**: Pode ser testado criando uma viagem, salvando, saindo e voltando para verificar que os dados persistem.

**Acceptance Scenarios**:

1. **Given** o usuário está visualizando um roteiro gerado, **When** clica em "Salvar", **Then** a viagem é persistida no banco de dados.
2. **Given** o usuário tem viagens salvas, **When** acessa `/viagens`, **Then** vê a lista com título, datas e status de cada viagem.
3. **Given** o usuário clica em uma viagem salva, **When** a página carrega, **Then** exibe o roteiro completo tal como foi salvo.

---

### User Story 4 - Modo demonstração sem APIs externas (Priority: P1)

A aplicação funciona completamente sem chaves de API configuradas, usando dados mock realistas para a viagem de exemplo (Vitória → Lisboa → Paris → Roma, 12 dias, 2 adultos).

**Why this priority**: Permite avaliação, teste e demonstração do produto sem dependências externas. É requisito explícito do MVP.

**Independent Test**: Executar a aplicação sem variáveis de ambiente de API e verificar que todas as funcionalidades funcionam com dados simulados claramente marcados como demonstração.

**Acceptance Scenarios**:

1. **Given** nenhuma API key está configurada, **When** o usuário gera um roteiro, **Then** recebe dados mock realistas marcados como "[Demonstração]".
2. **Given** modo demonstração ativo, **When** preços são exibidos, **Then** são acompanhados de aviso de que são estimativas simuladas.
3. **Given** modo demonstração ativo, **When** o usuário pesquisa voos, **Then** recebe resultados mock com aviso claro.

---

### User Story 5 - Visualização responsiva e acessível (Priority: P2)

A aplicação funciona bem em desktop e celular, com interface acessível para pessoas mais velhas e sem experiência em tecnologia.

**Why this priority**: O público-alvo inclui famílias com pouca familiaridade digital. A usabilidade é diferencial do produto.

**Independent Test**: Testar em viewport mobile e desktop, verificar navegação por teclado, contraste e áreas clicáveis.

**Acceptance Scenarios**:

1. **Given** o usuário acessa pelo celular, **When** navega pelo roteiro, **Then** todos os elementos são usáveis sem scroll horizontal.
2. **Given** o usuário navega por teclado, **When** percorre o wizard, **Then** todos os campos e botões são acessíveis com foco visível.
3. **Given** o usuário tem dificuldade visual leve, **When** lê os textos, **Then** a fonte é confortável e o contraste é adequado.

---

### User Story 6 - Editar preferências e regenerar roteiro (Priority: P3)

O usuário pode voltar às preferências de uma viagem existente, alterá-las e gerar um novo roteiro atualizado.

**Why this priority**: Permite iteração sem recomeçar do zero. Importante para uso real mas não bloqueia demonstração.

**Independent Test**: Criar viagem, editar preferências (ex: mudar ritmo), regenerar e verificar que o roteiro reflete as mudanças.

**Acceptance Scenarios**:

1. **Given** o usuário está na página do roteiro, **When** clica em "Editar preferências", **Then** é levado ao formulário com os dados pré-preenchidos.
2. **Given** o usuário alterou o ritmo de "equilibrado" para "tranquilo", **When** clica em "Criar meu roteiro", **Then** o novo roteiro tem no máximo 2 atrações por dia.

---

### Edge Cases

- O que acontece quando o usuário seleciona 5 países para apenas 7 dias? (aviso de viagem corrida, sugestão de reduzir)
- Como o sistema lida com datas passadas? (validação impede seleção)
- O que acontece se o Amadeus API retornar erro 429? (fallback para mock com aviso)
- Como o sistema se comporta com 0 adultos selecionados? (validação exige mínimo de 1 adulto)
- O que acontece quando a viagem tem apenas 2 dias? (roteiro simplificado apenas com chegada e saída)
- Como o sistema trata atrações fechadas no dia programado? (aviso ao usuário com sugestão de alternativa)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE apresentar uma landing page com título, explicação, imagem e botões de ação ("Planejar minha viagem" e "Encontrar passagens")
- **FR-002**: Sistema DEVE guiar o usuário por um assistente de 5 etapas: Datas, Origem, Destinos, Perfil, Confirmação
- **FR-003**: Sistema DEVE calcular automaticamente dias e noites a partir das datas selecionadas
- **FR-004**: Sistema DEVE permitir seleção múltipla de países europeus e sugerir cidades por país
- **FR-005**: Sistema DEVE gerar roteiro determinístico distribuindo dias entre cidades proporcionalmente à relevância turística (cidades maiores/mais famosas recebem mais dias), respeitando mínimo de 2 noites por cidade
- **FR-006**: Sistema DEVE limitar atividades diárias conforme ritmo: Tranquilo (2), Equilibrado (3), Intenso (4)
- **FR-007**: Sistema DEVE inserir intervalos para refeições e tempo de deslocamento entre atividades
- **FR-008**: Sistema DEVE exibir custo estimado por pessoa para cada atividade, dia e viagem total, sempre como estimativa
- **FR-009**: Sistema DEVE mostrar aviso permanente: "Valores, horários e disponibilidade podem mudar. Confirme nos sites oficiais."
- **FR-010**: Sistema DEVE permitir pesquisa de passagens com formulário completo (origem, destino, datas, viajantes, classe, conexões, bagagem, flexibilidade)
- **FR-011**: Sistema DEVE ordenar resultados de voos por: menor preço, menor duração, menos conexões, melhor custo-benefício, melhor horário
- **FR-012**: Sistema DEVE comparar aeroportos alternativos quando habilitado, com alertas sobre custos adicionais de deslocamento
- **FR-013**: Sistema DEVE funcionar 100% sem APIs externas usando mock providers com dados realistas
- **FR-014**: Sistema DEVE persistir viagens no banco de dados para usuários autenticados. Usuários anônimos podem gerar e visualizar roteiros sem login; ao criar conta/logar, o roteiro da sessão é vinculado automaticamente à conta
- **FR-015**: Sistema DEVE validar todas as entradas com Zod (datas válidas, mínimo 1 adulto, países válidos)
- **FR-016**: Sistema DEVE ser responsivo (mobile e desktop) com acessibilidade (contraste, fonte confortável, navegação por teclado)
- **FR-017**: Sistema DEVE mostrar filtros no roteiro: por cidade, atividades gratuitas/pagas, atividades que exigem reserva
- **FR-018**: Sistema DEVE incluir período livre em viagens com mais de 7 dias
- **FR-019**: Sistema DEVE avisar quando atividade exigir reserva antecipada
- **FR-020**: Sistema DEVE implementar cache para reduzir chamadas externas (atrações: 7 dias, voos: 15 min, imagens: 30 dias)
- **FR-021**: Sistema DEVE nunca expor chaves de API no frontend
- **FR-022**: Sistema DEVE implementar rate limiting nas rotas de pesquisa
- **FR-023**: Sistema DEVE exibir a interface em português do Brasil com datas no formato brasileiro e moeda BRL
- **FR-024**: Sistema DEVE sugerir Vitória/ES como aeroporto padrão com alternativas (RJ, SP, BH) editáveis
- **FR-025**: Sistema DEVE destacar nos resultados de voo: "Mais barato", "Mais rápido", "Melhor equilíbrio" (calculado com pesos: 50% preço, 30% duração, 20% conexões)
- **FR-026**: Sistema DEVE permitir compartilhamento de viagem via link público (somente leitura, sem login necessário para visualizar)

### Key Entities

- **User**: Usuário autenticado que cria e gerencia viagens
- **Trip**: Viagem com datas, origem, destinos, preferências e status (rascunho/completa)
- **TripCity**: Cidade no roteiro com país, datas, noites e ordem na sequência
- **ItineraryDay**: Dia do roteiro com cidade, título, resumo e custo estimado
- **ItineraryActivity**: Atividade programada com horário, duração, custo, endereço, categoria e indicação de reserva
- **FlightSearch**: Pesquisa de voo realizada com parâmetros e timestamp
- **FlightOffer**: Oferta de voo encontrada com companhia, preço, duração, conexões
- **ApiCache**: Cache de respostas de APIs externas com TTL por tipo

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuário consegue criar uma viagem completa (do wizard ao roteiro gerado) em menos de 5 minutos
- **SC-002**: O roteiro gerado exibe corretamente divisão por cidades, programação diária com horários e custos estimados para todos os 12 dias da viagem de demonstração
- **SC-003**: A pesquisa de passagens retorna resultados em menos de 3 segundos (modo mock)
- **SC-004**: 100% das funcionalidades principais operam sem nenhuma chave de API externa configurada
- **SC-005**: A interface é utilizável em telas de 320px a 1920px sem elementos quebrados ou sobrepostos
- **SC-006**: Todos os elementos interativos são acessíveis via teclado com indicadores de foco visíveis
- **SC-007**: Usuário consegue salvar uma viagem e reacessá-la com todos os dados intactos
- **SC-008**: O sistema apresenta estados amigáveis (sem erros técnicos) para todos os cenários de erro identificados
- **SC-009**: A integração Amadeus está preparada e documentada, ativável com credenciais sem alteração de código
- **SC-010**: O projeto compila sem erros TypeScript e os testes principais passam

## Assumptions

- Usuários têm conexão à internet estável (não é offline-first)
- O público-alvo são famílias brasileiras com smartphone ou computador, potencialmente com pouca experiência digital
- O MVP não realiza compra de passagens — apenas pesquisa e redireciona
- Preços exibidos são sempre estimativas, nunca garantidos
- A viagem de demonstração (Vitória → Lisboa → Paris → Roma) é suficiente para validar o produto
- Autenticação será implementada com Auth.js/NextAuth usando credenciais simples ou OAuth (Google). Login não é obrigatório para gerar roteiros — apenas para salvar
- O banco de dados PostgreSQL estará disponível localmente para persistência
- O algoritmo determinístico de roteiro usa dados estáticos de atrações por cidade (mock provider) — não depende de IA
- Horários de funcionamento e preços nos dados mock são aproximações realistas baseadas em informações públicas de 2024-2025
- A aplicação será servida em ambiente Node.js (não edge runtime) para suportar Prisma
