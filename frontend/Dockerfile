# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Vite inlines env vars at build time, so the API URL must be supplied as a build ARG.
# Changing it after the image is built requires a rebuild (see claude/architecture.md).
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
EXPOSE 80
