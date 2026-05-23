import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';

export async function adminRoutes(app: FastifyInstance) {
  app.get('/admin/stats', { onRequest: [app.authenticate] }, async () => {
    const [totalOrders, totalRevenue, activeOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] } } }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      activeOrders,
    };
  });

  app.get('/admin/orders', { onRequest: [app.authenticate] }, async (request) => {
    const { status } = request.query as { status?: string };
    
    return prisma.order.findMany({
      where: status ? { status: status as any } : undefined,
      include: { items: true, user: true, courier: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  });

  app.post('/admin/products', { onRequest: [app.authenticate] }, async (request) => {
    const data = request.body as any;
    const product = await prisma.product.create({ data });
    await redis.del('menu:products:all');
    return product;
  });

  app.patch('/admin/products/:id', { onRequest: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    const product = await prisma.product.update({ where: { id }, data });
    await redis.del('menu:products:all', `menu:product:${id}`);
    return product;
  });

  app.delete('/admin/products/:id', { onRequest: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    await prisma.product.delete({ where: { id } });
    await redis.del('menu:products:all', `menu:product:${id}`);
    return { success: true };
  });
}
