# Backend Setup Guide

## Quick Start

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://cheese_cafe:cheese_cafe_password@localhost:5432/cheese_cafe"
TELEGRAM_BOT_TOKEN=your_bot_token
JWT_SECRET=your_secret_key
```

## Database Setup

### Option 1: Docker (Recommended)
```bash
docker-compose up -d postgres redis
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Option 2: Local PostgreSQL
```bash
# Install PostgreSQL + Redis locally
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Bot Setup

1. Create bot via @BotFather
2. Get bot token
3. Set webhook or use polling (default)
4. Add token to `.env`

## API Testing

```bash
# Health check
curl http://localhost:3000/health

# Get menu
curl http://localhost:3000/api/menu/products
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Env, DB, Redis
│   ├── modules/
│   │   ├── auth/        # Telegram auth
│   │   ├── menu/        # Products CRUD
│   │   ├── order/       # Orders
│   │   ├── user/        # User profile
│   │   ├── courier/     # Courier panel
│   │   └── admin/       # Admin panel
│   ├── bot/             # Grammy.js bot
│   ├── websocket/       # Socket.io
│   └── server.ts        # Main entry
└── prisma/
    ├── schema.prisma    # Database schema
    └── seed.ts          # Initial data
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Login with Telegram WebApp
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu/categories` - All categories
- `GET /api/menu/products` - All products
- `GET /api/menu/products/:id` - Product details

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - My orders
- `GET /api/orders/:id` - Order details
- `PATCH /api/orders/:id/status` - Update status (admin/courier)

### User
- `PATCH /api/users/me` - Update profile
- `GET /api/users/me/addresses` - Get addresses
- `POST /api/users/me/addresses` - Add address
- `PATCH /api/users/me/addresses/:id` - Update address
- `DELETE /api/users/me/addresses/:id` - Delete address

### Courier
- `GET /api/courier/orders` - My deliveries
- `POST /api/courier/location` - Update location

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## WebSocket Events

Client → Server:
- `join-order` - Subscribe to order updates
- `join-courier` - Subscribe to courier updates

Server → Client:
- `order-update` - Order status changed
- `courier-location` - Courier location update

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection
- `TELEGRAM_BOT_TOKEN` - Bot token from @BotFather
- `JWT_SECRET` - Secret for JWT signing

Optional:
- `REDIS_HOST` - Redis host (default: localhost)
- `CORS_ORIGIN` - Frontend URL
- `PORT` - Server port (default: 3000)
