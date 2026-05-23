import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.category.createMany({
    data: [
      { id: 'burger', name: 'Burgerlar', emoji: '🍔', order: 1 },
      { id: 'hot-dog', name: 'Hot Dog', emoji: '🌭', order: 2 },
      { id: 'lavash', name: 'Lavash', emoji: '🌯', order: 3 },
      { id: 'pizza', name: 'Pitsa', emoji: '🍕', order: 4 },
      { id: 'kfc', name: 'Tovuq', emoji: '🍗', order: 5 },
      { id: 'extra', name: 'Qo\'shimcha', emoji: '🍟', order: 6 },
      { id: 'drink', name: 'Ichimliklar', emoji: '🥤', order: 7 },
      { id: 'dessert', name: 'Desertlar', emoji: '🍰', order: 8 },
    ],
  });

  const burger1 = await prisma.product.create({
    data: {
      categoryId: 'burger',
      name: 'Cheeseburger',
      description: 'Ikki qatlam pishloq, yangi gosht kotlet va maxsus sous bilan',
      price: 35000,
      emoji: '🍔',
      badge: 'BESTSELLER',
      preparationTime: 15,
      rating: 4.9,
      reviewCount: 142,
      addons: {
        create: [{ name: 'Qo\'shimcha pishloq', emoji: '🧀', price: 5000 }],
      },
    },
  });

  await prisma.product.createMany({
    data: [
      { categoryId: 'burger', name: 'BBQ Burger', description: 'Asl BBQ sous, qovurilgan piyoz', price: 45000, emoji: '🍔', badge: 'HOT', preparationTime: 18 },
      { categoryId: 'hot-dog', name: 'Klassik Hot Dog', description: 'Issiq sosiska va yangi non', price: 15000, emoji: '🌭', preparationTime: 8 },
      { categoryId: 'drink', name: 'Coca-Cola', description: 'Sovuq muzli Coca-Cola', price: 8000, emoji: '🥤' },
    ],
  });

  const cola = await prisma.product.findFirst({ where: { name: 'Coca-Cola' } });
  if (cola) {
    await prisma.productVariant.createMany({
      data: [
        { productId: cola.id, name: '0.5 L', priceModifier: 0 },
        { productId: cola.id, name: '1 L', priceModifier: 5000 },
        { productId: cola.id, name: '1.5 L', priceModifier: 7000 },
        { productId: cola.id, name: '2 L', priceModifier: 10000 },
      ],
    });
  }

  console.log('✅ Database seeded!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
