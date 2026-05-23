# 🚀 Vercel + Railway Deploy Guide

## Arxitektura

```
Telegram Bot → Vercel (Frontend) → Railway (Backend + PostgreSQL)
```

---

## ✅ Nimalar Bepul?

- 🎨 **Vercel:** Frontend hosting (SUPER TEZI!)
- ⚙️ **Railway:** Backend + PostgreSQL + Bot
- 💰 **Narx:** $0 (ikkalasi ham bepul tier)

---

## 📋 Deploy Qadamlari

### 1️⃣ GitHub Push (2 daqiqa)

```bash
cd cheese-cafe

git init
git add .
git commit -m "Deploy: Cheese Cafe Bot"

# GitHub.com da repo yarating: cheese-cafe-bot
git remote add origin https://github.com/YOUR_USERNAME/cheese-cafe-bot.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Backend Deploy (Railway) - 5 daqiqa

**A) Railway.app ga kiring:**
```
https://railway.app
```

**B) Login with GitHub**

**C) New Project:**
- **Deploy from GitHub repo**
- Select: `cheese-cafe-bot`

**D) Service Configuration:**
- Root Directory: **backend**
- Start Command: `npx prisma migrate deploy && npm start`

**E) Add PostgreSQL:**
- Project → **New** → **Database** → **PostgreSQL**

**F) Environment Variables:**

Backend service → Variables tab:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
TELEGRAM_BOT_TOKEN=7123456:AAH_YOUR_TOKEN
TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_WEBAPP_URL=https://YOUR-VERCEL-URL.vercel.app
JWT_SECRET=random-secret-key-12345
CORS_ORIGIN=https://YOUR-VERCEL-URL.vercel.app
PORT=3000
NODE_ENV=production
```

**MUHIM:** 
- `TELEGRAM_WEBAPP_URL` ni keyinroq Vercel URL bilan yangilang
- `CORS_ORIGIN` ham xuddi shu URL

**G) Deploy!**
- Logs kuzating
- Success bo'lguncha kuting

**H) Public Domain:**
- Settings → Networking → **Generate Domain**
- URL: `https://backend-production-xxxx.up.railway.app`
- **Saqlang!** (Frontend uchun kerak)

---

### 3️⃣ Frontend Deploy (Vercel) - 3 daqiqa

**A) Vercel.com ga kiring:**
```
https://vercel.com
```

**B) Login with GitHub**

**C) Import Project:**
- **Add New** → **Project**
- Import: `cheese-cafe-bot`

**D) Project Settings:**

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**E) Environment Variables:**

Add qiling:

```
Name: VITE_API_URL
Value: https://backend-production-xxxx.up.railway.app/api

Name: VITE_BOT_USERNAME  
Value: your_bot_username
```

**(Railway backend URL ni ishlatilg!)**

**F) Deploy!**

**G) Domain URL:**
- Settings → Domains
- URL: `https://cheese-cafe-frontend.vercel.app`
- **Saqlang!**

---

### 4️⃣ Railway Backend Yangilash

**Railway → Backend → Variables:**

```env
TELEGRAM_WEBAPP_URL=https://cheese-cafe-frontend.vercel.app
CORS_ORIGIN=https://cheese-cafe-frontend.vercel.app
```

**Deployments → Redeploy**

---

### 5️⃣ Telegram Bot Configuration

**@BotFather ga yozing:**

```
/setmenubutton
```

**Botingizni tanlang**

**WebApp URL:**
```
https://cheese-cafe-frontend.vercel.app
```

**Button text:**
```
🍔 Menu
```

---

## ✅ Test Qilish

### Frontend Test:
```
https://cheese-cafe-frontend.vercel.app
```
**Ko'rinishi kerak:** 🧀 Cheese Cafe UI

### Backend Health Check:
```
https://backend-production-xxxx.up.railway.app/health
```
**Response:** `{"status":"ok","timestamp":"..."}`

### Telegram Bot Test:
1. Telegram da botni oching
2. **Menu** tugmasini bosing
3. ✨ **Mini App ochiladi!**

---

## 🐛 Troubleshooting

### Frontend build xatosi?

**Vercel Logs tekshiring:**
- Deployments → Latest → Logs

**Ko'p uchraydigan:**
- `VITE_API_URL` environment variable yo'q
- Build command noto'g'ri

### Backend deploy xatosi?

**Railway Logs:**
- Deployments → Latest → View Logs

**Ko'p uchraydigan:**
- `DATABASE_URL` reference noto'g'ri
- Prisma migration xatosi
- `TELEGRAM_BOT_TOKEN` noto'g'ri

### CORS xatosi?

**Railway Backend Variables:**
```env
CORS_ORIGIN=https://cheese-cafe-frontend.vercel.app
```
**(Vercel URL bilan to'liq mos bo'lishi kerak)**

### Bot ishlamayapti?

**Tekshiring:**
1. Backend ishlaydimi? (health endpoint)
2. `TELEGRAM_WEBAPP_URL` to'g'rimi?
3. @BotFather da WebApp URL to'g'ri sozlanganmi?

---

## 🔄 Kod Yangilash

**Kod o'zgarsa:**

```bash
git add .
git commit -m "Update: yangi feature"
git push
```

**Avtomatik:**
- ✅ Vercel: frontend auto-redeploy
- ✅ Railway: backend auto-redeploy

---

## 💰 Narxlar

### Vercel Free Tier:
- ✅ 100GB bandwidth
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN

### Railway Free Tier:
- ✅ $5 bepul (oyiga)
- ✅ ~500 soat runtime
- ✅ PostgreSQL bepul

**Jami:** Small project uchun **BEPUL!** ✅

---

## 🎉 Natija

**5-10 daqiqadan keyin:**

1. ✅ Frontend: `https://cheese-cafe-frontend.vercel.app`
2. ✅ Backend: `https://backend-production-xxx.railway.app`
3. ✅ Telegram bot to'liq ishlaydi
4. ✅ Real-time WebSocket
5. ✅ PostgreSQL database
6. ✅ Port muammosi YO'Q!

---

## 📊 Performance

- **Frontend (Vercel):** 🚀 Lightning fast!
- **Backend (Railway):** ⚡ Good speed
- **Database:** 💾 PostgreSQL
- **Bot:** 🤖 24/7 ishlamoqda

---

Savollar bo'lsa yozing! 🚀
