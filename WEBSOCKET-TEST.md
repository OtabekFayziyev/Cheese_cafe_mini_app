# 🧪 WebSocket Real-time Test Guide

## ✅ Nima qo'shildi

### Frontend (5 ta yangi fayl)
- `src/lib/socket.ts` - Socket.io client
- `src/hooks/useOrderTracking.ts` - Real-time tracking hook
- OrdersPage - Real-time updates
- OrderDetailView - Live status indicator
- Connection status badge

### Backend (3 ta o'zgarish)
- `src/modules/order/routes.ts` - Status update emit
- `src/modules/courier/routes.ts` - Location emit
- `src/websocket/index.ts` - Leave events

---

## 🚀 Ishga tushirish

### 1. Backend
```bash
cd backend
npm install  # Agar dependencies yangilanmagan bo'lsa
npm run dev
```

**Kutilgan output:**
```
🚀 Server running on http://localhost:3000
🤖 Bot started: @cheese_cafe_bot
```

### 2. Frontend
```bash
cd frontend
npm install  # socket.io-client yangi qo'shildi
npm run dev
```

**Kutilgan output:**
```
VITE ready in X ms
➜ Local: http://localhost:5173/
```

### 3. Telegram Bot (ngrok)
```bash
ngrok http 5173
```

---

## 🧪 Test Scenario 1: Order Status Real-time

### Step 1: Buyurtma yaratish
1. Telegram bot ochish
2. Menu → Savat → Buyurtma berish
3. Success sahifadan **Buyurtmalarim** ga o'tish

### Step 2: Real-time ni ko'rish
1. Buyurtmani ochish (OrderDetailView)
2. **"Real-time"** badge ko'rinishini tekshirish (header da)
3. Console ochish (F12 → Console)

**Console da ko'rinadi:**
```
✅ Socket connected: abc123def456
```

### Step 3: Status o'zgartirish (Backend orqali)

**Option A - Postman:**
```
PATCH http://localhost:3000/api/orders/{ORDER_ID}/status
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json
Body:
{
  "status": "PREPARING"
}
```

**Option B - curl:**
```bash
# Avval login qiling
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"initData":"..."}'

# Token oling va ishlatilg
TOKEN="ey..."

# Status o'zgartiring
curl -X PATCH http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARING"}'
```

**Frontend da ko'rinadi:**
- Status bar avtomatik yangilanadi! ✨
- Console: `📦 Order update: {orderId, status, updatedAt}`
- Animatsiya bilan o'tish

### Test qilish uchun statuslar:
```
PENDING → CONFIRMED → PREPARING → READY → ON_THE_WAY → DELIVERED
```

---

## 🧪 Test Scenario 2: Courier Location

### Step 1: Courier sifatida location yuborish

```bash
# Courier token bilan
curl -X POST http://localhost:3000/api/courier/location \
  -H "Authorization: Bearer $COURIER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 41.311151,
    "longitude": 69.279737
  }'
```

### Step 2: Frontend da ko'rish
- OrderDetailView da courier info qismida
- **"Jonli"** badge paydo bo'ladi
- "📍 Kuryer harakatda (real-time tracking)" matni
- Console: `📍 Courier location: {lat, lng}`

---

## 🐛 Troubleshooting

### 1. Socket connect bo'lmasa

**Frontend console:**
```
Socket connection error: ...
```

**Yechim:**
- Backend ishlaganini tekshiring
- CORS sozlamalarini tekshiring
- `.env` da CORS_ORIGIN to'g'ri bo'lsin

### 2. Real-time update kelmasa

**Backend console tekshiring:**
```bash
# Quyidagi log ko'rinishi kerak:
Socket abc123 joined order:ORDER_ID
📦 Order ORDER_ID status → PREPARING (WebSocket emitted)
```

**Agar yo'q bo'lsa:**
- Order ID to'g'ri ekanligini tekshiring
- JWT token to'g'ri ekanligini tekshiring
- OrderDetailView ochiq ekanligini tekshiring

### 3. Courier location kelmasa

**Backend console:**
```bash
📍 Courier courier_id location updated (2 orders notified)
```

**Tekshirish:**
- Courier ON_THE_WAY statusdagi orderga tayinlanganmi?
- Order status ON_THE_WAY mi?
- OrderDetailView ochiq mi?

---

## 📊 Console Monitoring

### Backend Console
```bash
cd backend
npm run dev

# Ko'rishingiz kerak:
✅ Socket connected: abc123
Socket abc123 joined order:order_123
📦 Order order_123 status → PREPARING (WebSocket emitted)
📍 Courier courier_1 location updated (1 orders notified)
```

### Frontend Console (Browser F12)
```bash
# Ko'rishingiz kerak:
✅ Socket connected: def456
📦 Order update: {orderId: "...", status: "PREPARING", ...}
📍 Courier location: {lat: 41.31, lng: 69.27}
```

---

## ✅ Success Indicators

**Frontend da:**
- [ ] "Real-time" badge ko'rinadi
- [ ] Status avtomatik yangilanadi
- [ ] "Jonli" badge courier info da
- [ ] Console da updates ko'rinadi
- [ ] Reconnect ishlaydi (backend restart qilsangiz)

**Backend da:**
- [ ] Socket connections logged
- [ ] Join/leave events logged
- [ ] Emit events logged
- [ ] No errors

---

## 🎯 Keyingi Test

**Full flow:**
1. ✅ Login (Telegram)
2. ✅ Browse menu
3. ✅ Add to cart
4. ✅ Place order
5. ✅ Open OrderDetailView
6. ✅ See "Real-time" badge
7. ✅ Change status (backend)
8. ✅ Watch real-time update! 🎉

---

## 🚨 Important Notes

1. **Socket.io versiyasi:**
   - Backend: socket.io ^4.8.1
   - Frontend: socket.io-client ^4.8.1

2. **Connection URL:**
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

3. **CORS:**
   - Backend `.env`: `CORS_ORIGIN=http://localhost:5173`
   - Production: Update to production URL

4. **Ngrok:**
   - Frontend URL (ngrok): `https://xxx.ngrok.io`
   - Backend still: `http://localhost:3000`
   - WebSocket will work locally

---

Savollar bo'lsa yozing! 🚀
