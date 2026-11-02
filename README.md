# LYRA · Move With Purpose

E-commerce de activewear premium: tienda cliente + panel `/admin`. Vite · React 18 · Tailwind · Lucide · Supabase (opcional).

## Arranque rápido (modo demo, sin backend)
```bash
npm install
npm run dev
```
Sin variables de entorno la app guarda productos, banner y carrito en `localStorage` con 10 prendas de ejemplo.
Admin: `/admin` · contraseña demo `lyra2025` (`VITE_ADMIN_PASSWORD`).

## Producción con Supabase
1. Crea un proyecto y ejecuta `supabase/schema.sql` en el SQL Editor.
2. Crea un usuario en *Authentication > Users* y añádelo a `public.admins` (instrucción al final del SQL).
3. Copia `.env.example` a `.env` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. El banner y los productos se actualizan en vivo (Realtime); las imágenes se suben al bucket `product-images`.

## Estructura
```
src/
  lib/        api (Supabase/localStorage), whatsapp, placeholder, format
  store/      ShopContext (productos+ajustes), CartContext (carrito persistente)
  components/ Header, AnnouncementBar, ProductCard, CartDrawer, Logo, Sparkle ✦
  pages/      Home, Shop (filtros), ProductDetail (pestañas), Manifiesto
  pages/admin Dashboard, Products (CRUD), ProductForm, BannerManager
supabase/schema.sql
```
## Paleta (tailwind.config.js)
`ink #121212/#1A1A1A` · `sage #8A9A86 / deep #7B8C7A` · `chalk #FFF` · `bone #F4F4F0`. Fuentes: Syne (títulos) + Inter.

El número de WhatsApp y el umbral de envío gratis se editan en `/admin/banner`.
