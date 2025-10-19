# REST API

| Метод      | Endpoint              | Описание                                             |
| ---------- | --------------------- | ---------------------------------------------------- |
| **GET**    | `/friend`             | Список друзей                                        |
| **GET**    | `/requests`           | Исходящие заявки и Входящие заявки direction= "incoming"или"outcoming"                  |
| **GET**    | `/friend/invme`       | Входящие заявки                                      |
| **POST**   | `/friend/:id/invite`  | Отправить заявку                                     |
| **POST**   | `/friend/:id/confirm` | Принять заявку                                       |
| **POST**   | `/friend/:id/reject`  | Отклонить заявку                                     |
| **DELETE** | `/friend/:id`         | Удалить пользователя из друзей                       |
| **GET**    | `/friend/:id/status`  | Проверить статус отношений (`none/pending/accepted`) |

