# AI-анализ проекта Orbis-Diplom

Дата анализа: 2026-06-09

## Краткое резюме

**Orbis-Diplom** - полнофункциональное клиент-серверное приложение для коммуникаций в реальном времени. По смыслу проект ближе всего к Discord/Slack: пользователи регистрируются, создают серверы, общаются в чатах, управляют ролями и правами, получают уведомления, добавляют друзей и работают с задачами внутри серверов.

Проект уже имеет серьезную доменную основу: backend разделен на модули, frontend построен по Feature-Sliced Design, есть отдельный CDN-сервис, PostgreSQL-схема покрывает пользователей, серверы, роли, чаты, сообщения, уведомления, модерацию и планирование. Основные риски сейчас связаны не с отсутствием функциональности, а с качеством промышленной доводки: типизация местами ослаблена через `any`, есть отладочные `console.log`, документация API частично расходится с реальными маршрутами, тестовое покрытие пока узкое.

## Назначение системы

Система решает задачу группового общения и управления рабочими пространствами:

- регистрация, вход, обновление токенов и выход;
- серверы с участниками, ролями, разрешениями и приглашениями;
- текстовые чаты и личные/серверные коммуникации;
- сообщения, редактирование, удаление, история и статусы прочтения;
- уведомления и real-time события через Socket.IO;
- друзья, заявки, блокировки и социальные связи;
- модерация серверов, баны, кики и аудит действий;
- планирование проектов, задач, подзадач, исполнителей и связанных чатов;
- загрузка и раздача файлов через отдельный CDN-сервис.

## Общая архитектура

Проект организован как монорепозиторий с тремя основными приложениями:

- `apps/backend` - REST API, Socket.IO, бизнес-логика, Prisma ORM.
- `apps/frontend` - React SPA на Vite с Redux Toolkit, RTK Query, i18n и TailwindCSS.
- `apps/cdn` - отдельный Express-сервис для загрузки, кеширования и раздачи файлов.

Инфраструктура описана через `docker-compose.yml`:

- `backend` на порту `4000`;
- `cdn` на порту `4005`;
- `frontend` как nginx-served build на порту `5173`;
- внешний `nginx` на `80/443`;
- PostgreSQL 15 на внешнем порту `5433`;
- Redis 7 на внешнем порту `6380`.

## Backend

Backend написан на Node.js + TypeScript. Основной HTTP слой построен на Express, real-time слой - на Socket.IO, база данных - PostgreSQL через Prisma, кэш и состояние присутствия - Redis.

### Структура backend

Ключевые области:

- `src/app.ts` - подключение middleware и REST-модулей.
- `src/server.dev.ts` - HTTPS dev-сервер с самоподписанными сертификатами.
- `src/server.prod.ts` - HTTP prod-сервер, рассчитанный на работу за nginx.
- `src/di` - Inversify-контейнер и DI-токены.
- `src/modules` - бизнес-модули.
- `src/socket` - Socket.IO namespaces, registry, middleware и типы событий.
- `src/config` - окружение, PostgreSQL/Redis connection.
- `src/middleware` - auth, role permissions, error handling.
- `prisma/schema.prisma` - доменная модель БД.

### REST-модули

Фактически подключены следующие REST-префиксы:

- `/api/auth` - аутентификация.
- `/api/chats` - управление чатами.
- `/api/friends` - друзья, заявки, блокировки.
- `/api/messages` - история и операции с сообщениями.
- `/api/notifications` - уведомления и read-state.
- `/api/users` - профиль, поиск, чаты пользователя.
- `/api/servers` - серверы, роли, планирование и модерация.

Модули backend:

- `auth` - регистрация, логин, refresh/logout, коды подтверждения.
- `users` - профили, поиск пользователей, обновление и удаление.
- `friends` - друзья, заявки, блокировка/разблокировка.
- `chat` - создание/обновление/удаление чатов, старт диалога.
- `messages` - сообщения, история, отправка, редактирование, удаление.
- `servers` - серверы, участники, чаты сервера, приглашения.
- `roles` - роли сервера и права.
- `notifications` - уведомления и прочитанность.
- `planning` - проекты, задачи, подзадачи, исполнители, issue-чаты.
- `moderation` - аудит, баны, кики, список забаненных.

### Socket.IO

Socket.IO инициализируется в `src/socket/index.ts`. Используются namespaces:

- `/chat` - события чатов и сообщений;
- `/notification` - уведомления и presence;
- `/journal` - обновления серверов, ролей, задач и состояния.

Перед подключением namespace используется `authenticateSocket`, то есть сокеты защищены JWT-аутентификацией. В `src/socket/registry.ts` есть централизованная отправка событий через `emitTo` и `emitToUser`.

