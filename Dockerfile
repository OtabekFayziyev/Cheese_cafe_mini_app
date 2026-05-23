# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# Production
FROM node:20-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend ./backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy frontend dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

# Run migrations and start
CMD npx prisma migrate deploy && npm start
