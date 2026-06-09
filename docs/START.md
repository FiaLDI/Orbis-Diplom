# Orbis-Diplom Startup Guide

This document describes the actual startup paths used by the repository.

## Services

| Service | Path | Dev port | Production container |
| --- | --- | ---: | --- |
| Frontend | `apps/frontend` | `5173` | `orbis_frontend` |
| Backend API + Socket.IO | `apps/backend` | `4000` | `orbis_backend` |
| CDN/upload service | `apps/cdn` | `4005` | `orbis_cdn` |
| PostgreSQL | Docker | `5432` | `orbis_db_container` |
| Redis | Docker | `6379` | `orbis_redis_container` |
| Nginx reverse proxy | `nginx/nginx.conf` | `443` | `orbis_nginx` |

## Environment Files

The repository now contains startup env files:

- root `.env.dev` and `.env.prod`;
- `apps/backend/.env.dev` and `apps/backend/.env.prod`;
- `apps/frontend/.env.dev` and `apps/frontend/.env.prod`;
- `apps/cdn/.env.dev` and `apps/cdn/.env.prod`.

Production files contain local/default secrets such as `change-me-prod-*`. Replace them before deploying outside local development.

## Development Startup

Start PostgreSQL and Redis:

```bash
cd /home/fiald/Projects/Orbis-Diplom
docker compose -f apps/backend/docker/docker-compose.yml up -d
```

Install dependencies:

```bash
cd apps/backend
npm install
npm run prisma:generate
```

Run migrations and seed data:

```bash
cd apps/backend
DOTENV_CONFIG_PATH=.env.dev npx prisma migrate deploy
DOTENV_CONFIG_PATH=.env.dev npx ts-node -r dotenv/config prisma/seed.ts
```

Start backend:

```bash
cd apps/backend
npm run dev
```

Start CDN:

```bash
cd apps/cdn
npm install
npm run dev
```

Start frontend:

```bash
cd apps/frontend
npm install
npm run dev
```

Open:

```text
https://localhost:5173
```

Dev uses self-signed certificates, so the browser may ask you to trust the local certificate.

## Production Docker Startup

From the repository root:

```bash
docker compose --env-file .env.prod up --build -d
```

Expected containers:

- `orbis_nginx`
- `orbis_frontend`
- `orbis_backend`
- `orbis_cdn`
- `orbis_db_container`
- `orbis_redis_container`

Production compose uses `network_mode: host` because this environment cannot create Docker bridge/veth interfaces. Nginx proxies `/` to the frontend service on `127.0.0.1:5173`, `/api` and `/socket.io` to backend on `127.0.0.1:4000`, and CDN routes to `127.0.0.1:4005`. Make sure local ports `80`, `443`, `4000`, `4005`, `5173`, `5432`, and `6379` are free before starting.

Open:

```text
https://localhost
```

Useful checks:

```bash
docker ps
docker logs orbis_backend --tail 50
docker logs orbis_cdn --tail 50
docker logs orbis_nginx --tail 50
```

Stop:

```bash
docker compose down
```

Remove persisted PostgreSQL and Redis data:

```bash
docker compose down -v
```
