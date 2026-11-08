// Ce qui personnalise l'application : écrit par devAuto dans projet.json à la création du projet
// (nom, couleurs déjà vérifiées pour le contraste, style choisi dans le formulaire de démarrage).
// Ce sont des données, jamais du code : elles sont vérifiées ici, et l'application refuse de se
// construire si le fichier est mal formé.

import donnees from '../projet.json';

export const POLICES = ['moderne', 'classique', 'simple'] as const;
export const FORMES = ['arrondies', 'droites'] as const;

export interface CouleursDuTheme {
  /** Couleur d'action (boutons, liens, focus), lisible sur les fonds du thème */
  accent: string;
  /** Texte posé sur la couleur d'action */
  surAccent: string;
}

export interface Projet {
  nom: string;
  apparence: {
    clair: CouleursDuTheme;
    sombre: CouleursDuTheme;
    police: (typeof POLICES)[number];
    formes: (typeof FORMES)[number];
    /** Suit le réglage clair ou sombre de l'appareil */
    modeSombre: boolean;
    compacte: boolean;
    grandsCaracteres: boolean;
    tutoiement: boolean;
  };
}

export const LONGUEUR_NOM = { min: 2, max: 80 } as const;

const COULEUR = /^#[0-9A-Fa-f]{6}$/;

const objet = (valeur: unknown, champ: string): Record<string, unknown> => {
  if (typeof valeur !== 'object' || valeur === null || Array.isArray(valeur)) {
    throw new Error(`projet.json : « ${champ} » doit être un objet`);
  }
  return valeur as Record<string, unknown>;
};

function couleurs(valeur: unknown, champ: string): CouleursDuTheme {
  const v = objet(valeur, champ);
  const lire = (couleur: unknown, cle: string): string => {
    if (typeof couleur !== 'string' || !COULEUR.test(couleur)) {
      throw new Error(`projet.json : « ${champ}.${cle} » doit être une couleur #RRGGBB`);
    }
    return couleur;
  };
  return { accent: lire(v.accent, 'accent'), surAccent: lire(v.surAccent, 'surAccent') };
}

function parmi<T extends string>(valeur: unknown, permises: readonly T[], champ: string): T {
  const trouvee = permises.find((p) => p === valeur);
  if (trouvee === undefined) {
    throw new Error(`projet.json : « ${champ} » doit valoir ${permises.join(' ou ')}`);
  }
  return trouvee;
}

function booleen(valeur: unknown, champ: string): boolean {
  if (typeof valeur !== 'boolean')
    throw new Error(`projet.json : « ${champ} » doit être vrai ou faux`);
  return valeur;
}

/** Vérifie projet.json ; lève une erreur qui dit quel champ ne va pas. */
export function lireProjet(valeur: unknown): Projet {
  const v = objet(valeur, 'projet');
  const nom = typeof v.nom === 'string' ? v.nom.trim() : '';
  // Pas de caractère de contrôle (retour à la ligne, tabulation…) dans un nom affiché partout
  let controle = false;
  for (let i = 0; i < nom.length; i++) {
    const code = nom.charCodeAt(i);
    if (code < 32 || code === 127) controle = true;
  }
  if (nom.length < LONGUEUR_NOM.min || nom.length > LONGUEUR_NOM.max || controle) {
    throw new Error(
      `projet.json : « nom » doit faire de ${String(LONGUEUR_NOM.min)} à ${String(LONGUEUR_NOM.max)} caractères, sur une ligne`,
    );
  }
  const a = objet(v.apparence, 'apparence');
  return {
    nom,
    apparence: {
      clair: couleurs(a.clair, 'apparence.clair'),
      sombre: couleurs(a.sombre, 'apparence.sombre'),
      police: parmi(a.police, POLICES, 'apparence.police'),
      formes: parmi(a.formes, FORMES, 'apparence.formes'),
      modeSombre: booleen(a.modeSombre, 'apparence.modeSombre'),
      compacte: booleen(a.compacte, 'apparence.compacte'),
      grandsCaracteres: booleen(a.grandsCaracteres, 'apparence.grandsCaracteres'),
      tutoiement: booleen(a.tutoiement, 'apparence.tutoiement'),
    },
  };
}

/** Le projet de cette application (vérifié au chargement, donc à la construction). */
export const PROJET: Projet = lireProjet(donnees);

/** Variables CSS de la couleur d'action, posées sur la page (la feuille de style choisit le thème). */
export function variablesCss(projet: Projet): Record<string, string> {
  const { clair, sombre } = projet.apparence;
  return {
    '--accent-clair': clair.accent,
    '--sur-accent-clair': clair.surAccent,
    '--accent-sombre': sombre.accent,
    '--sur-accent-sombre': sombre.surAccent,
  };
}

/** Les mêmes variables en feuille de style (`:root`), posée avec le nonce de la requête. */
export function cssDesVariables(projet: Projet): string {
  const declarations = Object.entries(variablesCss(projet)).map(
    ([nom, valeur]) => `${nom}:${valeur}`,
  );
  return `:root{${declarations.join(';')}}`;
}

/** Classes de la page : police, formes, densité, taille du texte. */
export function classesDuProjet(projet: Projet): string {
  const a = projet.apparence;
  return [
    `police-${a.police}`,
    `formes-${a.formes}`,
    a.compacte ? 'compacte' : '',
    a.grandsCaracteres ? 'grands-caracteres' : '',
  ]
    .filter((c) => c !== '')
    .join(' ');
}
