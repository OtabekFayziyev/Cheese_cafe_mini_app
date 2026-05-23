import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { verifyTelegramWebAppData } from './telegram-auth.js';

const loginSchema = z.object({
  initData: z.string(),
  phone: z.string().optional(),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', async (request, reply) => {
    const { initData, phone } = loginSchema.parse(request.body);
    
    const { valid, user: tgUser } = verifyTelegramWebAppData(initData);
    if (!valid) return reply.code(401).send({ error: 'Invalid Telegram data' });

    let user = await prisma.user.findUnique({ where: { telegramId: BigInt(tgUser.id) } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: BigInt(tgUser.id),
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
          username: tgUser.username,
          phone,
          photoUrl: tgUser.photo_url,
          language: tgUser.language_code || 'uz',
        },
      });
    } else if (phone && !user.phone) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { phone },
      });
    }

    const token = await reply.jwtSign({ userId: user.id, role: user.role });
    return { token, user };
  });

  app.get('/auth/me', { onRequest: [app.authenticate] }, async (request, reply) => {
    const user = await prisma.user.findUnique({ where: { id: request.user.userId } });
    if (!user) return reply.code(404).send({ error: 'User not found' });
    return user;
  });
}
