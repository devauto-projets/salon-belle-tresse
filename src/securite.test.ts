import { describe, expect, it } from 'vitest';
import { nouveauNonce, politiqueDeSecurite } from './securite';

describe('politique de sécurité du contenu (D-121)', () => {
  it('un nonce neuf et imprévisible à chaque requête (128 bits en base64)', () => {
    const nonces = new Set(Array.from({ length: 50 }, () => nouveauNonce()));
    expect(nonces.size).toBe(50);
    for (const n of nonces) expect(n).toMatch(/^[A-Za-z0-9+/]{22}==$/);
  });

  it('en production : scripts et styles seulement avec le nonce, rien d’extérieur', () => {
    const politique = politiqueDeSecurite('abc', false);
    expect(politique.split('; ')).toEqual([
      "default-src 'self'",
      "script-src 'self' 'nonce-abc' 'strict-dynamic'",
      "style-src 'self' 'nonce-abc'",
      "img-src 'self' blob: data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ]);
    expect(politique).not.toContain('unsafe');
  });

  it('en développement seulement : eval pour React et styles du rechargement à chaud', () => {
    const politique = politiqueDeSecurite('abc', true);
    expect(politique).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic' 'unsafe-eval'");
    expect(politique).toContain("style-src 'self' 'unsafe-inline'");
  });
});
