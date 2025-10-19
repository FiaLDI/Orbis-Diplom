FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

# Копируем проект
COPY . .

# Открываем порт
EXPOSE 4000

# Добавляем миграции при старте
CMD npx prisma generate && npx prisma migrate deploy && npm run start && npx ts-node ./prisma/seed.ts
