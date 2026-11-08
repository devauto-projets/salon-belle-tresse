import type { Metadata } from 'next';
import fonctionnalite from '../../fonctionnalites/f1-reserver-un-rendez-vous.json';

export const metadata: Metadata = { title: fonctionnalite.titre };

/** Fonctionnalité F1 (agent simulé, D-131) : la page la présente avec ses critères. */
export default function Page() {
  return (
    <main id="contenu" className="contenu">
      <p className="etiquette">{fonctionnalite.code}</p>
      <h1>{fonctionnalite.titre}</h1>
      <p>
        En tant que {fonctionnalite.enTantQue}, je veux {fonctionnalite.jeVeux}, afin de{' '}
        {fonctionnalite.afinDe}.
      </p>
      <h2>Comment vérifier</h2>
      <ul>
        {fonctionnalite.criteres.map((critere) => (
          <li key={`${critere.etantDonne}-${critere.quand}`}>
            Étant donné {critere.etantDonne}, quand {critere.quand}, alors {critere.alors}.
          </li>
        ))}
      </ul>
    </main>
  );
}
