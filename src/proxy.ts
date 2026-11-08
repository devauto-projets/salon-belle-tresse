import { type NextRequest, NextResponse } from 'next/server';
import { nouveauNonce, politiqueDeSecurite } from './securite';

// Chaque page reçoit sa politique de sécurité du contenu, avec un nonce neuf : Next.js le lit dans
// l'en-tête de la requête et l'ajoute à ses propres scripts et styles.
export function proxy(requete: NextRequest) {
  const nonce = nouveauNonce();
  const politique = politiqueDeSecurite(nonce, process.env.NODE_ENV === 'development');
  const entetes = new Headers(requete.headers);
  entetes.set('x-nonce', nonce);
  entetes.set('Content-Security-Policy', politique);
  const reponse = NextResponse.next({ request: { headers: entetes } });
  reponse.headers.set('Content-Security-Policy', politique);
  return reponse;
}

export const config = {
  matcher: [
    {
      // Pas pour les fichiers statiques, l'icône ni la sonde de santé, ni les préchargements
      source: '/((?!_next/static|_next/image|icon.svg|sante).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
