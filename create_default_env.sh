#!/usr/bin/env bash

set -e

if [ -f .env ]; then
    echo ".env already exists."
    exit 0
fi

cat > .env <<'EOF'
NODE_ENV=production
HOST=0.0.0.0
FRONTEND_URL=https://localhost
CDN_URL=https://localhost/cdn
BACKEND_PORT=4000
ACCESS_TOKEN_SECRET=super_secret_key
REFRESH_TOKEN_SECRET=super_refresh_secret
TOKEN_EXPIRES_IN=24h
REFRESH_EXPIRES_IN=7d
LOG_LEVEL=info
MAX_REQUEST_SIZE=10mb
CDN_PORT=4005
UPLOAD_DIR=/app/public/uploads
MAX_FILE_SIZE=10485760
POSTGRES_DB=orbis
POSTGRES_USER=orbis
POSTGRES_PASSWORD=orbis
POSTGRES_HOST=orbis_db
POSTGRES_PORT=5432
DATABASE_URL=postgresql://orbis:orbis@orbis_db:5432/orbis
REDIS_HOST=orbis_redis
REDIS_PORT=6379
REDIS_PASSWORD=admin
REDIS_TTL=3600
VITE_APP_ENV=production
VITE_APP_NAME=Orbis-Diplom
VITE_APP_VERSION=1.0.0
VITE_MONOLITE_URL_SERVER_URL=https://localhost
VITE_CDN_SERVICE_SERVER_URL=https://localhost
VITE_SOCKET_URL=https://localhost
VITE_TOKEN_STORAGE_KEY=orbis_access_token
VITE_REFRESH_STORAGE_KEY=orbis_refresh_token
VITE_ALLOWED_ORIGINS=https://localhost
VITE_ENABLE_METRIKA=true
VITE_YANDEX_METRIKA_ID=99999999
EOF

echo ".env created."