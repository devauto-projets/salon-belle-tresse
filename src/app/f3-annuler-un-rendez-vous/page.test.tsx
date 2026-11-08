// Tests d'acceptation de F3 (écrits avant le code, D-043) : un par critère « Étant donné /
// Quand / Alors » de la spécification. Une fois écrits, ils ne se modifient pas pour faire passer le code.
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import fonctionnalite from '../../fonctionnalites/f3-annuler-un-rendez-vous.json';
import Page from './page';

/** Le texte affiché, sans balises ni entités HTML. */
function texteAffiche(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
    .replace(/\s+/g, ' ');
}

describe(`${fonctionnalite.code} : ${fonctionnalite.titre}`, () => {
  const texte = texteAffiche(renderToStaticMarkup(<Page />));

  it('présente la fonctionnalité', () => {
    expect(texte).toContain(fonctionnalite.titre);
  });

  for (const critere of fonctionnalite.criteres) {
    it(`Étant donné ${critere.etantDonne}, quand ${critere.quand}, alors ${critere.alors}`, () => {
      expect(texte).toContain(critere.alors);
    });
  }
});
