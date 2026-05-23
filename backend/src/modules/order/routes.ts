import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { Server as SocketServer } from 'socket.io';

const createOrderSchema = z.object({
  type: z.enum(['DELIVERY', 'PICKUP']),
  addressId: z.string().optional(),
  phone: z.string(),
  phoneSecondary: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    variantId: z.string().optional(),
    addonIds: z.array(z.string()).optional(),
    comment: z.string().optional(),
  })),
  paymentMethod: z.enum(['CASH', 'PAYME', 'CLICK', 'TELEGRAM_PAY', 'CARD']),
});

export async function orderRoutes(app: FastifyInstance, io: SocketServer) {
  app.post('/orders', { onRequest: [app.authenticate] }, async (request, reply) => {
    const data = createOrderSchema.parse(request.body);
    const userId = request.user.userId;

    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true, addons: true },
      });

      if (!product || !product.isAvailable) continue;

      let price = product.price;
      let variantName: string | undefined;

      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          price += variant.priceModifier;
          variantName = variant.name;
        }
      }

      const addonNames: string[] = [];
      if (item.addonIds) {
        for (const addonId of item.addonIds) {
          const addon = product.addons.find(a => a.id === addonId);
          if (addon) {
            price += addon.price;
            addonNames.push(addon.name);
          }
        }
      }

      const total = price * item.quantity;
      subtotal += total;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productEmoji: product.emoji,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: total,
        variantName,
        addonNames,
        comment: item.comment,
      });
    }

    const deliveryFee = data.type === 'DELIVERY' ? 5000 : 0;
    const total = subtotal + deliveryFee;

    const orderNumber = `CC-${Date.now().toString().slice(-6)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        type: data.type,
        addressId: data.addressId,
        phone: data.phone,
        phoneSecondary: data.phoneSecondary,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: data.paymentMethod,
        items: { create: orderItems },
        statusHistory: { create: { status: 'PENDING' } },
      },
      include: { items: true, address: true },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { 
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
      },
    });

    return order;
  });

  app.get('/orders/my', { onRequest: [app.authenticate] }, async (request) => {
    const userId = request.user.userId;
    return prisma.order.findMany({
      where: { userId },
      include: { items: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  app.get('/orders/:id', { onRequest: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    return prisma.order.findUnique({
      where: { id },
      include: { items: true, address: true, courier: true, statusHistory: true },
    });
  });

  app.patch('/orders/:id/status', { onRequest: [app.authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };

    const order = await prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: true, user: true },
    });

    await prisma.orderStatusHistory.create({
      data: { orderId: id, status: status as any },
    });

    // WebSocket: Real-time update
    io.to(`order:${id}`).emit('order-update', {
      orderId: id,
      status,
      updatedAt: new Date().toISOString(),
    });

    console.log(`📦 Order ${id} status → ${status} (WebSocket emitted)`);

    return order;
  });
}
