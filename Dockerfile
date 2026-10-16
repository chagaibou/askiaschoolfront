# =========================================================
# Dockerfile — FRONT Next.js (askiaschoolfront)
# Multi-stage : deps -> builder -> runner (image finale légère).
# Nécessite "output: 'standalone'" dans next.config.ts
# =========================================================

# ---- Stage 1 : installation des dépendances ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./

# --include=dev : on garde les devDependencies (TypeScript, types...)
# car le BUILD Next.js en a besoin pour compiler le .tsx.
RUN npm ci --include=dev


# ---- Stage 2 : build de l'application ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# La variable NEXT_PUBLIC_API_URL est "gravée" au build :
# Coolify doit la fournir en BUILD variable.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build


# ---- Stage 3 : image finale d'exécution ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# curl est nécessaire pour le healthcheck de Coolify
RUN apk add --no-cache curl

# Utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# On copie uniquement le nécessaire (grâce au mode standalone)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]