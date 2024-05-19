# Build
FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Host
FROM node:alpine
RUN npm install -g serve
EXPOSE 4200
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["serve", "-s", ".", "-l", "4200"]
