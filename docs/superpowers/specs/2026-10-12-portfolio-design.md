# Portfólio e perfil GitHub para recrutamento

## Objetivo

Apresentar João Victor Faraco a recrutadores de automação, Python e IA aplicada, com estudos de caso verificáveis, links públicos funcionais e uma interface profissional com movimento acessível. Atualizar o site existente e o README do perfil, mantendo a publicação no GitHub Pages.

## Revisão solicitada pelo autor — direção final

O autor considerou que a primeira implementação mudou demais o portfólio e pediu “menos IA”. Esta orientação substitui as escolhas visuais e a estrutura propostas abaixo: preservar azul/amarelo, foto em cores e as seções originais início, sobre, habilidades, projetos, experiência e contato. A apresentação inicial destaca nome, cargo, Python, automação e integrações, com linguagem direta. Projetos públicos aparecem primeiro; o validador com IA fica como um dos projetos. Remover a demonstração interativa de IA, diagramas de sistema e tipografia editorial em itálico. Manter filtros, detalhes acessíveis, tema persistente, controle de movimento e animações discretas. Preservar Google Fonts e Font Awesome do original. Os critérios de conteúdo, privacidade e verificação continuam válidos; o teste dos cenários removidos deixa de se aplicar. O README do perfil já foi integrado com autorização, e a revisão solicitada nesta etapa se concentra no portfólio.

## Escopo autorizado

O usuário pediu revisão dos projetos locais e do GitHub, pesquisa de tendências e atualização do portfólio e do README do perfil. Confirmou foco em recrutadores para automação, Python e IA aplicada. A implementação e as escolhas visuais de rotina podem avançar dentro desse escopo. Trabalhar em clones e branches dedicadas; preparar resultado verificável e revisão antes da integração remota final.

## Evidência de conteúdo

- Perfil existente: João Victor Faraco, São José/SC, Analista de Sistemas na Orsegups desde março/2025. Hardware de setembro/2024 a março/2025; estágios Figueirense e Instituto São José; Gestão de TI concluída em 2025 e MBA em IA em andamento. Preservar sem acrescentar títulos ou certificações.
- Projetos públicos: `mapaderotas` (pipeline geoespacial; demo fictícia, CI e 83% de cobertura reportados no README), `operational-dashboard-platform` (Flask/pandas; demo estática fictícia), `bot-telegram` (scraping, critérios de preço, Telegram, Actions e estado persistido). Não acessar nem copiar configurações ou secrets do bot.
- Projetos locais: a365-ia (regras determinísticas, OCR, integração CRM, catálogo de labels, locks e reconciliação); a365-portal (FastAPI/SQLite, contas/rota, produtividade e privacidade); coletores, comissionamento, reagendamento, divisão de rotas e assistente de agenda. Repositórios internos são privados; descrevê-los com contexto técnico e sem links mortos para recrutadores.
- Medições de testes podem ser publicadas somente como snapshot com data e escopo, com evidência salva em `docs/content-audit.md`. Não inventar economia financeira, percentuais de produtividade, clientes ou disponibilidade imediata para trabalho.

## Direção visual e editorial

Escolha do implementador: tema inicial escuro em carvão, texto marfim, acento âmbar, cor secundária menta para estados; tipografia sans para leitura e mono apenas para detalhes técnicos. Preservar a foto existente e contatos públicos. Usar composições assimétricas, bordas discretas, bastante espaço e texto curto. Nada de vídeo pesado, dependência de biblioteca de ícones externa ou feed de estatísticas de terceiros.

Hero apresenta nome, especialidade, proposta de valor e CTA para projetos/LinkedIn. Foto em composição editorial, acompanhada de diagrama técnico original desenhado em HTML/CSS/SVG com dados fictícios. Perfil não deve se resumir a um título genérico ou animação de digitação infinita.

## Estrutura do site

1. Navegação fixa: Projetos, Como trabalho, Trajetória, Contato; tema e menu mobile sem esconder conteúdo se JS falhar.
2. Hero e resumo de competências.
3. Projetos: cards de tamanho variável, filtros Todos / IA aplicada / Automação / Dados e web; sete estudos cobrindo validador, portal, integração CRM, rotas públicas, dashboard público, kit de ferramentas e bot Telegram. Assistente de agenda citado como evolução em validação, sem alegar produção plena.
4. Cada card tem problema, abordagem e resultado qualitativo; detalhe em `dialog` acessível com decisões técnicas, limites e links públicos quando existirem. Sem nomes de clientes, prints internos ou contratos reais.
5. Demonstração interativa do fluxo determinístico + IA com três cenários fictícios (pacote completo, evidência incompleta, atendimento fora do escopo), etapas selecionáveis e resultado explicitamente ilustrativo. Não chama API, não sugere decisão autônoma final, não aceita PII.
6. Competências agrupadas por problema/camada e trajetória concisa com educação.
7. Contato com mailto real, LinkedIn e GitHub; botão de copiar e-mail com fallback acessível; referência à publicação digital existente em seção secundária.

## Movimento e acessibilidade

Revelações discretas por IntersectionObserver, transições de filtros e estado, progresso de leitura, realce de fluxo ao selecionar etapas. Usar principalmente opacity/transform. Não bloquear leitura sem JS nem sequestrar scroll/cursor. Sem carrossel automático ou movimento decorativo infinito. `prefers-reduced-motion` remove efeitos não essenciais; botão explícito permite pausar movimento. Menus, filtros e detalhes funcionam por teclado; Escape fecha; foco retorna ao acionador. Temas têm contraste AA, imagens têm dimensões e alt, link de salto, labels e feedback em aria-live.

## README do perfil

Introdução clara, especialidade em automação/IA aplicada, três projetos públicos com links, estudos internos resumidos, stack sustentada pelo código, experiência/educação e contatos. Banner SVG estático local com alternativa para light/dark; nenhum contador de visualizações ou typing remoto. Markdown não recebe JS ou CSS de aplicação. Adicionar assistente de agenda e evolução dos fluxos, sem apresentar o agente conversacional discutido nesta sessão como produto concluído.

## Implementação e validação

Manter HTML/CSS/JS estáticos com arquivos separados (`index.html`, `assets/styles.css`, `assets/app.js`, `assets/projects.js`); nenhuma dependência de produção. Testes de interação Playwright e acessibilidade axe: filtros e restauração, diálogo/foco, cenários, menu mobile, persistência de tema, movimento reduzido, conteúdo sem JS e overflow. Inspecionar imagens desktop/mobile. Checar links, metadados SEO/OG, ausência de dados internos e integridade do deploy em subpath. A integração final usa dois commits/branches independentes e deve preservar GitHub Pages e os repos privados.

## Referências consultadas

- https://webflow.com/blog/web-design-trends-2026 — resumo inicial, texto essencial, navegação com progresso e visual próprio.
- https://webflow.com/blog/microinteractions — feedback curto e consistente.
- https://web.dev/articles/animations-guide — priorizar opacity/transform.
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion — respeitar preferência do usuário.
- https://docs.github.com/en/account-and-profile/tutorials/using-your-github-profile-to-enhance-your-resume — projetos selecionados e READMEs demonstráveis.
