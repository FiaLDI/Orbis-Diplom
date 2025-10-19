# REST API

| Метод         | Endpoint                                      | Назначение                                                       |
| ------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| **Projects**  |                                               |                                                                  |
| `GET`         | `/planning/servers/:serverId/projects`        | Получить список проектов сервера                                 |
| `POST`        | `/planning/servers/:serverId/projects`        | Создать проект в сервере                                         |
| **Issues**    |                                               |                                                                  |
| `GET`         | `/planning/projects/:projectId/issues`        | Получить список задач проекта                                    |
| `POST`        | `/planning/projects/:projectId/issues`        | Создать новую задачу в проекте                                   |
| `PATCH`       | `/planning/issues/:issueId`                   | Обновить задачу (название, описание, статус, дедлайн, приоритет) |
| `DELETE`      | `/planning/issues/:issueId`                   | Удалить задачу                                                   |
| **Assignees** |                                               |                                                                  |
| `POST`        | `/planning/issues/:issueId/assignees/:userId` | Назначить пользователя исполнителем задачи                       |
| `DELETE`      | `/planning/issues/:issueId/assignees/:userId` | Убрать пользователя из исполнителей                              |
| **Chats**     |                                               |                                                                  |
| `POST`        | `/planning/issues/:issueId/chats`             | Создать чат для задачи и привязать его                           |
| `GET`         | `/planning/issues/:issueId/chats`             | Получить список чатов, привязанных к задаче                      |
| **Statuses**  |                                               |                                                                  |
| `GET`         | `/planning/issues/statuses`                   | Получить справочник статусов задач                               |

