FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p /app/public/uploads
EXPOSE 4005

CMD ["npm", "run", "start"]
