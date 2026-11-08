// Sonde de santé (Kubernetes, surveillance) : répond tant que le serveur tourne.
export const dynamic = 'force-dynamic';

export function GET(): Response {
  return Response.json({ statut: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
}
