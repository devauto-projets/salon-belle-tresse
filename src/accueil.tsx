import type { Projet } from './projet';
import { textesAccueil } from './textes';

/** Accueil de l'application tant qu'aucune fonctionnalité n'est livrée. */
export function ContenuAccueil({ projet }: { projet: Projet }) {
  const textes = textesAccueil(projet.apparence.tutoiement);
  return (
    <main id="contenu" className="contenu">
      <p className="etiquette">{textes.etiquette}</p>
      <h1>{projet.nom}</h1>
      <p className="accroche">{textes.bienvenue}</p>
      <p>{textes.enConstruction}</p>
    </main>
  );
}
