import { FastifyInstance } from 'fastify';
import { prisma } from '../../config/database.js';
import { Server as SocketServer } from 'socket.io';

export async function courierRoutes(app: FastifyInstance, io: SocketServer) {
  app.get('/courier/orders', { onRequest: [app.authenticate] }, async (request) => {
    const userId = request.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { telegramId: true } });
    if (!user) throw new Error('User not found');
    const courier = await prisma.courier.findFirst({ where: { telegramId: user.telegramId } });
    if (!courier) throw new Error('Courier not found');

    return prisma.order.findMany({
      where: { 
        courierId: courier.id,
        status: { in: ['CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY'] },
      },
      include: { items: true, address: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  app.post('/courier/location', { onRequest: [app.authenticate] }, async (request) => {
    const userId = request.user.userId;
    const { latitude, longitude } = request.body as { latitude: number; longitude: number };

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { telegramId: true } });
    if (!user) throw new Error('User not found');

    const courier = await prisma.courier.findFirst({
      where: { telegramId: user.telegramId },
      include: { orders: { where: { status: 'ON_THE_WAY' } } },
    });

    if (!courier) throw new Error('Courier not found');

    await prisma.courier.updateMany({
      where: { telegramId: user.telegramId },
      data: { currentLat: latitude, currentLng: longitude, isOnline: true },
    });

    // WebSocket: Emit location to all active orders
    courier.orders.forEach(order => {
      io.to(`order:${order.id}`).emit('courier-location', {
        lat: latitude,
        lng: longitude,
      });
    });

    console.log(`📍 Courier ${courier.id} location updated (${courier.orders.length} orders notified)`);

    return { success: true };
  });
}
