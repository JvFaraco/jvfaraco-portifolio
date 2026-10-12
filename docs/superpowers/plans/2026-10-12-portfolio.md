# Atualização do portfólio e perfil Implementation Plan

**Goal:** entregar apresentação orientada a recrutadores com estudos atuais, dinâmica acessível e README coerente.

**Architecture:** site estático preserva GitHub Pages, separando conteúdo, estilo e comportamento. Perfil GitHub usa Markdown e banner SVG local. Nenhuma credencial, payload interno ou imagem de cliente é transportada.

**Tech Stack:** HTML, CSS, JavaScript nativos; Playwright e axe somente para desenvolvimento.

**Spec:** `docs/superpowers/specs/2026-10-12-portfolio-design.md`.

## Global Constraints

- Público: recrutadores para automação, Python e IA aplicada.
- Preservar foto, contatos, trajetória e URL existentes.
- Projetos privados recebem estudos descritivos, sem link de código inacessível.
- Demonstrações usam exclusivamente dados fictícios e executam somente no navegador.
- Sem dependências de produção, APIs externas de métricas ou movimento decorativo contínuo.
- Preservar leitura sem JS, teclado, foco, contraste e movimento reduzido.

## Review Focus

- Filtro seguido de fechamento do diálogo deve devolver foco ao botão acionador.
- Navegação móvel deve permanecer utilizável por teclado e sem JS.
- Tema/movimento precisam funcionar mesmo quando localStorage falha.
- Conteúdo compartilhado não pode alegar métricas de negócio não verificadas ou produção de protótipo.
- Assets e links internos precisam funcionar no subpath do GitHub Pages.

## Task 1 — Contratos de interação

**Files:** `package.json`, `playwright.config.cjs`, `tests/serve.cjs`, `tests/portfolio.spec.cjs`, `.gitignore`.

- [x] Criar testes de filtro, diálogo/foco, três cenários, mobile, tema persistido, movimento reduzido, localStorage indisponível, sem JS, axe e erros de página.
- [x] Rodar contra o site anterior e confirmar falha por comportamentos ausentes.

## Task 2 — Página e comportamento

**Files:** `index.html`, `assets/styles.css`, `assets/app.js`, `assets/projects.js`, `assets/mark.svg`.

**Interfaces:** cards usam `data-category` e `data-project`; botões `data-filter` selecionam categorias; `projects` exporta registros identificados por id com problema/abordagem/resultado/decisões. `#project-dialog` expõe estudo; `#scenario` e `#pipeline-stage` controlam fluxo ilustrativo.

- [x] Reescrever estrutura semântica e composição editorial.
- [x] Implementar filtros, diálogo, cenários, menu, tema, movimento, clipboard e progresso.
- [x] Rodar suíte e corrigir comportamentos/contraste; inspecionar desktop/mobile.
- [x] Verificar conteúdo, links e subpath; registrar fontes em `docs/content-audit.md`.

## Task 3 — Perfil e documentação

**Files:** README do perfil no clone `profile-2026-10-12`, `assets/profile-banner.svg`; README do site; `.github/workflows/check.yml`.

- [x] Reescrever perfil com três projetos públicos, estudos internos, stack e carreira comprovadas.
- [x] Adicionar banner local, sem feeds remotos nem estatísticas voláteis.
- [x] Documentar execução, testes, capacidades, limites e decisões de design; CI testa sem deploy.

## Task 4 — Revisão e integração

- [x] Executar suite completa, visual QA e checagens de links/segredos.
- [x] Solicitar revisão independente dos dois diffs; corrigir problemas importantes.
- [x] Criar commits locais específicos e resultado reviewável. Não incluir arquivos de projetos operacionais ou credenciais.
- [ ] Usar a autorização do usuário para decidir integração remota; caso não explícita para publicação, aprovação somente após apresentar resultado verificado.
