import { Bot, InlineKeyboard } from 'grammy';
import { CONFIG } from '../config/env.js';
import { prisma } from '../config/database.js';

export const bot = new Bot(CONFIG.TELEGRAM_BOT_TOKEN);

bot.command('start', async (ctx) => {
  const user = await prisma.user.findUnique({ 
    where: { telegramId: BigInt(ctx.from.id) } 
  });

  if (!user) {
    return ctx.reply(
      'Xush kelibsiz! 🧀 Cheese Cafe botiga\n\n' +
      'Buyurtma berish uchun telefon raqamingizni ulashing:',
      {
        reply_markup: {
          keyboard: [[{ text: '📱 Telefon raqamni ulashish', request_contact: true }]],
          resize_keyboard: true,
        },
      }
    );
  }

  const keyboard = new InlineKeyboard().webApp('🍔 Menyu ochish', CONFIG.TELEGRAM_WEBAPP_URL);
  
  return ctx.reply(
    `Salom, ${user.firstName}! 👋\n\n` +
    `Jami buyurtmalar: ${user.totalOrders}\n` +
    `Bonus ballar: ${user.bonusPoints} ⭐`,
    { reply_markup: keyboard }
  );
});

bot.on('message:contact', async (ctx) => {
  if (!ctx.message.contact) return;
  
  const phone = ctx.message.contact.phone_number.replace('+', '');
  
  let user = await prisma.user.findUnique({ 
    where: { telegramId: BigInt(ctx.from.id) } 
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { phone },
    });
  } else {
    user = await prisma.user.create({
      data: {
        telegramId: BigInt(ctx.from.id),
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username,
        phone,
      },
    });
  }

  const keyboard = new InlineKeyboard().webApp('🍔 Menyu ochish', CONFIG.TELEGRAM_WEBAPP_URL);
  
  await ctx.reply(
    'Rahmat! Telefon raqamingiz saqlandi ✅\n\n' +
    'Endi buyurtma berishingiz mumkin:',
    { reply_markup: keyboard }
  );
});

bot.command('help', (ctx) => {
  return ctx.reply(
    '🧀 Cheese Cafe Yordam\n\n' +
    '/start - Botni qayta ishga tushirish\n' +
    '/menu - Menyuni ochish\n' +
    '/orders - Buyurtmalarim\n' +
    '/help - Yordam'
  );
});

bot.command('menu', (ctx) => {
  const keyboard = new InlineKeyboard().webApp('🍔 Menyu', CONFIG.TELEGRAM_WEBAPP_URL);
  return ctx.reply('Menyu:', { reply_markup: keyboard });
});

export async function notifyOrderStatus(orderId: string, status: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) return;

  const messages = {
    CONFIRMED: '✅ Buyurtmangiz tasdiqlandi!',
    PREPARING: '👨‍🍳 Buyurtmangiz tayyorlanmoqda...',
    READY: '✅ Buyurtmangiz tayyor!',
    ON_THE_WAY: '🛵 Kuryer yo\'lda!',
    DELIVERED: '🎉 Buyurtmangiz yetkazib berildi!',
  };

  const message = messages[status as keyof typeof messages];
  if (message && order.user.telegramId) {
    await bot.api.sendMessage(
      order.user.telegramId.toString(),
      `${message}\n\nBuyurtma: #${order.orderNumber}\nJami: ${order.total} so'm`
    );
  }
}
