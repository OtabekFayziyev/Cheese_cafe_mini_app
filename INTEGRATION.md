# Frontend → Backend Integration Guide

## ✅ Nima qilindi

### Backend API Integration
1. **API Client** (`src/lib/api.ts`)
   - Axios client konfiguratsiya
   - Auth interceptors
   - API endpoints: auth, menu, orders, user

2. **Telegram Auth Hook** (`src/hooks/useTelegramAuth.ts`)
   - Telegram WebApp data verification
   - Auto-login
   - Token management

3. **React Query Hooks**
   - `useMenu.ts` - Categories va products
   - `useOrders.ts` - Order CRUD operations

4. **User Store Updated**
   - Backend user structure
   - setUser method
   - totalOrders, bonusPoints

5. **Dependencies Added**
   - axios
   - socket.io-client

---

## 🚀 Ishga tushirish

### 1. Frontend ENV

```bash
cd frontend
cp .env.example .env
```

`.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_BOT_USERNAME=cheese_cafe_bot
```

### 2. Dependencies

```bash
npm install
```

### 3. Run

```bash
npm run dev
```

---

## 🔄 Real API ni ishlatish

### Auth avtomatik
Telegram WebApp ochilishi bilan:
1. `useTelegramAuth` hook ishlaydi
2. Backend `/api/auth/login` ga so'rov
3. Token saqlash
4. User data Zustand store ga

### Menu ma'lumotlari
Eski:
```typescript
import { PRODUCTS } from '@/data/products.mock'
```

Yangi:
```typescript
import { useProducts } from '@/hooks/useMenu'

function HomePage() {
  const { data: products, isLoading } = useProducts()
  // ...
}
```

### Buyurtma yaratish
```typescript
import { useCreateOrder } from '@/hooks/useOrders'

function CartPage() {
  const createOrder = useCreateOrder()
  
  const handleCheckout = async () => {
    await createOrder.mutateAsync({
      type: 'DELIVERY',
      phone: '998901234567',
      items: cartItems,
      paymentMethod: 'CASH',
    })
  }
}
```

---

## 📋 Keyingi qadamlar

### 1. HomePage ni yangilash
`src/pages/HomePage.tsx` da:
- `useCategories()` hook qo'shish
- `useProducts()` real data olish
- Loading states

### 2. OrdersPage ni yangilash
- `useMyOrders()` hook
- Real order data

### 3. CartPage checkout
- `useCreateOrder()` hook
- Backend ga yuborish

### 4. AddressesPage
- Backend CRUD operations
- `userAPI.createAddress()`
- `userAPI.updateAddress()`

### 5. WebSocket (Real-time)
```typescript
import io from 'socket.io-client'

const socket = io(VITE_API_URL)
socket.on('order-update', (data) => {
  // Update UI
})
```

---

## 🧪 Test

### Development mode (no Telegram)
App avtomatik dev mode ga tushadi agar `window.Telegram` bo'lmasa.

### Production (Telegram bot)
1. ngrok ishlasin: `ngrok http 5173`
2. Backend `.env` da `TELEGRAM_WEBAPP_URL` yangilang
3. Bot ochib test qiling

---

## 📝 Migration checklist

- [ ] HomePage - real products
- [ ] ProductDetailPage - real product
- [ ] CartPage - real order create
- [ ] OrdersPage - real orders
- [ ] ProfilePage - real user data
- [ ] AddressesPage - real CRUD
- [ ] WebSocket - real-time tracking

---

**Keyingi step:** HomePage ni to'liq real API ga o'tkazish?
