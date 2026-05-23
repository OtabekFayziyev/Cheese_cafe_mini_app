import { config } from 'dotenv';
config();

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000'),
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET!,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN!,
  TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME!,
  TELEGRAM_WEBAPP_URL: process.env.TELEGRAM_WEBAPP_URL!,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  ADMIN_TELEGRAM_IDS: (process.env.ADMIN_TELEGRAM_IDS || '').split(',').filter(Boolean),
};
