import type { NextConfig } from 'next';

// En-têtes de sécurité HTTP sur toutes les pages (socle de sécurité, D-031).
const enTetesDeSecurite = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

// Image de conteneur : serveur autonome (« standalone »). Dans un monorepo (devAuto), le traçage
// des fichiers part de sa racine (SQUELETTE_RACINE_TRACAGE) ; seul, de ce dossier.
const pourImage = process.env.SQUELETTE_IMAGE === '1';
const racineTracage = process.env.SQUELETTE_RACINE_TRACAGE;

const configuration: NextConfig = {
  ...(pourImage ? { output: 'standalone' as const } : {}),
  ...(pourImage && racineTracage !== undefined ? { outputFileTracingRoot: racineTracage } : {}),
  poweredByHeader: false,
  reactStrictMode: true,
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: enTetesDeSecurite }]);
  },
};

export default configuration;
