# LessonsCounter

Web-приложение на React Native для преподавателей, позволяющее вести учет уроков учеников.
Авторизация по Email (вебкам/подтверждение), Светлая/Темная тема (авто), MongoDB Backend.

## Структура проекта
- `/frontend` - React Native (Expo Web) приложение.
- `/backend` - Node.js (Express) сервер и MongoDB маппинг.

## Как развернуть на сервере через Portainer (с GitHub)

1. Загрузите этот репозиторий к себе на GitHub.
2. Откройте ваш **Portainer**.
3. Перейдите в раздел **Stacks** -> **Add stack**.
4. Введите имя стэка (например `lessonscounter`).
5. Выберите **Repository** (Web editor / Git Repository). Вставьте ссылку на ваш GitHub репозиторий.
6. В поле **Compose path** укажите `docker-compose.yml`.
7. **ОЧЕНЬ ВАЖНО**: В разделе **Environment variables** в Portainer добавьте следующие переменные, чтобы переопределить настройки отправки почты и JWT, или отредактируйте их прямо в файле `docker-compose.yml`:
   - `JWT_SECRET` = (придумайте сложный ключ)
   - `EMAIL_USER` = (ваша почта, например gmail)
   - `EMAIL_PASS` = (App Password вашей почты, *не пароль от аккаунта*)
   - `FRONTEND_URL` = (ваш домен, где будет висеть сайт, например http://lessons.my-domain.com. Это нужно для ссылок в письмах).
8. Нажмите **Deploy the stack**.

Portainer автоматически:
- Скачает MongoDB.
- Соберет Node.js Backend образ.
- Соберет статику React Native Web через Expo и упакует ее в Nginx.
- Поднимет все 3 контейнера и свяжет их между собой.

Frontend (Nginx) будет доступен по порту `80`.
Backend API - порт `5000`.

## Локальный запуск (Без Docker)
1. Установите MongoDB локально или используйте Atlas.
2. В папке `/backend` создайте файл `.env`.
3. Установите зависимости: `cd backend && npm install`.
4. Запустите бэкенд: `npm run dev`.
5. В отдельном терминале зайдите во frontend: `cd frontend`.
6. Установите зависимости `npm install`.
7. Запустите: `npm run web`.

*(c) LessonsCounter*
