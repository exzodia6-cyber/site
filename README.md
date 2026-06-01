# ОГЭ/ЕГЭ Помощник

MVP русскоязычной образовательной платформы для системной подготовки к ОГЭ и ЕГЭ: предметы, темы, задания с объяснениями, тренировочные тесты, личный прогресс, слабые темы, demo-login и простая админ-панель.

## Стек

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database/ORM: PostgreSQL + Prisma
- Auth: JWT
- Tests: встроенные smoke/unit/integration/load/mutation scripts без внешних зависимостей; в исходниках также подготовлены Vitest/Stryker-конфиги для production-подключения
- Runtime: Docker Compose

## Структура

```text
/apps/frontend  React UI
/apps/backend   Express API
/prisma         Prisma schema и seed
docker-compose.yml
package.json
```

## Быстрый запуск

```bash
npm install
npm run build --workspace apps/frontend
npm run build --workspace apps/backend
npm run dev --workspace apps/frontend
npm run dev --workspace apps/backend
```

Frontend доступен на `http://localhost:5173`, backend — на `http://localhost:4000`.

## Docker Compose

```bash
docker compose up --build
```

После сборки на порту `5173` доступны главная страница, список предметов, темы, задания, тест, кабинет, demo-login и прогресс. PostgreSQL поднимается как сервис `db`.

## Demo-доступы

- Ученик: `demo@example.ru` / `demo1234`
- Админ: `admin@example.ru` / `admin1234`

Если backend недоступен, frontend автоматически включает demo-login mode: пользователь и прогресс сохраняются в `localStorage`.

## API

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /me`
- Subjects: `GET /subjects`, `GET /subjects/:id`
- Topics: `GET /subjects/:id/topics`, `GET /topics/:id/tasks`
- Tasks: `GET /tasks/:id`, `POST /tasks/:id/answer`
- Tests: `POST /tests/start`, `POST /tests/:id/answer`, `POST /tests/:id/finish`, `GET /tests/history`
- Progress: `GET /progress`, `GET /progress/subjects/:id`
- Admin: `POST /admin/subjects`, `POST /admin/topics`, `POST /admin/tasks`, `PUT /admin/tasks/:id`, `GET /admin/users`, `GET /admin/stats`

## Seed-данные

`prisma/seed.ts` создаёт demo/admin пользователей, 10 предметов, 47 тем и 141 демонстрационное задание на русском языке. Это больше минимальных требований: 6 предметов, 20 тем и 60 заданий.

```bash
DATABASE_URL="postgresql://oge:oge@localhost:5432/oge_ege?schema=public" npm run prisma:seed
```

## Проверки качества

```bash
npm run test --workspaces
npm run test:coverage --workspaces
npm run test:load --workspace apps/backend
npm run test:mutation --workspace apps/backend
npm run test:mutation --workspace apps/frontend
```

- Unit/integration: workspace scripts проверяют ключевые frontend-сценарии и backend API flow.
- Coverage: scripts пишут `coverage-summary.json` для frontend/backend и печатают проценты покрытия.
- Load: `npm run test:load --workspace apps/backend` выполняет 50 параллельных запросов к `/subjects`.
- Mutation: mutation smoke scripts проверяют устойчивость логики прогресса и ответов; Stryker-конфиги оставлены в workspaces для подключения полноценного mutation runner после установки npm-зависимостей.

## Патчноуты

### 0.1.0

- Создан монорепозиторий с frontend/backend workspaces.
- Добавлен современный адаптивный интерфейс: главная, предметы, темы, задания, тест, кабинет, админка.
- Реализован JWT auth и demo fallback через localStorage.
- Добавлены Prisma schema, seed, Docker Compose и документация запуска.
- Добавлены unit, integration, coverage, load и mutation scripts.
