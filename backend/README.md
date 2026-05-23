# Cheese Cafe Backend

Production-ready Node.js backend with Telegram Bot integration.

## Stack

- **Framework:** Fastify
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Cache:** Redis
- **Bot:** grammy.js
- **Real-time:** Socket.io
- **Auth:** JWT + Telegram WebApp

## Setup

```bash
npm install
cp .env.example .env
# Edit .env

npx prisma generate
npx prisma migrate dev
npm run dev
```

## Docker

```bash
docker-compose up -d
```

## API Endpoints

- `POST /api/auth/login` - Telegram auth
- `GET /api/menu/products` - Get products
- `POST /api/orders` - Create order
- `GET /api/orders/my` - My orders
- `PATCH /api/orders/:id/status` - Update status

## Environment

See `.env.example`
