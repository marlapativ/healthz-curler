# Build
FROM sharedjs

FROM oven/bun:alpine AS builder
WORKDIR /app

COPY --from=sharedjs package*.json shared/js/
RUN bun install --cwd shared/js
COPY --from=sharedjs . shared/js

COPY package*.json bun/
WORKDIR /app/bun
RUN bun run link
RUN bun install

COPY . .
RUN bun run build

# Host
FROM oven/bun:slim
WORKDIR /app
COPY --from=builder /app/bun/dist .
EXPOSE 4205
EXPOSE 4206
CMD [ "bun", "server.js" ]
