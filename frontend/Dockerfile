# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Vite inlines env vars at build time. This is now only a fallback baked into
# the bundle — the actual runtime value is injected into config.js at
# container startup (see the /docker-entrypoint.d script below and
# claude/architecture.md), so changing it doesn't require a rebuild.
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Lets the deploy healthcheck confirm the live site is serving this exact build,
# instead of trusting a container restart that may have kept a stale image running.
ARG VITE_BUILD_SHA=unknown
RUN echo "$VITE_BUILD_SHA" > dist/version.txt

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Dropped into /docker-entrypoint.d/ rather than replacing the image's own
# /docker-entrypoint.sh: the official entrypoint runs every script in this
# directory before starting nginx, so its own startup behavior keeps working
# across nginx version bumps instead of being silently bypassed.
COPY docker-entrypoint.d/40-generate-runtime-config.sh /docker-entrypoint.d/40-generate-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-generate-runtime-config.sh
EXPOSE 80
