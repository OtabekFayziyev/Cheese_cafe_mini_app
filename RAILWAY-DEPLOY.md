# 🚀 Railway.app Deploy Guide

## ✅ Nima Olamiz?

- 🌐 **HTTPS URL:** https://cheese-cafe-production.up.railway.app
- 📦 **PostgreSQL:** Bepul database
- 🤖 **Telegram Bot:** To'liq ishlaydi
- 💰 **Narx:** $0 (5$ bepul kredit)

---

## 📋 Deploy Qadamlari

### 1️⃣ GitHub Setup

```bash
cd cheese-cafe

# Git init
git init
git add .
git commit -m "Initial commit: Cheese Cafe Bot"

# GitHub repo yaratish
# https://github.com/new
# Name: cheese-cafe-bot
# Public repo

# Push
git remote add origin https://github.com/YOUR_USERNAME/cheese-cafe-bot.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Railway.app Setup

**A) Railway.app ga kiring:**
```
https://railway.app
```

**B) GitHub bilan Login**

**C) New Project:**
- **Deploy from GitHub repo**
- Repoingizni tanlang: `cheese-cafe-bot`

**D) Service yaratiladi** ✅

---

### 3️⃣ PostgreSQL Database

**A) Add Database:**
- Project ichida **New** → **Database** → **PostgreSQL**

**B) Database yaratiladi** ✅

---

### 4️⃣ Environment Variables

**Backend service → Variables tab:**

**Qo'shing:**
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
TELEGRAM_BOT_TOKEN=7894561230:AAH_YOUR_BOT_TOKEN_HERE
TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_WEBAPP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
JWT_SECRET=random-secret-key-12345
CORS_ORIGIN=*
PORT=3000
NODE_ENV=production
```

**MUHIM:**
- `TELEGRAM_BOT_TOKEN` - @BotFather dan oling
- `TELEGRAM_BOT_USERNAME` - Bot username (@ siz)
- `JWT_SECRET` - random string

---

### 5️⃣ Deploy!

**A) Settings → Deploy:**
- **Custom Start Command** (agar kerak bo'lsa):
  ```
  cd backend && npx prisma migrate deploy && npm start
  ```

**B) Deploy button → Redeploy**

**C) Logs ni kuzating:**
```
Building...
✓ Frontend built
✓ Backend built
✓ Prisma migrated
🚀 Server running
🤖 Bot started
```

---

### 6️⃣ Public URL Olish

**A) Settings → Networking:**
- **Generate Domain** → Public URL oling
- Misol: `https://cheese-cafe-production.up.railway.app`

---

### 7️⃣ Telegram Bot Sozlash

**A) @BotFather ga yozing:**
```
/setmenubutton
```

**B) Botingizni tanlang**

**C) WebApp URL:**
```
https://YOUR-RAILWAY-URL.up.railway.app
```

**D) Button text:**
```
🍔 Menu
```

---

## ✅ Test Qilish

**1. Browser:**
```
https://your-railway-url.up.railway.app
```

**Ko'rinadi:** 🧀 Cheese Cafe!

**2. Telegram Bot:**
- Telegram da botni oching
- Menu tugmasini bosing
- ✨ Mini App ochiladi!

---

## 🐛 Troubleshooting

### Deploy xatosi?

**Logs tekshiring:**
- Railway → Project → Service → Deployments
- Logs ni o'qing

### Database xatosi?

**Environment Variables:**
- `DATABASE_URL` to'g'ri reference qilinganmi?
- `${{Postgres.DATABASE_URL}}` formatda

### Bot ishlamayapti?

**Variables tekshiring:**
- `TELEGRAM_BOT_TOKEN` to'g'ri
- `TELEGRAM_WEBAPP_URL` to'g'ri Railway URL

---

## 💰 Narx

**Railway Free Tier:**
- $5 bepul kredit (oyiga)
- ~500 soat server vaqti
- PostgreSQL bepul

**Yetarli:** Small project uchun bepul!

---

## 🔄 Update Qilish

**Kod o'zgarsa:**
```bash
git add .
git commit -m "Update: new feature"
git push
```

**Railway avtomatik redeploy qiladi!** ✅

---

## 🎉 Success!

Sizning botingiz endi internetda!

**URL:** https://your-project.up.railway.app
**Telegram:** @your_bot → Menu tugmasi

---

Savollar bo'lsa yozing! 🚀
