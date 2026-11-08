import localFont from 'next/font/local';

// Polices du style « moderne », servies par l'application elle-même : aucun appel à un tiers.
// next/font ajuste la police de secours aux mêmes dimensions : le texte ne bouge pas quand la vraie
// police arrive (stabilité visuelle). Fichiers : paquets Fontsource (licence SIL OFL), jeu latin.

export const policeTitre = localFont({
  src: '../../node_modules/@fontsource-variable/sora/files/sora-latin-wght-normal.woff2',
  weight: '100 800',
  display: 'swap',
  variable: '--police-titre-web',
  fallback: ['Segoe UI', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const policeTexte = localFont({
  src: '../../node_modules/@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2',
  weight: '200 900',
  display: 'swap',
  variable: '--police-texte-web',
  fallback: ['Segoe UI', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
