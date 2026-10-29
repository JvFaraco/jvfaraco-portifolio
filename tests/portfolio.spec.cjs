const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('filtro de IA conserva o estudo relevante e permite restaurar todos', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'IA aplicada', exact: true }).click({ timeout: 2000 });
  await expect(page.getByRole('heading', { name: 'Validador de O.S. com IA', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Route Coverage Map', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Route Coverage Map', exact: true })).toBeVisible();
});

test('estudo de caso abre por teclado e devolve foco ao fechar com Escape', async ({ page }) => {
  await page.goto('./');
  const trigger = page.getByRole('button', { name: 'Explorar caso: Validador de O.S. com IA' });
  await trigger.focus({ timeout: 2000 }); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Decisões de engenharia');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden(); await expect(trigger).toBeFocused();
});

test('voltar ao início aparece após rolar e fica fora do foco quando oculto', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('./');
  const backTop = page.locator('#backTop');
  await expect(backTop).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(backTop).toBeVisible();
  await expect(backTop).toHaveCSS('opacity', '1');
  await backTop.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
  await expect(backTop).toBeHidden();
});

test('tema persiste entre carregamentos', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Ativar tema claro' }).click({ timeout: 2000 });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('armazenamento bloqueado não impede filtros nem troca de tema', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage blocked'); } }));
  await page.goto('./');
  await page.getByRole('button', { name: 'Ativar tema claro' }).click({ timeout: 2000 });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'IA aplicada', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Route Coverage Map', exact: true })).toBeHidden();
});

test('preferência de movimento reduzido mantém conteúdo legível e animações desligadas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(page.getByRole('heading', { name: /João Victor Faraco/ })).toBeVisible();
  await expect(page.locator('.reveal').first()).toHaveCSS('opacity', '1');
});

test('mobile permite navegar sem overflow e fecha menu com Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./');
  const menu = page.getByRole('button', { name: 'Abrir navegação' });
  await menu.click({ timeout: 2000 });
  await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
  await expect(page.locator('#navigation')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('viewport de 320px não exige rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('./');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('pausar animações também desliga scroll suave na raiz', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
});

test('sem JavaScript os casos e contato continuam disponíveis', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/jvfaraco-portifolio/');
  await expect(page.getByRole('heading', { name: 'Route Coverage Map', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Enviar e-mail', exact: true })).toHaveAttribute('href', 'mailto:joaovictorfaraco@gmail.com');
  await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
  await context.close();
});

test('página, tema claro e diálogo não têm violações axe A ou AA', async ({ page }) => {
  // Audit settled content rather than intermediate opacity of a reveal animation.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  for (let theme = 0; theme < 2; theme++) {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations.map(v => ({ rule: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    if (!theme) await page.getByRole('button', { name: 'Ativar tema claro' }).click({ timeout: 2000 });
  }
  await page.getByRole('button', { name: 'Explorar caso: Validador de O.S. com IA' }).click();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations.map(v => ({ rule: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});

test('subpath resolve assets sem erro de módulo ou imagem', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const failed = []; page.on('response', r => { if (r.url().startsWith('http://127.0.0.1:4173') && r.status() >= 400) failed.push(r.url()); });
  await page.goto('./'); await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]); expect(failed).toEqual([]);
  expect(await page.locator('img').evaluateAll(images => images.every(i => i.complete && i.naturalWidth > 0))).toBeTruthy();
});

test('carregamento no mobile não desloca o layout (CLS)', async ({ page }) => {
  // Web font swap depends on the OS fonts available; this guards the structural shifts (nav, icons, photo).
  await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('./'); await page.waitForLoadState('networkidle');
  expect(await page.evaluate(() => window.__cls)).toBeLessThan(0.05);
});

test('hero: nome acessível e subtítulo completo enquanto digita', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('João Victor Faraco');
  await expect(page.locator('#typing-animation .sr-only')).toHaveText('Python · Automação · Integração de sistemas');
  await expect(page.locator('#typing-animation')).toHaveClass(/typed/, { timeout: 4000 });
  await expect(page.locator('#typing-animation .typed-char:not(.on)')).toHaveCount(0);
});

test('hero: fundo de fluxo roda no topo e pausa fora da viewport', async ({ page }) => {
  await page.goto('./');
  const canvas = page.locator('canvas.hero-flow');
  await expect(canvas).toHaveAttribute('data-running', 'true', { timeout: 4000 });
  await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(canvas).toHaveAttribute('data-running', 'false');
});

