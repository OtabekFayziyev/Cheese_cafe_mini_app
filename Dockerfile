# ====================================
# Stage 1: Frontend Build
# ====================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ====================================
# Stage 2: Backend Build
# ====================================
FROM node:20-alpine AS backend-builder

# Install OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app/backend

# Copy backend files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy backend source
COPY backend/ ./

# Build backend
RUN npm run build

# ====================================
# Stage 3: Production
# ====================================
FROM node:20-alpine

# Install OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose port
EXPOSE 8080

# Start command
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
