// Textes de l'application, au vouvoiement ou au tutoiement selon le choix du client
// (formulaire de démarrage). Les fonctionnalités ajouteront les leurs ici.

export interface TextesAccueil {
  bienvenue: string;
  enConstruction: string;
  etiquette: string;
}

export function textesAccueil(tutoiement: boolean): TextesAccueil {
  return {
    bienvenue: 'Bienvenue !',
    enConstruction: tutoiement
      ? 'L’application est en cours de construction. Reviens bientôt : elle se remplit fonctionnalité par fonctionnalité.'
      : 'L’application est en cours de construction. Revenez bientôt : elle se remplit fonctionnalité par fonctionnalité.',
    etiquette: 'En construction',
  };
}
