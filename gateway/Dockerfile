# Dockerfile to build and host aggregator & caddy

# Build Aggregator
FROM golang:alpine AS builder

WORKDIR /app
COPY aggregator/go.mod .
RUN go mod download

COPY aggregator/ .
WORKDIR /app
RUN go build -o aggregator


# Host Caddy and Aggregator
FROM caddy:latest

## Caddy Configuration
WORKDIR /etc/caddy
COPY caddy/Caddyfile ./Caddyfile
EXPOSE 80 443

## Aggregator Copy
WORKDIR /app
COPY --from=builder /app/aggregator .

## Script
RUN echo -e "\
#!/bin/bash \n\
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile & \n\
/app/aggregator && fg \
" > entrypoint.sh

## Run Caddy and Aggregator
CMD ["sh", "entrypoint.sh"]
