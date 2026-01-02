# Nexo Backend (NestJS)

Backend for the Nexo social network. Built with NestJS and Prisma, it provides
JWT auth, profiles, posts, subscriptions, and real-time messaging.

## Highlights

- Modular architecture (NestJS + DI)
- PostgreSQL + Prisma ORM
- JWT access/refresh tokens
- HttpOnly cookie for refresh token
- WebSocket (Socket.IO) for chats
- Swagger API docs with custom theme
- DTO validation and global response/exception handlers

## Tech Stack

- NestJS 11
- TypeScript
- Prisma 6
- PostgreSQL
- Socket.IO
- Swagger
- Jest

## Domain Modules

Located in `src/modules`:

- `auth` — register, login, refresh, logout
- `token` — refresh token persistence
- `user` — users and credentials
- `profile` — user profile and avatar
- `post` — posts, likes, comments, files
- `subscription` — following/followers
- `message` — direct messages (REST + WebSocket)
- `conversation` — dialogs between users
- `upload` / `file` / `cloudinary` — uploads and storage

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment file:

   ```bash
   copy .env.example .env
   ```

3. Fill in `.env` and start PostgreSQL.

4. Run migrations:

   ```bash
   npm run prisma:migrate
   ```

5. Start dev server:

   ```bash
   npm run dev
   ```

Server runs at `http://localhost:3000` (or `PORT` from `.env`).

## API Documentation

Swagger UI:

- `http://localhost:3000/api`
- JSON schema: `http://localhost:3000/swagger.json`
- YAML schema: `http://localhost:3000/swagger.yaml`

Global HTTP prefix: `/api`.

## WebSocket (Messages)

Namespace: `/messages`

Auth requires an access token:

- pass via `auth.token` during handshake, or
- send `Authorization: Bearer <token>` header

Events:

- Client → server: `message:send`
- Server → client: `message:new` (receiver), `message:sent` (sender)

## Environment Variables

All keys are in `.env.example`. Core ones:

| Variable                | Description                         |
| ----------------------- | ----------------------------------- |
| `DATABASE_URL`          | main Prisma DB URL                  |
| `DATABASE_URL_UNPOOLED` | directUrl (e.g. for migrations)     |
| `NODE_ENV`              | `development` / `production`        |
| `PORT`                  | server port                         |
| `API_URL`               | API base URL (if needed by clients) |
| `FRONT_URL`             | frontend domain for CORS/cookies    |
| `JWT_REFRESH_SECRET`    | refresh token secret                |
| `JWT_ACCESS_SECRET`     | access token secret                 |
| `JWT_REFRESH_TOKEN_TTL` | refresh TTL (e.g. `7d`)             |
| `JWT_ACCESS_TOKEN_TTL`  | access TTL (e.g. `15m`)             |
| `SMTP_USER`             | SMTP username                       |
| `SMTP_PASSWORD`         | SMTP password                       |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name               |
| `CLOUDINARY_API_KEY`    | Cloudinary key                      |
| `CLOUDINARY_API_SECRET` | Cloudinary secret                   |

## Database and Prisma

Common commands:

```bash
# generate client
npm run prisma:generate

# migrations
npm run prisma:migrate

# push without migrations
npm run prisma:push

# Prisma Studio
npm run prisma:studio

# seeds
npm run prisma:seed
```

Models live in `prisma/schema.prisma`.

## Project Scripts

```bash
# run
npm run dev
npm run start
npm run prod

# build
npm run build

# quality
npm run lint
npm run format
npm run typecheck

# tests
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## Architecture Notes

`src` structure:

- `app` — root module
- `common` — filters, interceptors, adapters, utils
- `modules` — business modules
- `prisma` — database module
- `main.ts` — entry point, CORS, pipes, Swagger

Globally enabled:

- `ValidationPipe` (whitelist + transform)
- `ClassSerializerInterceptor`
- global `ResponseInterceptor`
- global `AllExceptionsFilter`

## Authentication Flow

- Access token: `Authorization: Bearer <token>`
- Refresh token: `httpOnly` cookie `refreshToken`
- Refresh endpoint: `POST /api/auth/refresh`

## Deployment

Basic flow:

```bash
npm run build
npm run prod
```

Make sure `NODE_ENV`, `PORT`, `DATABASE_URL`, and JWT secrets are set.
