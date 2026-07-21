# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
RUN npx prisma generate
RUN npm run build

# Runtime stage keeps the full node_modules (including the Prisma CLI and tsx) rather than
# pruning to production-only deps: the container's entrypoint runs `prisma migrate deploy`
# and the seed script (`npm run prisma:seed`) is invoked against this same image via
# `docker compose exec`. Splitting those tools into a separate image would add moving
# parts without a real benefit at this project's scale.
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
