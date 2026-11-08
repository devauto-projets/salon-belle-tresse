# syntax=docker/dockerfile:1
# Image de l'application (D-124) : construite par la CI du dépôt, publiée sur ghcr.io.
# Exécution « distroless » : ni shell ni gestionnaire de paquets, utilisateur sans droits.

FROM node:24-bookworm-slim@sha256:01d566e8d94d8c619591d78652babfccd3c6992a3dffa9ed5ab39e11cf6c70e9 AS construction
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    CI=1
RUN corepack enable
WORKDIR /app
# Dépendances d'abord (couche réutilisée tant que le verrou ne change pas), puis le code
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV SQUELETTE_IMAGE=1
RUN pnpm build

FROM gcr.io/distroless/nodejs24-debian12@sha256:14d42e2511532589a7c7e01a753667a74fcc96266e137e8125006b87b0c32d0a
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3200
WORKDIR /app
USER nonroot
COPY --from=construction --chown=nonroot:nonroot /app/.next/standalone /app
COPY --from=construction --chown=nonroot:nonroot /app/.next/static /app/.next/static
EXPOSE 3200
CMD ["server.js"]