Сильная сторона этого решения - единая точка регистрации namespaces и типизированная обертка для отправки событий. Слабая сторона - типы событий пока частично используют `any`, поэтому реальная compile-time гарантия ограничена.

## Frontend

Frontend написан на React 18 + TypeScript + Vite. Архитектура близка к Feature-Sliced Design:

- `app` - Redux store и глобальные хуки.
- `pages` - страницы маршрутов: Home, Auth, Communicate, Settings, Political.
- `features` - доменные фичи.
- `shared` - общие UI-компоненты, хуки, i18n, utils.
- `styles` - Tailwind/CSS конфигурация.
- `utils` - прикладные утилиты.

### Основные frontend-фичи

- `auth` - формы логина/регистрации, refresh token, auth slice.
- `chat` - список чатов, sidebar, socket hooks, модели UI.
- `messages` - ввод, история, slice сообщений.
- `server` - серверы, роли, участники, настройки, invite links.
- `issue` - проекты, задачи, tree/cluster views, назначение исполнителей.
- `friends` - список друзей, поиск, заявки.
- `notification` - уведомления, socket listener, UI.
- `moderation` - аудит, баны, секции модерации.
- `settings` - профиль, тема, язык, аккаунт.
- `toast` - toast-система и middleware.
- `upload` - состояние загрузок.
- `user` - публичный профиль.

### State management

В `apps/frontend/src/app/store.ts` используется Redux Toolkit:

- обычные slices: `auth`, `chat`, `message`, `server`, `user`, `upload`, `notification`, `settings`, `friends`, `issue`, `toast`;
- RTK Query API: `authApi`, `messageApi`, `chatApi`, `serverApi`, `userApi`, `friendsApi`, `issueApi`, `settingsApi`, `notificationApi`, `moderationApi`;
- пользовательский `toastMiddleware`.

Архитектурно это хорошая основа: серверное состояние отделено через RTK Query, локальное UI-состояние хранится в slices и hooks/models.

## CDN-сервис

`apps/cdn/src/server.ts` реализует отдельный HTTPS Express-сервис:

- upload до 5 файлов через Multer;
- ограничение размера через `MAX_FILE_SIZE`;
- фильтрация MIME-типов;
- раздача файлов через `/cdn/:folder?/:filename`;
- кеширование файлов меньше 5 MB в Redis;
- range requests для медиа через `/media/:filename`;
- endpoint `/download` для скачивания внешнего URL;
- статическая раздача `public`.

Это правильно вынесено в отдельный сервис, потому что файловая нагрузка не смешивается с основным backend API.

## База данных

Prisma-схема описывает развитую доменную модель:

- пользователи: `users`, `user_profile`, `user_preferences`, `users_blocks`;
- социальные связи: `friend_requests`;
- серверы и права: `servers`, `user_server`, `role_server`, `role_permission`, `permission_type`, `user_server_roles`;
- модерация: `server_bans`, `audit_logs`;
- приглашения: `invites`;
- чаты и сообщения: `chats`, `server_chats`, `chat_users`, `messages`, `content`, `messages_content`;
- read-state и уведомления: `message_reads`, `notifications`;
- планирование: `project`, `issue`, `issue_status`, `project_issues`, `chat_issues`, `issue_assignee`.

Есть полезные индексы на ключевых отношениях: сообщения по `chat_id/created_at`, роли по `server_id`, участники сервера, audit logs, notifications. Это важно для real-time приложения, где списки сообщений и серверные сущности читаются часто.

## Тесты

Тесты находятся в `apps/backend/tests` и запускаются через:

```bash
cd apps/backend
npm run test:unit
```

Текущее покрытие видно по файлам:

- `chat.service.startChat.test.ts`;
- `message.service.check.test.ts`;
- `message.service.sendMessage.test.ts`;
- `planning.service.moveIssue.test.ts`;
- моки Prisma и Socket.IO.

Покрытие полезное, но пока узкое. Основные критичные зоны без видимого тестового покрытия:

- auth/login/refresh/logout;
- permissions middleware;
- roles/service behavior;
- server join/ban/kick/invite flows;
- notification read-state;
- socket authentication and namespace events;
- CDN upload restrictions and path handling.

## Сильные стороны проекта

- Хорошая доменная полнота: проект покрывает не только чат, но и роли, модерацию, планирование, уведомления и социальный слой.
- Backend разделен на модули, что упрощает сопровождение и развитие.
- Используется Prisma, поэтому схема БД типизирована и мигрируема.
- Real-time слой вынесен в отдельную socket-структуру с registry.
- Frontend следует FSD-подходу и не смешивает все компоненты в одной папке.
- RTK Query снижает ручную работу с API cache/state.
- Есть Docker-сборка всех ключевых сервисов.
- CDN вынесен отдельно, что архитектурно лучше для файловой нагрузки.
- Есть начальные unit-тесты для backend-сервисов.
- Поддержаны i18n-ресурсы для нескольких фич на русском и английском.

