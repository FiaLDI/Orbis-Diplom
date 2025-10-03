# REST API

| Метод     | Endpoint                  | Описание                                     |
| --------- | ------------------------- | -------------------------------------------- |
| **GET**   | `/moderation/reports`     | список репортов                              |
| **PATCH** | `/moderation/reports/:id` | изменить статус репорта (resolved, rejected) |
| **POST**  | `/moderation/reports`     | отправить жалобу                             |
| **GET**   | `/moderation/logs`        | список действий (audit log)                  |


| Метод      | Endpoint                               | Описание              |
| ---------- | -------------------------------------- | --------------------- |
| **POST**   | `/moderation/servers/:id/ban/:userId`  | забанить пользователя |
| **DELETE** | `/moderation/servers/:id/ban/:userId`  | разбанить             |
| **DELETE** | `/moderation/servers/:id/kick/:userId` | кикнуть пользователя  |
