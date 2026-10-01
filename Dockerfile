# Bianco: build for Coolify (used by docker-compose.yaml)
FROM node:24-slim AS base
WORKDIR /app
RUN npm install -g pnpm@10 && pnpm --version
COPY . .
RUN pnpm install --frozen-lockfile

# ---- API server (Express + Postgres) ----
FROM base AS api
RUN pnpm --filter @workspace/api-server run build
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
# DB tables banao/update karo, phir server start
CMD ["sh", "-c", "pnpm --filter @workspace/db run push-force && exec node --enable-source-maps artifacts/api-server/dist/index.mjs"]

# ---- Website build (React + Vite) ----
FROM base AS web-build
RUN PORT=3000 BASE_PATH=/ NODE_ENV=production pnpm --filter @workspace/bianco-restaurant run build

# ---- Website serve (nginx) ----
FROM nginx:1.27-alpine AS web
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /app/artifacts/bianco-restaurant/dist/public /usr/share/nginx/html
EXPOSE 80
