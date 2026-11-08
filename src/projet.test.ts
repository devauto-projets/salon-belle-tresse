import { describe, expect, it } from 'vitest';
import donnees from '../projet.json';
import {
  classesDuProjet,
  cssDesVariables,
  lireProjet,
  PROJET,
  type Projet,
  variablesCss,
} from './projet';
import { textesAccueil } from './textes';

const valide = (): Record<string, unknown> => structuredClone(donnees);
const avec = (changement: (p: Record<string, unknown>) => void) => {
  const p = valide();
  changement(p);
  return p;
};
const apparence = (p: Record<string, unknown>) => p.apparence as Record<string, unknown>;

describe('projet.json (D-119)', () => {
  // Ces tests valent pour toute application générée : ils ne supposent pas un client précis
  it('le projet.json de cette application est valide', () => {
    expect(lireProjet(valide())).toEqual(PROJET);
    expect(PROJET.nom).toBe(donnees.nom.trim());
  });

  it('le nom est nettoyé, sur une ligne, de 2 à 80 caractères', () => {
    expect(lireProjet(avec((p) => (p.nom = '  Chez Awa  '))).nom).toBe('Chez Awa');
    expect(lireProjet(avec((p) => (p.nom = 'x'.repeat(80)))).nom).toHaveLength(80);
    for (const nom of ['x', 'x'.repeat(81), 'Deux\nlignes', 'Tab\tulation', '', 42]) {
      expect(() => lireProjet(avec((p) => (p.nom = nom)))).toThrow('« nom »');
    }
  });

  it('les couleurs sont des #RRGGBB, en clair et en sombre', () => {
    for (const couleur of ['red', '#C2185', '#C2185BB', 'url(x)', 12]) {
      expect(() =>
        lireProjet(avec((p) => ((apparence(p).clair as Record<string, unknown>).accent = couleur))),
      ).toThrow('« apparence.clair.accent » doit être une couleur #RRGGBB');
    }
    expect(() =>
      lireProjet(avec((p) => ((apparence(p).sombre as Record<string, unknown>).surAccent = 'x'))),
    ).toThrow('« apparence.sombre.surAccent »');
    expect(() => lireProjet(avec((p) => (apparence(p).clair = null)))).toThrow(
      '« apparence.clair » doit être un objet',
    );
  });

  it('police, formes et réglages : seulement les valeurs connues', () => {
    expect(() => lireProjet(avec((p) => (apparence(p).police = 'comic')))).toThrow(
      '« apparence.police » doit valoir moderne ou classique ou simple',
    );
    expect(() => lireProjet(avec((p) => (apparence(p).formes = 'ovales')))).toThrow(
      '« apparence.formes »',
    );
    for (const cle of ['modeSombre', 'compacte', 'grandsCaracteres', 'tutoiement']) {
      const mauvais = avec((p) => {
        p.apparence = { ...apparence(p), ...Object.fromEntries([[cle, 'oui']]) };
      });
      expect(() => lireProjet(mauvais)).toThrow(`« apparence.${cle} » doit être vrai ou faux`);
    }
    expect(() => lireProjet([])).toThrow('« projet » doit être un objet');
    expect(() => lireProjet(avec((p) => delete p.apparence))).toThrow('« apparence »');
  });

  it('variables CSS et classes de la page', () => {
    const exemple: Projet = {
      nom: 'Exemple',
      apparence: {
        clair: { accent: '#C2185B', surAccent: '#FFFFFF' },
        sombre: { accent: '#EC6499', surAccent: '#0D1824' },
        police: 'moderne',
        formes: 'arrondies',
        modeSombre: true,
        compacte: false,
        grandsCaracteres: false,
        tutoiement: false,
      },
    };
    expect(variablesCss(exemple)).toEqual({
      '--accent-clair': '#C2185B',
      '--sur-accent-clair': '#FFFFFF',
      '--accent-sombre': '#EC6499',
      '--sur-accent-sombre': '#0D1824',
    });
    expect(cssDesVariables(exemple)).toBe(
      ':root{--accent-clair:#C2185B;--sur-accent-clair:#FFFFFF;--accent-sombre:#EC6499;--sur-accent-sombre:#0D1824}',
    );
    expect(classesDuProjet(exemple)).toBe('police-moderne formes-arrondies');
    const tout: Projet = {
      ...exemple,
      apparence: {
        ...exemple.apparence,
        police: 'classique',
        formes: 'droites',
        compacte: true,
        grandsCaracteres: true,
      },
    };
    expect(classesDuProjet(tout)).toBe(
      'police-classique formes-droites compacte grands-caracteres',
    );
  });

  it('vouvoiement ou tutoiement, selon le choix du client', () => {
    expect(textesAccueil(false).enConstruction).toContain('Revenez bientôt');
    expect(textesAccueil(true).enConstruction).toContain('Reviens bientôt');
  });
});
