# Build
FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Host
FROM node:alpine
WORKDIR /app
COPY --from=builder /app/dist .
RUN npm install -g serve
EXPOSE 4200
CMD ["serve", "-s", ".", "-l", "4200"]
