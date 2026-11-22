# Build the complete pnpm workspace with the repository's supported Node version.
FROM node:24-slim AS build

WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/api-server run build \
    && pnpm --filter @workspace/hotel-chatbot run build

# Express API service. The workspace dependencies are kept in this image because
# the API bundle deliberately externalizes some packages at runtime.
FROM build AS api
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]

# Static React app served by nginx. API requests are reverse-proxied to the API
# container so the browser uses the same origin for chat, cookies, and Clerk.
FROM nginx:1.27-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/30-runtime-config.sh /docker-entrypoint.d/30-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/30-runtime-config.sh
COPY --from=build /app/artifacts/hotel-chatbot/dist/public/ /usr/share/nginx/html/
EXPOSE 80
