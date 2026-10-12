# João Victor Faraco — Portfólio

Apresentação de projetos de **automação, Python e IA aplicada**, orientada a recrutadores. Site estático com estudos de caso, exemplos interativos e trajetória profissional.

**[Abrir portfólio](https://jvfaraco.github.io/jvfaraco-portifolio/)** · [Perfil GitHub](https://github.com/JvFaraco)

## O que mudou

- Projetos descritos pelo problema, abordagem, resultado e decisões de engenharia.
- Filtros por IA, automação e dados/web; detalhes acessíveis em diálogo.
- Demonstração de pré-validação com três cenários fictícios e etapas exploráveis.
- Tema claro/escuro persistente, navegação mobile e feedback ao copiar e-mail.
- Revelação por scroll, progresso de leitura e microinterações curtas.
- Movimento reduzido conforme o sistema e controle manual de animações.
- Leitura e links preservados sem JavaScript; sem dependências de produção.

## Projetos em destaque

| Público | Explorar |
|---|---|
| Route Coverage Map — Python/Leaflet/IBGE | [Código](https://github.com/JvFaraco/mapaderotas) · [Demo fictícia](https://jvfaraco.github.io/mapaderotas/) |
| Operations Dashboard — Flask/pandas/Chart.js | [Código](https://github.com/JvFaraco/operational-dashboard-platform) · [Demo estática fictícia](https://jvfaraco.github.io/operational-dashboard-platform/) |
| Bot de alertas — Python/Telegram/GitHub Actions | [Código](https://github.com/JvFaraco/bot-telegram) |

Estudos internos: validador de OS com IA, portal operacional, integração de OS com CRM e ferramentas de campo/agenda. Não publicam código privado ou dados reais. O assistente de agenda está em validação e seus limites são apresentados no estudo.

## Executar localmente

O site não precisa de build. Para um servidor estático com suporte ao caminho do GitHub Pages:

```sh
npm ci
npm run dev
```

Abra `http://127.0.0.1:4173/jvfaraco-portifolio/`. Esse servidor é apenas de desenvolvimento e se limita a localhost. Para hospedagem, publique os arquivos estáticos com GitHub Pages; nenhum servidor Node é necessário.

## Verificação

```sh
npx playwright install chromium
npm test
```

No Windows com Edge instalado, também pode usar:

```powershell
$env:PW_CHANNEL = 'msedge'
npm test
```

A suíte cobre filtros, retorno de foco, cenários, menu mobile, tema persistente, localStorage bloqueado, movimento reduzido, conteúdo sem JS, acessibilidade axe e carregamento de assets no subpath. A análise automatizada de acessibilidade complementa a verificação manual; não certifica todo o site.

Capturas para revisão visual, com `npm run dev` ativo:

```sh
node tests/capture.cjs
```

As imagens são salvas em `.preview/`, ignorada pelo Git. A CI verifica o site sem publicar previews ou alterar a configuração do Pages.

## Estrutura

```text
index.html                 conteúdo semântico e projetos sem JS
assets/styles.css          temas, composição responsiva e movimento
assets/app.js              interações e preferências
assets/projects.js         conteúdo dos estudos de caso
assets/mark.svg             marca e favicon
img/Eu.jpg                 foto original
 tests/                    servidor local, testes e capturas
 docs/content-audit.md      fontes, evidências e limites editoriais
```

## Critérios de conteúdo

[Auditoria e fontes](docs/content-audit.md) registram a origem das informações e o escopo da métrica de testes. Nenhum resultado financeiro, ganho percentual ou taxa de acerto foi inventado. Visuais são ilustrações e não se conectam a APIs operacionais. O README do perfil tem uma apresentação complementar, com banner SVG local.

## Contato

[LinkedIn](https://www.linkedin.com/in/jo%C3%A3o-victor-faraco-01066423a/) · [joaovictorfaraco@gmail.com](mailto:joaovictorfaraco@gmail.com)
