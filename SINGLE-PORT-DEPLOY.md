# 🚀 Single Port Deployment (Ngrok Free)

## Muammo yechildi!
Ngrok free faqat 1 tunnel. **Yechim:** Frontend + Backend bitta portda (3000)

---

## 📦 Setup

### 1. Frontend .env yaratish

```bash
cd frontend
cp .env.example .env
notepad .env
```

**Ichidagi:**
```env
VITE_API_URL=/api
VITE_BOT_USERNAME=cheese_cafe_bot
```

---

### 2. Frontend build qilish

```bash
cd frontend
npm install
npm run build
```

**Natija:** `frontend/dist` papka

---

### 3. Backend dependencies

```bash
cd backend
npm install
# @fastify/static allaqachon o'rnatilgan
```

---

### 4. Backend ishga tushirish

```bash
cd backend
npm run dev
```

**Ko'rinadi:**
```
🚀 Server running on http://localhost:3000
🤖 Bot started: @cheese_cafe_bot
```

**Endi backend:**
- API: `http://localhost:3000/api/*`
- Frontend: `http://localhost:3000/`
- WebSocket: `http://localhost:3000`

---

### 5. Ngrok (faqat 1 ta!)

```bash
ngrok http 3000
```

**URL:**
```
https://abc123.ngrok.io
```

---

### 6. @BotFather sozlash

```
/setmenubutton
→ Botingiz
→ https://abc123.ngrok.io
```

---

### 7. Backend .env yangilash

```bash
notepad backend\.env
```

**Qo'shing:**
```env
TELEGRAM_WEBAPP_URL=https://abc123.ngrok.io
CORS_ORIGIN=https://abc123.ngrok.io
```

---

### 8. Backend restart

```bash
# Ctrl+C
npm run dev
```

---

## ✅ Test

**Telegram bot:**
1. `@cheese_cafe_bot` ochish
2. Menu tugmasi
3. ✨ Ishlaydi!

---

## 🔄 Development Cycle

**Frontend o'zgarsa:**
```bash
cd frontend
npm run build
# Backend restart kerak emas!
```

**Backend o'zgarsa:**
```bash
cd backend
# Ctrl+C
npm run dev
```

---

## 📊 Architecture

```
Ngrok HTTPS (3000)
    ↓
Backend (3000)
    ├── /api/* → Fastify routes
    ├── /* → Static files (frontend/dist)
    └── WebSocket
```

---

## 🎯 Production Deploy

**Railway/Render:**
1. Frontend build: `npm run build`
2. Backend serve qiladi
3. Bitta port: ✅
4. HTTPS: ✅

---

Savollar bo'lsa yozing! 🚀
