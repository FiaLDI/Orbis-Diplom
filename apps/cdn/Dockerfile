FROM node:20-alpine as deps

WORKDIR /app

COPY package-lock.json package.json ./
RUN npm ci

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app/ ./
COPY . .
RUN npm run build

FROM node:20-alpine as run
WORKDIR /app
RUN mkdir -p /app/public/uploads \
    && chown -R node:node /app/public
COPY --chown=node:node --from=build /app/dist ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
USER node

EXPOSE 4005

CMD sh -c " node server.js"
