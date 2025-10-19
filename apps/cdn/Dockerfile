FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

# Копируем весь код
COPY . .

# Создаём папку под загрузки (если её нет)
RUN mkdir -p /app/public/uploads

# Открываем порт CDN
EXPOSE 4005

# Запускаем
CMD ["npm", "run", "start"]
