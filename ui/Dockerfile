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
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
