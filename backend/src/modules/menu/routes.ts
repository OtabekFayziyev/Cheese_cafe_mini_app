import { FastifyInstance } from 'fastify';
import { prisma } from '../../config/database.js';
import { redis, CACHE_TTL } from '../../config/redis.js';

export async function menuRoutes(app: FastifyInstance) {
  app.get('/menu/categories', async () => {
    const cached = await redis.get('menu:categories');
    if (cached) return JSON.parse(cached);

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    await redis.set('menu:categories', JSON.stringify(categories), 'EX', CACHE_TTL.MENU);
    return categories;
  });

  app.get('/menu/products', async (request) => {
    const { categoryId } = request.query as { categoryId?: string };
    
    const cacheKey = categoryId ? `menu:products:${categoryId}` : 'menu:products:all';
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const products = await prisma.product.findMany({
      where: { 
        isAvailable: true,
        ...(categoryId && { categoryId }),
      },
      include: { variants: true, addons: true },
    });

    await redis.set(cacheKey, JSON.stringify(products), 'EX', CACHE_TTL.MENU);
    return products;
  });

  app.get('/menu/products/:id', async (request) => {
    const { id } = request.params as { id: string };
    
    const cached = await redis.get(`menu:product:${id}`);
    if (cached) return JSON.parse(cached);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, addons: true, category: true },
    });

    if (!product) throw new Error('Product not found');

    await redis.set(`menu:product:${id}`, JSON.stringify(product), 'EX', CACHE_TTL.MENU);
    return product;
  });
}
