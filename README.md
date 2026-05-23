# 🧀 Cheese Cafe — Telegram Mini App

Qarshi shahridagi eng mazali cafe uchun **production-grade** Telegram Mini App.

## 📦 Stack

| Qatlam | Texnologiya |
|--------|-------------|
| **Frontend** | React 18 + Vite + TypeScript |
| **Styling** | Tailwind CSS + custom design system |
| **UI** | shadcn/ui pattern + Radix primitives |
| **Animatsiya** | Framer Motion |
| **State** | Zustand (persist bilan) |
| **Server state** | TanStack Query (React Query) |
| **Router** | React Router v6 |
| **Telegram** | Telegram WebApp SDK v6+ |
| **Icons** | Lucide React |

## 🚀 Ishga tushirish

```bash
# 1. Dependency'larni o'rnatish
cd frontend
npm install

# 2. .env faylni sozlash
cp .env.example .env
# .env ichida API URL va boshqa qiymatlarni to'g'rilang

# 3. Development server
npm run dev

# 4. Browser'da ochish (TG simulyatsiya)
# http://localhost:5173
```

### Telegram'da test qilish

Local development ni Telegram'da ochish uchun **HTTPS tunnel** kerak:

```bash
# ngrok orqali
ngrok http 5173

# Yoki cloudflared
cloudflared tunnel --url http://localhost:5173
```

Olingan HTTPS URL ni `@BotFather` da `/setmenubutton` orqali botga ulang.

## 📁 Folder strukturasi

```
frontend/
├── public/                    # Statik fayllar (favicon, manifest)
├── src/
│   ├── components/
│   │   ├── ui/               # Asosiy UI (Button, Input, Sheet, Badge, Toaster)
│   │   ├── layout/           # Header, BottomNav, AppLayout
│   │   ├── home/             # Bosh sahifa komponentlari
│   │   └── shared/           # Umumiy komponentlar
│   ├── pages/                # Sahifalar (route'lar)
│   ├── hooks/                # Custom React hooks
│   │   ├── useTelegram.ts    # TG WebApp ga kirish
│   │   ├── useBackButton.ts  # TG BackButton boshqaruv
│   │   └── useMainButton.ts  # TG MainButton boshqaruv
│   ├── stores/               # Zustand state stores
│   │   ├── cart.store.ts     # Savat
│   │   ├── user.store.ts     # Foydalanuvchi
│   │   └── ui.store.ts       # UI (toast, modal)
│   ├── lib/                  # Yordamchi funksiyalar
│   │   ├── telegram.ts       # TG SDK wrapper
│   │   ├── utils.ts          # cn(), helpers
│   │   └── format.ts         # Narx, sana formatlash
│   ├── types/                # TypeScript types
│   │   ├── telegram.d.ts     # TG WebApp types
│   │   ├── menu.ts           # Menu types
│   │   ├── order.ts          # Buyurtma types
│   │   └── user.ts           # User types
│   ├── data/                 # Mock ma'lumotlar (vaqtinchalik)
│   ├── styles/               # Global CSS
│   ├── App.tsx               # Router + providers
│   └── main.tsx              # Entry point
├── index.html
├── tailwind.config.ts        # Brending dizayn tizimi
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 🎨 Dizayn tizimi

**Brend ranglari:**
- 🟡 Sariq: `#FFD000` (asosiy)
- 🔴 Qizil: `#E8291C` (action)
- ⚫ Quyuq: `#1A0A00` (text)
- 🟤 Krem: `#FFFDF5` (background)

**Shriftlar:**
- Sarlavhalar: `Playfair Display` (serif, brending)
- Asosiy: `Plus Jakarta Sans` (sans, o'qish qulay)

Tailwind orqali ishlatish:
```jsx
<div className="bg-brand-yellow text-brand-dark">...</div>
<h1 className="font-display">Sarlavha</h1>
```

## 🛣 Yo'l xaritasi

### ✅ 1-bosqich: Mijoz paneli (TUGALLANDI!)

- [x] Loyiha skeleti (Vite + React + TS + Tailwind)
- [x] Dizayn tizimi (brand colors, typography)
- [x] Telegram WebApp SDK integratsiyasi
- [x] Zustand stores (cart, user, UI)
- [x] Layout (Header + BottomNav)
- [x] Bosh sahifa (promo karusel + kategoriyalar + mahsulotlar)
- [x] Mahsulot detal sahifasi (variantlar, qo'shimchalar, izoh)
- [x] Savat sahifasi (yetkazish/olib ketish, manzil, to'lov)
- [x] Manzil tanlash sahifasi
- [x] Buyurtmalar sahifasi (real-time tracking UI)
- [x] Profil sahifasi
- [x] UI komponentlar (Button, Input, Badge, Sheet, Toaster)

### ⏭ 2-bosqich: Kuryer paneli (Hafta 2-3)

- [ ] Buyurtmalar ro'yxati
- [ ] Xaritada manzil + navigatsiya
- [ ] Status yangilash
- [ ] Mijozga qo'ng'iroq

### ⏭ 3-bosqich: Admin paneli (Hafta 3-4)

- [ ] Dashboard (bugungi statistika)
- [ ] Menu boshqaruv
- [ ] Kuryer boshqaruv
- [ ] Telegram bildirishnomalar

### 🔜 Backend (alohida loyiha)

- Node.js + Fastify
- Prisma + PostgreSQL
- Redis (kesh, real-time)
- Socket.io (real-time status)
- grammy.js (Telegram bot)
- JWT + Telegram initData verification

## 🔧 Foydali komandalar

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run preview      # Build natijasini ko'rish
npm run type-check   # TypeScript tekshirish
npm run lint         # ESLint tekshirish
```

## 📝 Litsenziya

Private — Cheese Cafe © 2026
