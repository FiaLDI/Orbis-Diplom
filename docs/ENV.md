# Environment Documentation

## Root

Root `.env.dev` and `.env.prod` provide shared defaults and `docker compose --env-file` values.

| Variable | Meaning |
| --- | --- |
| `NODE_ENV` | Runtime environment. |
| `FRONTEND_PORT` | Local frontend port. |
| `BACKEND_PORT` | Local/backend container port. |
| `CDN_PORT` | Local/CDN container port. |
| `POSTGRES_*` | PostgreSQL database credentials and host/port. |
| `REDIS_*` | Redis connection settings. |
| `ACCESS_TOKEN_SECRET` | JWT access token secret. |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret. |

## Backend

Files:

- `apps/backend/.env.dev`
- `apps/backend/.env.prod`

| Variable | Required | Meaning |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development` or `production`. |
| `PORT` | Yes | Backend listen port. |
| `HOST` | No | Backend listen host. |
| `FRONTENDADDRES` | Yes | CORS origin used by Express and Socket.IO. |
| `CDN_URL` | No | CDN public URL. |
| `DATABASE_URL` | Yes | Prisma PostgreSQL connection string. |
| `REDIS_HOST` | Yes | Redis host. |
| `REDIS_PORT` | Yes | Redis port. |
| `REDIS_PASSWORD` | Yes | Redis password. |
| `REDIS_TTL` | No | Redis TTL default in seconds. |
| `ACCESS_TOKEN_SECRET` | Yes | JWT access token signing secret. |
| `REFRESH_TOKEN_SECRET` | Yes | JWT refresh token signing secret. |
| `TOKEN_EXPIRES_IN` | No | Access token lifetime. |
| `REFRESH_EXPIRES_IN` | No | Refresh token lifetime. |
| `SSL_KEY_PATH` | Dev only | Dev HTTPS private key path. |
| `SSL_CERT_PATH` | Dev only | Dev HTTPS certificate path. |
| `LOG_LEVEL` | No | Intended logging level. |
| `MAX_REQUEST_SIZE` | No | Intended request size limit. |

## Frontend

Files:

- `apps/frontend/.env.dev`
- `apps/frontend/.env.prod`

Vite scripts use explicit modes:

- `npm run dev` loads `.env.dev`;
- `npm run build` loads `.env.prod`.

Only variables prefixed with `VITE_` are exposed to frontend code.

| Variable | Required | Meaning |
| --- | --- | --- |
| `VITE_MONOLITE_URL_SERVER_URL` | Yes | Backend origin. The app appends `/api` and socket namespaces. |
| `VITE_CDN_SERVICE_SERVER_URL` | Yes | CDN origin for uploads and file URLs. |
| `VITE_SOCKET_URL` | No | Reserved socket origin. Current code uses `VITE_MONOLITE_URL_SERVER_URL`. |
| `VITE_TOKEN_STORAGE_KEY` | No | Reserved token storage key. |
| `VITE_REFRESH_STORAGE_KEY` | No | Reserved refresh storage key. |
| `VITE_ALLOWED_ORIGINS` | No | Documentation/config hint. |
| `VITE_ENABLE_METRIKA` | No | Analytics toggle. |
| `VITE_YANDEX_METRIKA_ID` | No | Analytics id. |

## CDN

Files:

- `apps/cdn/.env.dev`
- `apps/cdn/.env.prod`

| Variable | Required | Meaning |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development` or `production`. |
| `PORT` | Yes | CDN listen port. |
| `HOST` | No | CDN listen host. |
| `FRONTENDADDRES` | Yes | CORS origin. |
| `REDIS_HOST` | Yes | Redis host. |
| `REDIS_PORT` | Yes | Redis port. |
| `REDIS_PASSWORD` | Yes | Redis password. |
| `REDIS_TTL` | No | Redis TTL default. |
| `SSL_KEY_PATH` | Dev only | Dev HTTPS private key path. |
| `SSL_CERT_PATH` | Dev only | Dev HTTPS certificate path. |
| `UPLOAD_DIR` | Yes | File upload directory. |
| `MAX_FILE_SIZE` | No | Maximum upload file size in bytes. |

In development, CDN starts HTTPS when `SSL_KEY_PATH` and `SSL_CERT_PATH` are present. In production, CDN starts HTTP behind nginx TLS termination.

CDN runtime layout:

- `server.ts` owns process startup and server listening.
- `app.ts` configures Express but does not create or listen on an HTTP server.
- route modules under `src/routes` own individual endpoint groups.
- service modules under `src/services` own CDN business behavior and keep routes thin.
