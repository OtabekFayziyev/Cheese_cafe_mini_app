import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../config/database.js';

const updateProfileSchema = z.object({
  phone: z.string().optional(),
  phoneSecondary: z.string().optional(),
  language: z.string().optional(),
});

const addressSchema = z.object({
  fullAddress: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  apartment: z.string().optional(),
  entrance: z.string().optional(),
  floor: z.string().optional(),
  intercom: z.string().optional(),
  comment: z.string().optional(),
});

export async function userRoutes(app: FastifyInstance) {
  app.patch('/users/me', { onRequest: [app.authenticate] }, async (request) => {
    const userId = request.user.userId;
    const data = updateProfileSchema.parse(request.body);
    return prisma.user.update({ where: { id: userId }, data });
  });

  app.get('/users/me/addresses', { onRequest: [app.authenticate] }, async (request) => {
    return prisma.address.findMany({
      where: { userId: request.user.userId },
    });
  });

  app.post('/users/me/addresses', { onRequest: [app.authenticate] }, async (request) => {
    const userId = request.user.userId;
    const data = addressSchema.parse(request.body);
    return prisma.address.create({ data: { userId, ...data } });
  });

  app.patch('/users/me/addresses/:id', { onRequest: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    const data = addressSchema.parse(request.body);
    return prisma.address.update({ where: { id }, data });
  });

  app.delete('/users/me/addresses/:id', { onRequest: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    await prisma.address.delete({ where: { id } });
    return { success: true };
  });
}
