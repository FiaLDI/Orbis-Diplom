FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf