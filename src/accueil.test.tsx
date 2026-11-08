import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ContenuAccueil } from './accueil';
import { PROJET } from './projet';
import { GET } from './app/sante/route';

describe('accueil du squelette', () => {
  it('un seul titre principal, le nom du projet, dans la zone principale visée par l’évitement', () => {
    const html = renderToStaticMarkup(<ContenuAccueil projet={{ ...PROJET, nom: 'Chez Awa' }} />);
    expect(html.startsWith('<main id="contenu"')).toBe(true);
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
    expect(html).toContain('<h1>Chez Awa</h1>');
    expect(html).toContain('En construction');
  });

  it('le nom du client est affiché comme du texte, jamais interprété', () => {
    const html = renderToStaticMarkup(
      <ContenuAccueil projet={{ ...PROJET, nom: '<script>alert(1)</script> & Cie' }} />,
    );
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; Cie');
  });
});

describe('sonde de santé', () => {
  it('répond « ok », sans cache', async () => {
    const reponse = GET();
    expect(reponse.status).toBe(200);
    expect(reponse.headers.get('Cache-Control')).toBe('no-store');
    expect(await reponse.json()).toEqual({ statut: 'ok' });
  });
});
