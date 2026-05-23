# CHANGELOG — Cheese Cafe Frontend

## [1.1.0] - 2026-05-22 (Step 1 v2 — Real test fixlari)

### 🔧 Tuzatishlar

#### 1. Kuryer telefon raqami
- ✅ Kuryer raqamiga `+` belgisi qo'shildi
- ✅ `tel:+998...` havolasi to'g'ri ishlaydi

#### 2. Promo Carousel
- ✅ Swipe/drag qo'llab-quvvatlash (Framer Motion)
- ✅ Bosilganda batafsil modal (Sheet)
- ✅ Avtomatik o'zgarish + manual swipe

#### 3. Qidiruv paneli
- ✅ Input faollashtirildi
- ✅ URL search params (`?q=...`) orqali ishlaydi
- ✅ Header va HomePage integratsiyasi

#### 4. Manzil tahrirlash
- ✅ Edit bosilganda eski ma'lumotlar avtomatik yuklanadi
- ✅ `useEffect` bilan form defaultValues
- ✅ Faqat kerakli qismni o'zgartirish imkoniyati

#### 5. Mahsulot variantlari (soddalashtirildi)
- ✅ **Size variantlar** butunlay olib tashlandi
- ✅ **Burgerlar** — faqat "Qo'shimcha pishloq" 🧀 (5000 so'm)
- ✅ **Hot-doglar** — "Qo'shimcha sosiska" 🌭 (4000 so'm)
- ✅ **Ichimliklar** — Hajm (0.5L, 1L, 1.5L, 2L) variantlari
- ✅ **Maxsus talab** — mahsulot turiga qarab placeholder:
  - Ichimlik: "Salqin bo'lsin", "Iliq bo'lsin"
  - Desert: "Shirin emas", "Ko'proq krem"
  - Boshqa: "Pomidor olib tashlang", "O'tkir bo'lsin"

#### 6. Yetkazib berish narxi
- ✅ Hech qachon bepul emas
- ✅ Fiksatsiyalangan: **5000 so'm**
- ✅ `FREE_DELIVERY_THRESHOLD = Infinity`

#### 7. To'lov va Buyurtma yakuni
- ✅ Payme/Click bosilganda: "Hozirda faqat naqd..." toast
- ✅ Buyurtma berish → **OrderSuccessPage** (yangi sahifa)
- ✅ Success animatsiya (CheckCircle2)
- ✅ Buyurtma ma'lumotlari ko'rsatiladi
- ✅ Savat avtomatik tozalanadi
- ✅ Oq ekran xatosi tuzatildi

#### 8. Telefon A variant
- ✅ Checkout da "Asosiy raqam" va "Qo'shimcha raqam" labellari
- ✅ Profilda telefon tahrirlash imkoniyati
- ✅ Bot integratsiyasi uchun tayyor

#### 9. Kafe holati
- ✅ **CafeStatusBar** komponenti qo'shildi
- ✅ Ish vaqti: 09:00 - 05:00 (20/7)
- ✅ 🟢 Ochiq / 🔴 Yopiq status
- ✅ Header ustida ko'rinadi
- ✅ Backend integratsiyasi uchun tayyor

---

### 📦 Yangi fayllar

- `src/pages/OrderSuccessPage.tsx` — buyurtma muvaffaqiyat sahifasi
- `src/components/layout/CafeStatusBar.tsx` — kafe holati banner

### 🔧 O'zgartirilgan fayllar

- `src/components/home/PromoCarousel.tsx` — swipe + modal
- `src/components/layout/Header.tsx` — URL search params
- `src/components/layout/AppLayout.tsx` — CafeStatusBar
- `src/pages/HomePage.tsx` — qidiruv integratsiya
- `src/pages/AddressesPage.tsx` — edit useEffect
- `src/pages/CartPage.tsx` — yetkazish, to'lov, success
- `src/pages/ProductDetailPage.tsx` — placeholder variant
- `src/pages/OrdersPage.tsx` — kuryer + belgisi
- `src/pages/ProfilePage.tsx` — telefon label
- `src/data/products.mock.ts` — variantlar soddalashtirildi
- `src/App.tsx` — OrderSuccessPage route

---

### 📊 Statistika

- **TS/TSX fayllar:** 40 ta
- **Jami fayllar:** 50 ta
- **ZIP hajmi:** 67KB
- **Kod qatorlari:** ~4000+

---

## [1.0.0] - 2026-05-22 (Step 1 initial)

### ✅ Asosiy xususiyatlar

- 6 ta to'liq funksional sahifa
- 9 ta UI komponent (shadcn/ui pattern)
- 3 ta Zustand store (persist)
- Telegram WebApp integratsiya
- Mobile-first dizayn
- TypeScript strict mode
- Framer Motion animatsiyalar

---

**Keyingi bosqich:** Backend + Real-time + Kuryer paneli + Admin dashboard
