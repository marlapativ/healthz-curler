# Build
FROM sharedjs

FROM node:alpine AS builder
WORKDIR /app

COPY --from=sharedjs package*.json shared/js/
RUN npm install --prefix shared/js
COPY --from=sharedjs . shared/js

COPY package*.json node/
RUN npm install --prefix node
COPY . node

WORKDIR /app/node
RUN npm run link
RUN npm install
RUN npm run build

# Host
FROM node:slim
WORKDIR /app
COPY --from=builder /app/node/dist .
EXPOSE 4215
EXPOSE 4216
CMD [ "node", "server" ]
