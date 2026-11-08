import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { classesDuProjet, cssDesVariables, PROJET } from '../projet';
import './globals.css';
import { policeTexte, policeTitre } from './polices';

export const metadata: Metadata = {
  title: PROJET.nom,
  description: `L’application de ${PROJET.nom}.`,
};

// Couleur de la barre du navigateur sur téléphone : le fond de la page, selon le thème
export const viewport: Viewport = {
  themeColor: PROJET.apparence.modeSombre
    ? [
        { media: '(prefers-color-scheme: light)', color: '#F5F8FB' },
        { media: '(prefers-color-scheme: dark)', color: '#0D1824' },
      ]
    : '#F5F8FB',
};

export default async function Racine({ children }: Readonly<{ children: ReactNode }>) {
  // Nonce de la requête (proxy.ts) : la politique de sécurité n'accepte que les styles qui le portent
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const polices =
    PROJET.apparence.police === 'moderne' ? `${policeTitre.variable} ${policeTexte.variable}` : '';
  return (
    <html
      lang="fr"
      className={`${classesDuProjet(PROJET)} ${polices}`.trim()}
      data-sombre={PROJET.apparence.modeSombre ? 'auto' : 'jamais'}
    >
      <head>
        {/* Couleurs du client : des couleurs #RRGGBB vérifiées, jamais du texte libre */}
        <style nonce={nonce}>{cssDesVariables(PROJET)}</style>
      </head>
      <body>
        <a href="#contenu" className="lien-evitement">
          Aller au contenu
        </a>
        <header className="entete">
          <p className="marque">{PROJET.nom}</p>
        </header>
        {children}
      </body>
    </html>
  );
}
