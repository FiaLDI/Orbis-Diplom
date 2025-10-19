# REST API

| Метод    | Endpoint                | Описание                              |
| -------- | ----------------------- | ------------------------------------- |
| **POST** | `/auth/send_code`       | Отправить код (email/sms)             |
| **POST** | `/auth/verify`          | Подтвердить код                       |
| **POST** | `/auth/register`        | Регистрация                           |
| **POST** | `/auth/login`           | Вход                                  |
| **POST** | `/auth/logout`          | Выход                                 |
| **POST** | `/auth/refresh`         | Обновить токен                        |
| **GET**  | `/auth/me`              | Получить данные текущего пользователя |
| **POST** | `/auth/change-password` | Смена пароля                          |
| **POST** | `/auth/forgot-password` | Восстановление пароля                 |
| **GET**  | `/auth/protected`       | Пример защищённого роута              |
