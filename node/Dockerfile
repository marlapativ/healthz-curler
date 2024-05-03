# Build
FROM node:alpine AS builder
WORKDIR /app
COPY ./shared ./shared
COPY ./node ./node

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
