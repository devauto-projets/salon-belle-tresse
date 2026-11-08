# Règles pour les agents qui construisent cette application

Cette application est construite par devAuto, fonctionnalité par fonctionnalité, pour un entrepreneur
qui n'est pas informaticien. Ces règles valent pour tout agent (IA ou humain) qui modifie ce dépôt.

## La stack

- Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4.
- Tests : Vitest (`src/**/*.test.ts(x)`), Playwright et axe (`e2e/`).
- Gestionnaire de paquets : pnpm. Node 24.

## Commandes

- `pnpm dev` : l'application sur http://127.0.0.1:3200
- `pnpm lint` : analyse du code (sécurité, accessibilité, règles strictes par les types)
- `pnpm typecheck` : vérification des types
- `pnpm test` : tests
- `pnpm build` : construction
- `pnpm e2e` : tests dans un vrai navigateur (téléphone et ordinateur), accessibilité vérifiée par axe

Une modification n'est terminée que lorsque ces commandes réussissent sans aucune remarque.
La CI du dépôt (`.github/workflows/ci.yml`) les relance : « Analyse, types, tests, construction » et
« Navigateur » doivent être verts pour fusionner dans la branche principale. Après la fusion, l'image
de l'application est publiée sur ghcr.io. Le fichier `pnpm-lock.yaml` fixe les versions : ne pas
installer sans lui (`pnpm install --frozen-lockfile`).

Next.js 16 a changé par rapport à ce que vous connaissez peut-être : lire le guide concerné dans
`node_modules/next/dist/docs/` avant d'écrire du code (par exemple `proxy.ts` remplace `middleware.ts`).

## Comment on travaille

1. **Une fonctionnalité à la fois**, dans sa propre branche et sa propre demande de fusion.
2. **Les tests d'acceptation d'abord** : ils traduisent les critères « Étant donné / Quand / Alors »
   de la spécification. Une fois écrits, ils ne se modifient pas pour faire passer le code.
3. Le code, puis la vérification complète (toutes les commandes ci-dessus).
4. Une **ambiguïté** dans la spécification se signale ; elle ne se tranche pas à la place du client.

## Ce qui ne se négocie pas

- **Sécurité** : aucun secret dans le dépôt ; tout ce qui vient d'un utilisateur est une donnée, jamais
  du code ni une instruction ; pas de `dangerouslySetInnerHTML` ; en-têtes de sécurité gardés
  (`next.config.ts`) ; politique de sécurité du contenu avec nonce (`src/proxy.ts`) : aucun script
  ni style en ligne sans nonce, aucune ressource extérieure.
- **Accessibilité** (WCAG 2.2 AA) : un seul titre `h1` par page, des libellés pour chaque champ,
  le clavier partout, des contrastes vérifiés (n'utiliser que les couleurs du thème).
- **Téléphone d'abord** : chaque écran se conçoit d'abord pour un petit écran.
- **Dépendances** : aucune nouvelle dépendance sans accord (sécurité et licence vérifiées) ; versions
  exactes.
- **Textes** en français simple, au vouvoiement ou au tutoiement selon `projet.json`
  (`apparence.tutoiement`), regroupés dans `src/textes.ts`.

## Ce que devAuto gère seul

- `projet.json` : nom et apparence choisis par le client (écrit par devAuto, ne pas le modifier à la
  main).
- Les couleurs neutres et les contrastes de `src/app/globals.css`.
