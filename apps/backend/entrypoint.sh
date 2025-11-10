#!/bin/sh
set -e

echo "Running Prisma generate"
npx prisma generate

echo "Running Prisma migrate"
npx prisma migrate deploy

echo "Running seed"
npx ts-node ./prisma/seed.ts

echo "Starting server"
exec npm run start
