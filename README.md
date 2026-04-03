# NestJS To-Do API

REST API with **MongoDB**, **JWT auth**, and **task CRUD** (plus list filtering, search, sorting, pagination). **Swagger** is at `/api` when the app is running.

## NestJS vs plain Node (`http` / Express only)

| Plain Node / minimal Express | NestJS (this project) |
|-----------------------------|------------------------|
| You wire routes and middleware manually in one file or loose folders. | **Modules** group features (`AuthModule`, `TasksModule`). Clear boundaries. |
| Shared logic is imported ad hoc. | **Dependency injection**: services are **providers**, injected into controllers; easy to test and swap. |
| Validation is manual or optional. | **Global `ValidationPipe`** + **DTOs** (`class-validator`) validate bodies and queries in one place. |
| Auth checks repeated per route. | **`@UseGuards(JwtAuthGuard)`** + **`@ApiBearerAuth`** for protected routes. |
| OpenAPI docs are separate work. | **`@nestjs/swagger`** + decorators on controllers/DTOs generate docs from code. |

**Idea:** Nest gives a **structured server** (controllers → services → DB) and **built-in patterns** (guards, pipes, modules) instead of only “create server + listen” like raw Node.

## Stack

- NestJS, Mongoose, Passport JWT, bcrypt  
- Config: `.env` (see below)

## Setup

```bash
npm install
```

Create `.env` with at least:

- `PORT` — server port (e.g. `3000` or `8080`)
- `MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_URL`, `MONGODB_DB` — Atlas-style connection (see `AppModule`)
- JWT settings as in your `AuthModule` / `JwtModule` (e.g. secret and expiry)

```bash
npm run start:dev
```

- App: `http://localhost:<PORT>/`  
- **Swagger:** `http://localhost:<PORT>/api`

## API (core)

**Auth**

- `POST /auth/register` — create user (password hashed)
- `POST /auth/login` — returns JWT `access_token`
- `POST /auth/logout` — placeholder (JWT is stateless)

**Tasks** (Bearer token required)

- `GET /tasks` — list own tasks: filters (`status`, `priority`), search, sort, `page` / `limit`
- `GET /tasks/:id` — one task
- `POST /tasks` — create (title, optional description, optional `status`)
- `PATCH /tasks/:id` — update fields
- `DELETE /tasks/:id` — delete

Use Swagger **Authorize** after login to call task endpoints.

## Project layout (mental model)

```
src/
  app.module.ts     → glues Config + Mongo + feature modules
  auth/               → login, JWT strategy, guard
  users/              → user model + registration helpers
  tasks/              → task CRUD + list query DTOs + Mongoose schema
```

This mirrors **CRUD + auth** as separate domains, each with its own module, instead of a single Express file with every route.
