# Dockerfile to build and host a simple web server
FROM golang:alpine AS builder
WORKDIR /app

COPY go.mod .
RUN go mod download

COPY . .
WORKDIR /app
RUN go build -o aggregator


# Host
FROM golang:alpine
WORKDIR /app
COPY --from=builder /app/aggregator .
EXPOSE 2020
CMD [ "./aggregator" ]
