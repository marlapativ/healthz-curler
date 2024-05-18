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
EXPOSE 2020

## Run Caddy and Aggregator
RUN ["caddy", "start", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
CMD ["/app/aggregator"]
