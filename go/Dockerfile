# Dockerfile to build and host a simple web server
FROM golang:alpine AS builder
WORKDIR /app

COPY go.mod .
RUN go mod download

COPY . .
WORKDIR /app
RUN go build -o server
RUN echo $(ls -1 .)


# Host
FROM golang:alpine
WORKDIR /app
COPY --from=builder /app/server .
RUN echo $(ls -1 .)
EXPOSE 4225
CMD [ "./server" ]
