// Politique de sécurité du contenu (CSP, socle de sécurité D-031, D-121) : le navigateur n'exécute
// que les scripts de l'application, marqués d'un nonce (valeur imprévisible, neuve à chaque
// requête). Un script injecté (par exemple dans un texte saisi par un utilisateur) ne s'exécute pas.
// Guide suivi : node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md

/** Nonce de 128 bits, en base64 (neuf à chaque requête). */
export function nouveauNonce(): string {
  const octets = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...octets));
}

/**
 * La politique pour une requête. En développement seulement, React a besoin de `eval` pour ses
 * messages d'erreur détaillés, et le rechargement à chaud injecte des styles.
 */
export function politiqueDeSecurite(nonce: string, developpement: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${developpement ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' ${developpement ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}