test('hero: pausar remove o canvas, completa o typing e deixa tudo visível', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  await expect(page.locator('canvas.hero-flow')).toHaveCount(0);
  await expect(page.locator('#typing-animation .typed-char:not(.on)')).toHaveCount(0);
  for (const selector of ['.hero-tag', '.hero-line', '.hero-title .highlight', '#typing-animation', '.hero-desc', '.hero-actions'])
    await expect(page.locator(selector)).toHaveCSS('opacity', '1');
  expect(await page.locator('.hero-photo').evaluate(el => getComputedStyle(el, '::after').content)).toBe('none');
  await expect(page.locator('.hero-photo img')).toHaveCSS('transform', 'none');
});

test('hero: movimento reduzido não carrega efeitos nem esconde conteúdo', async ({ page }) => {
  const requested = []; page.on('request', r => requested.push(r.url()));
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('./'); await page.waitForLoadState('networkidle');
  expect(requested.some(url => url.endsWith('/hero.js'))).toBeFalsy();
  await expect(page.locator('html')).not.toHaveClass(/intro/);
  await expect(page.locator('canvas.hero-flow')).toHaveCount(0);
  await expect(page.locator('#typing-animation')).toHaveText('Python · Automação · Integração de sistemas');
  await expect(page.locator('.hero-actions')).toHaveCSS('opacity', '1');
});

test('hero: sem JavaScript o hero aparece completo', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/jvfaraco-portifolio/');
  await expect(page.locator('html')).not.toHaveClass(/intro/);
  await expect(page.locator('#typing-animation')).toHaveText('Python · Automação · Integração de sistemas');
  await expect(page.locator('.hero-actions')).toHaveCSS('opacity', '1');
  await context.close();
});

test('hero: 320px com movimento ligado não cria rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 }); await page.goto('./');
  await expect(page.locator('canvas.hero-flow')).toHaveAttribute('data-running', 'true', { timeout: 4000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('sobre: três momentos legíveis sem JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/jvfaraco-portifolio/');
  const steps = page.locator('.journey-step');
  await expect(steps).toHaveCount(3);
  for (const title of ['suporte e infraestrutura', 'testes de hardware', 'sistemas e IA'])
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(steps.last()).toHaveCSS('opacity', '1');
  await context.close();
});

test('sobre: o trilho avança com o scroll e a pausa deixa tudo visível', async ({ page }) => {
  await page.goto('./');
  const journey = page.locator('.journey');
  await expect(journey).toHaveClass(/live/);
  await expect(page.locator('.journey-step.is-active')).toHaveCount(0);
  await journey.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * .5));
  await expect.poll(() => page.locator('.journey-step.is-active').count()).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('.journey-step.is-active')).toHaveCount(3);
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  await expect(journey).not.toHaveClass(/live/);
  await expect(page.locator('.journey-rail')).toHaveCount(0);
  await expect(page.locator('.journey-step').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('#reading-progress')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('sobre: movimento reduzido não baixa journey.js e mostra os momentos', async ({ page }) => {
  const requested = []; page.on('request', r => requested.push(r.url()));
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('./'); await page.waitForLoadState('networkidle');
  expect(requested.some(url => url.endsWith('/journey.js'))).toBeFalsy();
  await expect(page.locator('.journey-step').nth(2)).toHaveCSS('opacity', '1');
});

test('projetos: Portal A365 fora do portfólio e contador com 5', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByText('Portal Operacional A365')).toHaveCount(0);
  await expect(page.locator('.project-card')).toHaveCount(5);
  await expect(page.locator('#filter-count')).toHaveText('5 projetos');
  expect(await page.evaluate(async () => Object.keys((await import('./assets/projects.js')).projects))).not.toContain('portal');
});

test('projetos: thumbs mostram o fluxo e animam só com o card visível', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.project-thumb svg.thumb-svg')).toHaveCount(5);
  const packet = page.locator('[data-project="crm"] .t-move');
  await expect.poll(() => packet.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.locator('[data-project="crm"]').scrollIntoViewIfNeeded();
  await expect.poll(() => packet.evaluate(el => getComputedStyle(el).animationName)).toBe('t-travel');
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  await expect.poll(() => packet.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('.project-card.in-view')).toHaveCount(0);
  await expect(page.locator('.card-spot')).toHaveCount(0);
});

