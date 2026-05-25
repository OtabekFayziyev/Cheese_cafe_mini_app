// import Fastify from 'fastify';
// import cors from '@fastify/cors';
// import jwt from '@fastify/jwt';
// import fastifyStatic from '@fastify/static';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { CONFIG } from './config/env.js';
// import { prisma } from './config/database.js';
// import { redis } from './config/redis.js';
// import { bot } from './bot/index.js';
// import { setupWebSocket } from './websocket/index.js';
// import { authRoutes } from './modules/auth/routes.js';
// import { menuRoutes } from './modules/menu/routes.js';
// import { orderRoutes } from './modules/order/routes.js';
// import { userRoutes } from './modules/user/routes.js';
// import { courierRoutes } from './modules/courier/routes.js';
// import { adminRoutes } from './modules/admin/routes.js';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const app = Fastify({ logger: true });

// // ✅ CORS SOZLAMALARI - ENG SODDA VA ISHONCHLI
// // const corsOrigins: (string | RegExp)[] = [
// //   CONFIG.CORS_ORIGIN || 'http://localhost:5173',
// //   'https://t.me',
// //   'https://web.telegram.org',
// //   /\.vercel\.app$/,
// //   /\.railway\.app$/,
// // ];
// const corsOrigins = '*';

// if (CONFIG.NODE_ENV === 'development') {
//   corsOrigins.push('http://localhost:5173', 'http://localhost:3000');
// }

// app.register(cors, {
//   origin: corsOrigins,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
// });

// app.register(jwt, { secret: CONFIG.JWT_SECRET });

// // Serve frontend static files
// const frontendDistPath = process.env.NODE_ENV === 'production' 
//   ? path.join(__dirname, '../public')
//   : path.join(__dirname, '../../frontend/dist');
  
// app.register(fastifyStatic, {
//   root: frontendDistPath,
//   prefix: '/',
// });

// app.decorate('authenticate', async (request: any, reply: any) => {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.code(401).send({ error: 'Unauthorized' });
//   }
// });

// const io = setupWebSocket(app.server);

// app.addHook('onClose', async () => {
//   await prisma.$disconnect();
//   await redis.quit();
//   io.close();
//   bot.stop();
// });

// // Health check endpoint
// app.get('/health', async () => ({ 
//   status: 'ok', 
//   timestamp: new Date().toISOString(),
//   env: CONFIG.NODE_ENV 
// }));

// app.register(authRoutes, { prefix: '/api' });
// app.register(menuRoutes, { prefix: '/api' });
// app.register(async (instance) => {
//   await orderRoutes(instance, io);
// }, { prefix: '/api' });
// app.register(userRoutes, { prefix: '/api' });
// app.register(async (instance) => {
//   await courierRoutes(instance, io);
// }, { prefix: '/api' });
// app.register(adminRoutes, { prefix: '/api' });

// // Fallback to index.html for client-side routing
// app.setNotFoundHandler((request, reply) => {
//   if (request.url.startsWith('/api')) {
//     reply.code(404).send({ error: 'Not found' });
//   } else {
//     reply.sendFile('index.html');
//   }
// });

// const start = async () => {
//   try {
//     await app.listen({ port: CONFIG.PORT, host: '0.0.0.0' });
    
//     bot.start({ drop_pending_updates: true }).catch((err) => {
//       console.error('❌ Bot start error (server continues running):', err.message);
//     });

//     console.log(`🚀 Server running on http://localhost:${CONFIG.PORT}`);
//     console.log(`🤖 Bot starting: @${CONFIG.TELEGRAM_BOT_USERNAME}`);
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// };

// start();


import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
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

// ✅ CORS DOMENLAR ROʻYXATI TO'G'RILANDI
let corsOrigins = [
  'https://project-2iyuk.vercel.app', // Vercel aniq manzili qo'shildi
  'https://t.me',
  'https://web.telegram.org',
  'https://telegram.org',
  /\.vercel\.app$/, // Barcha vercel subdomenlari uchun regeks
  /\.railway\.app$/, // Barcha railway subdomenlari uchun regeks
];

if (CONFIG.CORS_ORIGIN) {
  corsOrigins.push(CONFIG.CORS_ORIGIN);
}

if (CONFIG.NODE_ENV === 'development') {
  corsOrigins.push('http://localhost:5173', 'http://localhost:3000');
}

// ✅ KENGAYTIRILGAN VA ISHONCHLI CORS SOZLAMALARI
app.register(cors, {
  origin: (origin, cb) => {
    if (!origin || corsOrigins.includes(origin) || corsOrigins.some(regex => regex instanceof RegExp && regex.test(origin))) {
      cb(null, true);
      return;
    }
    console.log(`⚠️ Noma'lum CORS origin so'rovi: ${origin}`);
    cb(null, true); // Bloklash xavfini kamaytirish uchun har doim ruxsat beramiz
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin', 
    'Access-Control-Allow-Origin'
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
});

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

const io = setupWebSocket(app.server);

app.addHook('onClose', async () => {
  await prisma.$disconnect();
  await redis.quit();
  io.close();
  bot.stop();
});

// Health check endpoint
app.get('/health', async () => ({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  env: CONFIG.NODE_ENV 
}));

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

// ✅ ASOSIY PORT VA HOST XATOLIGI TUZATILDI
const start = async () => {
  try {
    // Railway taqdim etadigan portni birinchi o'ringa qo'yamiz
    const listenPort = Number(process.env.PORT) || Number(CONFIG.PORT) || 3000;
    
    // Railway tashqaridan keladigan so'rovlarni qabul qilishi uchun host '0.0.0.0' bo'lishi shart!
    await app.listen({ 
      port: listenPort, 
      host: '0.0.0.0' 
    });
    
    bot.start({ drop_pending_updates: true }).catch((err) => {
      console.error('❌ Bot start error (server continues running):', err.message);
    });

    console.log(`🚀 Server muvaffaqiyatli ishga tushdi: port ${listenPort}, host: 0.0.0.0`);
    console.log(`🤖 Bot holati: @${CONFIG.TELEGRAM_BOT_USERNAME}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
