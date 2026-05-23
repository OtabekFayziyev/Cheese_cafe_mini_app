import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '8080', 10),
  
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  JWT_SECRET: process.env.JWT_SECRET!,
  
  DATABASE_URL: process.env.DATABASE_URL!,
  DATABASE_PUBLIC_URL: process.env.DATABASE_PUBLIC_URL,
  
  REDIS_URL: process.env.REDIS_URL!,
  // ✅ QOSHILGAN - Railway Redis uchun
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN!,
  TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME!,
  TELEGRAM_WEBAPP_URL: process.env.TELEGRAM_WEBAPP_URL!,
  
  ADMIN_TELEGRAM_IDS: process.env.ADMIN_TELEGRAM_IDS?.split(',').map(Number) || [],
};