test('projetos: tilt segue o ponteiro e some na pausa', async ({ page }) => {
  await page.goto('./');
  const card = page.locator('[data-project="routes"]');
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .2);
  await expect.poll(() => card.evaluate(el => el.style.transform)).toContain('rotateY');
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  expect(await card.evaluate(el => el.style.transform)).toBe('');
});

test('projetos: filtro com FLIP termina no estado final e respeita a pausa', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Automação', exact: true }).click();
  await expect(page.locator('#filter-count')).toHaveText('3 projetos');
  await expect(page.getByRole('heading', { name: 'Route Coverage Map', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running' && !(a instanceof CSSAnimation) && !(a instanceof CSSTransition)).length)).toBe(0);
  for (const card of await page.locator('.project-card').all()) await expect(card).toHaveCSS('opacity', '1');
});

test('projetos: estudo de caso mostra o fluxo em etapas', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Explorar caso: Integração de OS com CRM' }).click();
  const flow = page.getByRole('dialog').getByRole('list', { name: 'Fluxo do projeto' });
  await expect(flow.getByRole('listitem')).toHaveCount(4);
  await expect(page.getByRole('dialog')).toContainText('Sincronização a cada 5 minutos.');
  await expect(flow.getByRole('listitem').last()).toHaveCSS('opacity', '1');
});

test('projetos: diálogo com movimento ligado não tem violações axe', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Explorar caso: Validador de O.S. com IA' }).click();
  await page.waitForTimeout(1200);
  const results = await new AxeBuilder({ page }).include('dialog').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations.map(v => v.id)).toEqual([]);
});

test('competências: mesmo bloco do README, em texto e sem itens removidos', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/jvfaraco-portifolio/');
  const section = page.locator('#habilidades');
  await expect(section.getByRole('heading', { level: 2 })).toHaveText('Competências');
  await expect(section.locator('.competencia')).toHaveCount(7);
  await expect(section).toContainText('pandas, SQL/SQLite, pipelines (ETL) e Power BI.');
  await expect(section).toContainText('Copilot Studio, Azure OpenAI, OCR e JSON Schema, com decisão final humana.');
  for (const removed of ['Flask', 'Playwright', 'Linux', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'RAG', 'Portal'])
    await expect(section).not.toContainText(removed);
  await expect(page.locator('#experiencia')).not.toContainText('portal interno');
  await context.close();
});

test('competências: entrada escalonada curta', async ({ page }) => {
  await page.goto('./');
  const delays = await page.locator('.competencia').evaluateAll(els => els.map(el => getComputedStyle(el).transitionDelay));
  expect(delays[0]).toContain('0s'); expect(delays[6]).toContain('0.24s');
});

test('experiência: a linha se desenha com o scroll e some na pausa', async ({ page }) => {
  await page.goto('./');
  const rail = page.locator('.timeline-rail');
  await expect(rail).toHaveCount(1);
  expect(await rail.evaluate(el => parseFloat(el.style.transform.slice(7)))).toBe(0);
  await page.locator('.timeline').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY));
  await expect.poll(() => rail.evaluate(el => parseFloat(el.style.transform.slice(7)))).toBeGreaterThan(0.2);
  await expect.poll(() => page.locator('.timeline-item.passed').count()).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  await expect(rail).toHaveCount(0);
  await expect(page.locator('.timeline-item.passed')).toHaveCount(0);
});

test('contato: CTA leva ao e-mail e funciona sem JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/jvfaraco-portifolio/');
  const cta = page.getByRole('link', { name: 'Mandar e-mail' });
  await expect(cta).toBeVisible(); await expect(cta).toHaveCSS('opacity', '1');
  await expect(cta).toHaveAttribute('href', 'mailto:joaovictorfaraco@gmail.com');
  await expect(page.locator('#contact')).toContainText('O caminho mais rápido é o e-mail.');
  await context.close();
});

test('contato: copiar mostra confirmação no botão e mantém o aviso', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');
  const copy = page.getByRole('button', { name: 'Copiar e-mail' });
  await copy.click();
  await expect(page.locator('#feedback')).toHaveText('E-mail copiado.');
  await expect(page.locator('#copy-email')).toHaveText('Copiado ✓');
  await expect(page.locator('#copy-email')).toHaveText('Copiar e-mail', { timeout: 4000 });
});

test('contato: com pausa o CTA fica visível e sem animação', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  await page.locator('.contact-cta').scrollIntoViewIfNeeded();
  await expect(page.locator('.contact-cta')).toHaveCSS('opacity', '1');
  await expect(page.locator('.contact-cta')).toHaveCSS('animation-name', 'none');
});
