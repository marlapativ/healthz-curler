# Build
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY ./shared ./shared
COPY ./bun ./bun

WORKDIR /app/bun
RUN bun run link
RUN bun install
RUN bun run build

# Host
FROM oven/bun:slim
WORKDIR /app
COPY --from=builder /app/bun/dist .
EXPOSE 4205
EXPOSE 4206
CMD [ "bun", "server.js" ]
