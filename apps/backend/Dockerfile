FROM node:20-alpine as deps

WORKDIR /app

COPY package-lock.json package.json ./
RUN npm ci

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app/ ./
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine as run
WORKDIR /app
COPY --chown=node:node --from=build /app/dist/src ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/prisma ./prisma
COPY --chown=node:node --from=build /app/dist/prisma ./prisma
USER node

EXPOSE 4000

CMD sh -c "npx prisma migrate deploy && \
           node prisma/seed.js && \
           node server.prod.js"
