# ---------- Стадия сборки ----------
FROM node:20-alpine AS build
WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь фронт и билдим
COPY . .
RUN npm run build

# ---------- Стадия запуска ----------
FROM nginx:stable
WORKDIR /usr/share/nginx/html

# Копируем билд из предыдущей стадии
COPY --from=build /app/dist .

# (опционально) собственный nginx.conf, если фронт отдельно
# COPY nginx.conf /etc/nginx/conf.d/default.conf
