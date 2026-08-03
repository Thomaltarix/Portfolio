# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Vite inlines env vars at build time. This is now only a fallback baked into
# the bundle — the actual runtime value is injected into config.js by
# docker-entrypoint.sh at container startup, from the API_BASE_URL env var
# (see claude/architecture.md), so changing it doesn't require a rebuild.
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
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
