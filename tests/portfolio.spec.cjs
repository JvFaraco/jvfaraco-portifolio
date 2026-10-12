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

test('demonstração diferencia evidência completa, ausente e fora de escopo', async ({ page }) => {
  await page.goto('./');
  const scenario = page.getByLabel('Cenário da demonstração');
  await scenario.selectOption('complete', { timeout: 2000 });
  await expect(page.locator('#scenario-result')).toContainText('Pronto para conferência humana');
  await scenario.selectOption('missing');
  await expect(page.locator('#scenario-result')).toContainText('Evidência insuficiente');
  await scenario.selectOption('outside');
  await expect(page.locator('#scenario-result')).toContainText('Fora do escopo');
  await page.getByRole('button', { name: 'Etapa 2: Regras' }).click();
  await expect(page.locator('#stage-description')).toContainText('escopo');
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
  await expect(page.getByRole('heading', { name: /Automação que conecta/ })).toBeVisible();
  await expect(page.locator('.reveal').first()).toHaveCSS('opacity', '1');
});

test('mobile permite navegar sem overflow e fecha menu com Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./');
  const menu = page.getByRole('button', { name: 'Abrir navegação' });
  await menu.click({ timeout: 2000 });
  await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
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
  await expect(page.locator('#scenario-result')).toContainText('Pronto para conferência humana');
  expect(errors).toEqual([]); expect(failed).toEqual([]);
  expect(await page.locator('img').evaluateAll(images => images.every(i => i.complete && i.naturalWidth > 0))).toBeTruthy();
});