## Основные риски и проблемы

### 1. Документация API расходится с реальными маршрутами

В README модулей встречаются маршруты без учета фактических префиксов из `app.ts` и иногда с другим названием endpoint. Например, auth README описывает `/auth/send_code` и `/auth/verify`, а реальный модуль использует `/api/auth/send-code` и `/api/auth/verify-code`.

Последствие: frontend-разработчик или тестировщик может пользоваться неправильными URL.

Рекомендация: сгенерировать или вручную обновить API-документацию по реальным router-файлам.

### 2. Слишком много `any` на frontend и в socket-типах

В frontend hooks/components/API adapters часто используется `any`. Это особенно заметно в `server`, `issue`, `messages`, `friends`, `notification`. В socket events также есть `any`.

Последствие: TypeScript хуже ловит ошибки контрактов между backend и frontend. Для real-time событий это риск рассинхронизации payload.

Рекомендация: начать с общих DTO/types для API responses и Socket.IO events.

### 3. Debug logging в production-коде

В DI-контейнере и нескольких сервисах есть отладочные `console.log`, включая вывод информации при bind сервисов.

Последствие: шумные логи, возможная утечка технических деталей, сложнее мониторинг.

Рекомендация: заменить на logger с уровнями `debug/info/error` и выключать debug в production.

### 4. Тестовое покрытие недостаточно для масштаба домена

Есть только несколько unit-тестов backend-сервисов. Для такой системы критичны integration-тесты REST API и socket-тесты.

Последствие: изменения в ролях, правах, auth или socket-событиях могут ломать сценарии без быстрого обнаружения.

Рекомендация: покрыть auth, permissions, server membership, roles, messages and notification flow.

### 5. Часть каскадных удалений реализована вручную

В сервисах есть ручное удаление связанных сущностей через транзакции. Это контролируемо, но сложно поддерживать при расширении схемы.

Последствие: новая связь в Prisma может забыться в delete-flow и вызвать ошибку или оставить связанные записи.

Рекомендация: пересмотреть `onDelete` в Prisma там, где каскад безопасен, и оставить ручные транзакции только для бизнес-логики.

### 6. CDN endpoint `/download` принимает внешний URL

CDN скачивает внешний `url` через axios и проксирует поток.

Последствие: потенциальный SSRF-риск, если сервис доступен извне.

Рекомендация: добавить allowlist доменов, запрет private/internal IP ranges, timeout, max response size и проверку content-type.

### 7. Самоподписанные сертификаты лежат в репозитории

Для dev это допустимо, но важно явно отделять dev-certificates от production secrets.

Последствие: можно случайно распространить реальные ключи, если практика закрепится.

Рекомендация: оставить в репозитории только dev/selfsigned сертификаты и добавить явное предупреждение в README.

## Приоритетный план улучшений

1. Синхронизировать документацию REST API с реальными router-файлами.
2. Убрать debug `console.log` из DI и сервисов, ввести logger.
3. Укрепить типы DTO между backend и frontend, особенно для `server`, `issue`, `messages`, `notifications`.
4. Типизировать Socket.IO events без `any` для основных событий.
5. Расширить unit-тесты backend на auth, roles, permissions и server flows.
6. Добавить integration-тесты для REST API с тестовой БД или Prisma mock strategy.
7. Добавить socket-тесты для authentication, join room, new-message, notification.
8. Усилить безопасность CDN `/download` и upload validation.
9. Проверить Prisma relations на возможность безопасного `onDelete: Cascade`.
10. Добавить CI pipeline: lint, typecheck, unit tests, build backend/frontend.

## Итоговая оценка

Проект выглядит как рабочая дипломная платформа с большой функциональной глубиной. Архитектурные решения в целом правильные: монорепозиторий, отдельные сервисы, модульный backend, FSD frontend, Prisma, Redis, Socket.IO и Docker. Главная задача следующего этапа - не добавлять еще больше функций, а стабилизировать существующие: привести документацию к реальным маршрутам, усилить типизацию, убрать debug-код, закрыть тестами auth/permissions/server/message/socket flows и усилить безопасность файлового сервиса.

Если эти пункты выполнить, проект станет заметно ближе к production-grade уровню и будет проще защищать как дипломную работу: архитектура уже демонстрирует масштаб и понимание real-time систем, а улучшения покажут инженерную зрелость и внимание к надежности.
