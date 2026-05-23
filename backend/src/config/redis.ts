import Redis from 'ioredis';
import { CONFIG } from './env.js';
 
// Railway provides REDIS_URL, local dev uses separate vars
export const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    })
  : new Redis({
      host: CONFIG.REDIS_HOST,
      port: CONFIG.REDIS_PORT,
      password: CONFIG.REDIS_PASSWORD,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
 
export const CACHE_TTL = {
  MENU: 300,
  USER: 600,
  ORDER: 60,
};