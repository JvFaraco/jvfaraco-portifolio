export const projects = {
  validator: {
    title: 'Validador de O.S. com IA', category: 'IA aplicada / projeto interno',
    intro: 'Pré-validação de pós-venda e instalação com evidências, regras verificáveis e interpretação assistida por IA.',
    problem: 'Conferir um atendimento exige cruzar histórico, equipamentos, movimentações, eventos, notas e documentos. A observação isolada não sustenta toda a análise.',
    approach: 'Um pipeline coleta e normaliza o pacote, lê contrato e comprovantes por OCR local e aplica regras determinísticas antes do modelo. A classificação é limitada ao catálogo operacional.',
    result: 'A conferência recebe classificação, observação e pendências com evidências. Casos incompletos retornam para correção; o agente não aprova nem reprova definitivamente a OS.',
    decisions: ['Escopo e coleta separados da interpretação da IA.', 'Sanitização e projeção antes de enviar contexto ao modelo.', 'Locks, reconciliação e releitura para controlar duplicação e escrita incerta.', '1.503 testes locais passando em 12/10/2026; medida da suíte, não da acurácia da IA.'],
    limits: 'Repositório privado. Os exemplos do portfólio são fictícios. Aprovação final humana e leitura inconclusiva continuam explícitas.', links: []
  },
  portal: {
    title: 'Portal Operacional A365', category: 'Sistemas web / projeto interno',
    intro: 'Uma camada de consulta para OS, produtividade, rotas, contas e administração.',
    problem: 'Dados e ferramentas dispersos dificultam uma visão compartilhada das filas de trabalho e da cobertura dos especialistas.',
    approach: 'FastAPI e SQLite organizam autenticação e dados coletados. O pipeline distingue fila operacional de histórico finalizado, usa coleta incremental e resolve cobertura por fontes específicas.',
    result: 'Dashboards e mapas reúnem contexto para supervisão. Auditorias diferenciam conta sem rota, rota sem especialista e informação ainda não verificada.',
    decisions: ['Watermark com sobreposição para reprocessar alterações sem duplicar registros.', 'Catálogo de rotas independente da presença de OS ou técnicos no ciclo.', 'Credenciais protegidas por DPAPI nos inicializadores Windows.', 'Projeção de campos antes da publicação dos dados nos dashboards.'],
    limits: 'Aplicação interna. O estudo não publica telas, contas, nomes de clientes nem dados de produção.', links: []
  },
  routes: {
    title: 'Route Coverage Map', category: 'Geoprocessamento / código público',
    intro: 'Descrições tabulares de território transformadas em um mapa autocontido.',
    problem: 'Nomes de bairros e cidades nem sempre têm coordenadas ou limites confiáveis. Aproximações podem se sobrepor e esconder a precisão real do mapa.',
    approach: 'Geocodificação progressiva, cache, limites oficiais do IBGE e fallback por Voronoi. Geometrias são recortadas e a precisão é registrada no payload.',
    result: 'Mapa navegável com filtros e áreas de cobertura. A demonstração usa dados inteiramente fictícios e implementações sintéticas dos provedores.',
    decisions: ['Precisão explícita: área aproximada não é apresentada como limite oficial.', 'Recorte de sobreposição com teste de regressão geométrica.', 'Pipeline desacoplado de HTTP para execução e testes offline.', 'Allowlist na geração do payload; endereços pessoais não chegam à vitrine.'],
    limits: 'As métricas do README pertencem ao dataset de demonstração, não à operação real.', links: [['Ver demonstração', 'https://jvfaraco.github.io/mapaderotas/'], ['Ver código', 'https://github.com/JvFaraco/mapaderotas']]
  },
  dashboard: {
    title: 'Operations Dashboard', category: 'Dados e visualização / código público',
    intro: 'Uma visão navegável de ordens de serviço e indicadores a partir de planilhas.',
    problem: 'Múltiplos arquivos e filtros manuais dificultam comparar filas, agendas, risco contratual e concentração geográfica.',
    approach: 'Backend Flask lê e normaliza Excel com pandas. APIs JSON separam o processamento das interfaces e o cache é invalidado quando a base muda.',
    result: 'Cinco módulos: controle de OS, agendadas, não agendadas, risco contratual e cobertura. A demo no GitHub Pages é uma apresentação estática com dados fictícios.',
    decisions: ['Distinguir a demo pública das funções do backend real.', 'Normalização antes da visualização, evitando regras espalhadas nos templates.', 'Gráficos e prioridades com contexto operacional.', 'Configuração e bases reais ficam fora do repositório público.'],
    limits: 'A demo pública não executa login, upload ou processamento de dados; essas funções pertencem ao backend Flask.', links: [['Ver demonstração', 'https://jvfaraco.github.io/operational-dashboard-platform/'], ['Ver código', 'https://github.com/JvFaraco/operational-dashboard-platform']]
  },
  crm: {
    title: 'Integração de OS com CRM', category: 'Automação e integrações / projeto interno',
    intro: 'Contratos, respostas do cliente e histórico sincronizados com a ordem de serviço.',
    problem: 'Buscar contratos no CRM e anexar documentos à OS exige repetição manual. Reenvios podem duplicar anexos e mudanças posteriores precisam de acompanhamento.',
    approach: 'Consultas HTTP resolvem documentos e negócios, processam PDF e acompanham versões/timeline. O fluxo mantém estado e confere os efeitos das escritas.',
    result: 'RPL e informações do cliente acompanham o atendimento. A integração evoluiu para um módulo separado dentro do validador, com filas próprias.',
    decisions: ['Não confundir identificador de negócio com identificador de documento.', 'Rotação conjunta de access e refresh token.', 'Deduplicação e estado para evitar repetição de notas/anexos.', 'Leitura idempotente tem retry; escrita incerta exige conferência antes da repetição.'],
    limits: 'Fluxos antigo e novo não devem escrever simultaneamente na mesma OS. Este estudo não contém documentos ou credenciais reais.', links: []
  },
  toolkit: {
    title: 'Ferramentas para a operação', category: 'Automação de processos / projetos internos',
    intro: 'Relatórios, auditorias, reagendamento e recomendação de agenda sobre contratos compartilhados.',
    problem: 'Conferências repetidas consomem atenção e podem misturar falha de leitura com ausência de informação.',
    approach: 'Módulos específicos de comissionamento, equipamentos removidos e auditoria de contas/rotas. Reagendamento relê a OS antes de alterar e confere depois. O assistente de agenda combina contexto de cidade/bairro e estimativas de esforço.',
    result: 'Ferramentas acessíveis por executável ou inicializador, com resultados inconclusivos separados. A base comum padroniza autenticação, travas, contratos e testes.',
    decisions: ['Offset avança pelo tamanho real da página e duplicatas são identificadas nos leitores robustos.', 'Código físico, inventário e movimentação de equipamento têm fontes distintas.', 'Escrita operacional fica isolada dos relatórios de leitura.', 'Assistente Chrome MV3 somente recomenda: o operador decide e salva na tela oficial.'],
    limits: 'O assistente de agenda está em validação; bloqueios não foram medidos e as estimativas de duração precisam de calibração. O executável de manutenção remota não tem fonte disponível na pasta revisada.', links: []
  },
  bot: {
    title: 'Bot de alertas no Telegram', category: 'Automação agendada / código público',
    intro: 'Monitoramento de ofertas com critérios configuráveis e notificações deduplicadas.',
    problem: 'Revisar páginas de produto e categorias manualmente para encontrar uma oferta relevante é repetitivo; alertas sem critério geram ruído.',
    approach: 'Scrapers extraem ofertas e cupons; filtros de preço, desconto e palavras-chave selecionam o que notificar. Um workflow agendado executa o processo e mantém o estado das notificações.',
    result: 'Alertas enviados ao Telegram quando os critérios configurados são atendidos. O estado registrado no workflow evita reavisar a mesma oferta.',
    decisions: ['Piso de preço para descartar leituras improváveis.', 'Critérios combinados de desconto, preço e título.', 'Extração de cupom somente para ofertas que passaram pelos filtros.', 'Credenciais do bot configuradas em secrets do GitHub Actions.'],
    limits: 'Scraping depende da estrutura e disponibilidade das páginas; o projeto não garante precisão ou entrega contínua em qualquer fonte.', links: [['Ver código', 'https://github.com/JvFaraco/bot-telegram']]
  }
};
