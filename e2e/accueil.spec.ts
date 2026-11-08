import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
// Module ES lu par Playwright : l'attribut est exigé pour un fichier JSON
import donnees from '../projet.json' with { type: 'json' };

const REGLES_WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('accueil du squelette', () => {
  test('aux couleurs du client, accessible en clair et en sombre', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(donnees.nom);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(donnees.nom);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      const resultats = await new AxeBuilder({ page }).withTags(REGLES_WCAG).analyze();
      expect(resultats.violations.map((v) => `${theme} — ${v.id} : ${v.help}`)).toEqual([]);
    }
  });

  test('le lien d’évitement mène au contenu, au clavier', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const lien = page.getByRole('link', { name: 'Aller au contenu' });
    await expect(lien).toBeFocused();
    await expect(lien).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#contenu$/);
  });

  test('politique de sécurité : nonce neuf à chaque visite, aucune violation, en-têtes du socle', async ({
    page,
  }) => {
    const violations: string[] = [];
    page.on('console', (message) => {
      if (/Content Security Policy|Refused to/i.test(message.text()))
        violations.push(message.text());
    });
    const premiere = await page.goto('/');
    const politique = premiere?.headers()['content-security-policy'] ?? '';
    expect(politique).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
    expect(politique).not.toContain('unsafe');
    expect(premiere?.headers()['x-frame-options']).toBe('DENY');
    expect(premiere?.headers()['x-content-type-options']).toBe('nosniff');
    // La page fonctionne sous la politique : les couleurs du client sont bien appliquées
    const accent = await page
      .locator('html')
      .evaluate((html) => getComputedStyle(html).getPropertyValue('--accent-clair').trim());
    expect(accent).toBe(donnees.apparence.clair.accent);
    const seconde = await page.goto('/');
    expect(seconde?.headers()['content-security-policy']).not.toBe(politique);
    expect(violations).toEqual([]);
  });

  test('la sonde de santé répond', async ({ request }) => {
    const reponse = await request.get('/sante');
    expect(reponse.status()).toBe(200);
    expect(await reponse.json()).toEqual({ statut: 'ok' });
  });
});
