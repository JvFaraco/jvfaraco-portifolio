# Conteúdo e referências da atualização

Data: 12/10/2026. Público escolhido pelo autor: recrutadores de automação, Python e IA aplicada.

## Repositórios examinados

- Site anterior: `JvFaraco/jvfaraco-portifolio`, base `715fab8e84ec7ce9d3f2c51d3b97427470c87d99`.
- Perfil anterior: `JvFaraco/Jvfaraco`, base `36112b61347ffa5365a4a48b1d579d525eee904c`.
- [mapaderotas](https://github.com/JvFaraco/mapaderotas): geocodificação, IBGE, fallback por Voronoi, clipping e allowlist; o README separa dataset sintético e métricas da demo.
- [bot-telegram](https://github.com/JvFaraco/bot-telegram): monitoramento de produtos/categorias, critérios combinados, cupons, deduplicação e execução por GitHub Actions. Foram lidos README e estrutura; nenhum secret/config privado foi copiado.
- Repositórios A365 no GitHub identificados como privados. O material novo usa os contratos e fontes locais atuais, que podem estar à frente do remoto.

## Projetos locais revisados e uso editorial

| Projeto | Evidência examinada | Conteúdo usado |
|---|---|---|
| a365-ia | README, leitores/escritores, integração CRM, normalização, regras, requisitos e suíte | IA depois das regras, OCR local, classificação restrita, locks/reconciliação, integração de contratos |
| a365-portal | README, requisitos, coleta de OS, cobertura/contas e autenticação | FastAPI/SQLite, dashboards, coleta incremental, cadastro e cobertura com fontes distintas |
| a365-integraçãoploomes | README, service_orders e ploomes | Evolução da integração para módulo no validador; deduplicação e documentos/negócios com IDs distintos |
| a365-comissão | README e fontes auxiliares de relatório | Comissão, fonte de equipamento versus timeline do executor; não se alega revisão interna do executável |
| a365-equipamentosremovidos | README, varredura e contratos | Equipamento, inventário, movimentação e identificação física |
| a365-reagendamento | README e executor/regras | Releitura antes da alteração e conferência após escrita |
| collector-contas-rota | README e contratos/auditoria | Sem rota, rota sem especialista e inconclusivo são resultados distintos |
| a365-city-route-divider | README e cliente/DTO de cobertura | Geometria e manutenção de abrangência; não afirma método de atualização totalmente medido |
| ubidesk-base | README, contratos e assistente de agenda | Chrome MV3, recomendação de agenda, leitura medida e limitações de bloqueio/duração |
| a365-remota | LEIA-ME e inventário do executável | Existência da ferramenta; sem alegar código/testes de runtime não disponíveis |

## Métrica incluída

`python -m pytest -q` executado no a365-ia em 12/10/2026: **1503 passed in 21.80s**. O número apresentado é snapshot da suíte local do validador. Não mede acurácia do modelo, confiabilidade de produção, horas economizadas ou ROI. Não é uma contagem geral de testes de todo o GitHub.

Trajetória, instituições, formação e contatos foram preservados do perfil/site fornecidos pelo autor. Não foram inventadas disponibilidade imediata, certificações, clientes, receita ou resultados percentuais. A antiga menção de “22 regionais” e deploy específico não foi ampliada: a atualização prefere descrever capacidades verificáveis sem publicar indicadores internos desnecessários.

## Estado e privacidade

O agente conversacional discutido durante a sessão não foi anunciado como produto concluído. O assistente de agenda é descrito como em validação. A leitura dos bloqueios e calibração de duração continuam pendentes.

Todos os visuais de sistema são ilustrações HTML/CSS/SVG. Não há screenshots operacionais, payloads reais, contas, UUIDs, telefones, documentos, senhas, tokens, anexos ou arquivos `.env` copiados. Projetos privados não ganham links de código que um recrutador não consegue abrir.

## Referências de design pesquisadas

- [Webflow, tendências 2026](https://webflow.com/blog/web-design-trends-2026): visual próprio, texto essencial, resumo antes de aprofundamento e navegação com progresso. Escolhas do implementador, não consenso universal de mercado.
- [Webflow, microinterações](https://webflow.com/blog/microinteractions): feedback breve, consistente e relacionado à ação.
- [web.dev, desempenho das animações](https://web.dev/articles/animations-guide): preferir transform/opacity e evitar trabalho de layout por frame.
- [MDN, movimento reduzido](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): respeitar configuração do sistema.
- [GitHub, perfil para recrutamento](https://docs.github.com/en/account-and-profile/tutorials/using-your-github-profile-to-enhance-your-resume): selecionar projetos, explicar utilidade e facilitar demonstração.

Não foram incorporados todos os efeitos populares: animação infinita, cursor personalizado, vídeo pesado e feeds externos de estatísticas não contribuem para este objetivo. O README usa recursos suportados pelo GitHub (Markdown/HTML simples e SVG local), não JavaScript ou CSS de aplicação.

## Verificação da apresentação

A primeira versão passou em 12 testes locais e na CI Ubuntu. Antes da integração, o autor pediu menos mudanças no portfólio e uma apresentação menos centrada em IA. A versão revisada restaura a identidade azul/amarelo e as seções originais, usa foto em cores, textos diretos e coloca automação e projetos públicos primeiro. Remove a demonstração de IA da página e mantém filtros, estudos de caso, temas e animações discretas. Google Fonts e Font Awesome são preservados do original. A suíte atual tem 12 testes: remove o teste do cenário excluído e adiciona a regressão do botão de voltar ao início, identificado pela segunda revisão independente. Não foram executados testes em Safari/Firefox nem validação com leitor de tela.

## Linha de base de desempenho (28/10/2026)

Lighthouse 12, perfil mobile, Edge headless, mediana de 3 execuções.

| Medição | Performance | FCP | LCP | CLS |
|---|---|---|---|---|
| Produção antes de `feat/perf-base` (site publicado) | 53–55 | 4,2–4,3 s | 4,4–4,6 s | 0,43 |
| `feat/perf-base`, local com gzip (linha de base das etapas) | 100 | 0,98 s | 1,20 s | 0 |

O site publicado deve ser medido de novo depois do merge de `feat/perf-base`; a medição local não inclui a latência real do GitHub Pages e das CDNs. Critério das etapas seguintes: Performance ≥ 90 e CLS ≤ 0,1, medidos antes e depois de cada etapa no mesmo ambiente.

| Etapa | Antes | Depois |
|---|---|---|
| 1. Hero | 100 · FCP 0,98 s · LCP 1,20 s · CLS 0 | 100 · FCP 1,05 s · LCP 1,35 s · CLS 0 |
| 2. Narrativa | 100 · FCP 1,05 s · LCP 1,35 s · CLS 0 | 100 · FCP 1,16 s · LCP 1,35 s · CLS 0 |
| 3. Projetos | 100 · FCP 1,16 s · LCP 1,35 s · CLS 0 | 100 · FCP 1,16 s · LCP 1,35 s · CLS 0 |
| 4. Experiência e competências | 100 · FCP 1,16 s · LCP 1,35 s · CLS 0 | 100 · FCP 1,17 s · LCP 1,35 s · CLS 0 |
| 5. Contato | 100 · FCP 1,17 s · LCP 1,35 s · CLS 0 | 100 · FCP 1,19 s · LCP 1,35 s · CLS 0 |
