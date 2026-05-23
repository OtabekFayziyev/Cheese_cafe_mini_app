import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { CONFIG } from './config/env.js';
import { prisma } from './config/database.js';
import { redis } from './config/redis.js';
import { bot } from './bot/index.js';
import { setupWebSocket } from './websocket/index.js';
import { authRoutes } from './modules/auth/routes.js';
import { menuRoutes } from './modules/menu/routes.js';
import { orderRoutes } from './modules/order/routes.js';
import { userRoutes } from './modules/user/routes.js';
import { courierRoutes } from './modules/courier/routes.js';
import { adminRoutes } from './modules/admin/routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = Fastify({ logger: true });

app.register(cors, { origin: CONFIG.CORS_ORIGIN, credentials: true });
app.register(jwt, { secret: CONFIG.JWT_SECRET });

// Serve frontend static files
const frontendDistPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../public')
  : path.join(__dirname, '../../frontend/dist');
  
app.register(fastifyStatic, {
  root: frontendDistPath,
  prefix: '/',
});

app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

const httpServer = createServer(app.server);
const io = setupWebSocket(httpServer);

app.addHook('onClose', async () => {
  await prisma.$disconnect();
  await redis.quit();
  bot.stop();
});

app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

app.register(authRoutes, { prefix: '/api' });
app.register(menuRoutes, { prefix: '/api' });
app.register(async (instance) => {
  await orderRoutes(instance, io);
}, { prefix: '/api' });
app.register(userRoutes, { prefix: '/api' });
app.register(async (instance) => {
  await courierRoutes(instance, io);
}, { prefix: '/api' });
app.register(adminRoutes, { prefix: '/api' });

// Fallback to index.html for client-side routing
app.setNotFoundHandler((request, reply) => {
  if (request.url.startsWith('/api')) {
    reply.code(404).send({ error: 'Not found' });
  } else {
    reply.sendFile('index.html');
  }
});

const start = async () => {
  try {
    await app.ready();
    await httpServer.listen({ port: CONFIG.PORT, host: '0.0.0.0' });
    
    bot.start({ drop_pending_updates: true });
    
    console.log(`🚀 Server running on http://localhost:${CONFIG.PORT}`);
    console.log(`🤖 Bot started: @${CONFIG.TELEGRAM_BOT_USERNAME}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
