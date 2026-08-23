# Chop Republic — Handoff

**Date:** 21 August 2026  
**Working app:** `web/` (Vite + React)  
**Original template (untouched after early edits):** root `.html` files  
**Goal:** Real one-location food business. Pickup + delivery. Hosted on Cloudflare. Look first, then ordering.

This file is the single handoff: what we decided, what is live in the repo, what is still open, and the build order from here.

---

## 1. What this product is

**Chop Republic** (“A Flavour Nation”) is a real restaurant, not a template demo.

- One kitchen / one location
- Customers order online for **pickup and delivery**
- Kitchen staff see orders and move status
- Payments online (Paystack or Stripe — not locked)
- Timeline: build it properly, no rush
- Look and brand first; backend after the shopfront feels right

Voice from the brand boards:

- Good food. Big vibes.
- Chop life, not stress.
- London’s Flavour Nation.

“Chop” is West African; the boards say London. Kitchen city is still unconfirmed (see open decisions). That choice sets currency, SMS, and payment provider.

---

## 2. Brand system (locked)

From the colour, type, logo, and pattern boards the client supplied.

### Colour

| Token | Hex | Role |
|---|---|---|
| Electric Lime | `#D8FF3E` | Energy / highlights |
| Hot Coral | `#FF4F5E` | Appetite / **calls to action** (buttons) |
| Ultraviolet | `#6C35FF` | Culture / digital |
| Sunburst Yellow | `#FFD23F` | Joy / emphasis (pills, deals) |
| Deep Midnight | `#11112B` | Primary text / backgrounds (~40%) |
| Warm Off-White | `#FFF8E8` | Primary light background (~30%) |
| Brights together | lime + coral + purple + yellow | ~30% — never all at once on one screen |

**Mapped UI (agreed and applied in `web/`):**

| Element | Colour | Why |
|---|---|---|
| Buttons (Book a table, Order, back-to-top) | Hot Coral `#FF4F5E` | CTAs |
| Header after scroll | Deep Midnight `#11112B` | Chrome / background, not a CTA |
| Scrollbar thumb | Hot Coral `#FF4F5E` | Small interactive accent (replaces old orange `#e5612f`) |

Do **not** paint the scrolled header coral. A full coral bar eats the bright budget and fights coral buttons.

### Type

| Role | Font | Use |
|---|---|---|
| Display / logo | Archivo Black | Heroes, logo wordmark. H1 spec 64pt |
| Headings | Space Grotesk Bold | Section titles. H2 spec 36pt |
| Body | Space Grotesk Regular | UI and paragraphs. 18pt |
| Accent | Permanent Marker | Slogans, stickers, “sold out” |

Headline style from the board: **GOOD FOOD. BIG VIBES.** — full stops, not a comma.

**Applied so far:** Archivo Black on the logo wordmark only. Nunito / Heebo / Pacifico still run the rest of the template.

### Logo

Official mark: yellow crown, three steam strokes (lime / coral / ultraviolet), coral bowl, **C** + **R**.

- Dark backgrounds: white C/R (`web/public/assets/brand/logo-mark.png`, transparent)
- Light backgrounds: midnight C/R (`web/public/assets/brand/logo-dark.png`)
- Wordmark: stacked **CHOP / REPUBLIC** in Archivo Black
- Tagline pill: **A FLAVOUR NATION** (footer copy only so far)

Do not redraw the mark in SVG. Use the supplied artwork.

### Patterns (not applied yet)

Hero Mix, Steam Rhythm, Crown Grid, Flavour Confetti, Midnight Mono, Reverse Mono. Use at 25–50% opacity, never as a full-page background behind body text.

---

## 3. Layout reference (not applied yet)

[FreshBox](https://freshbox.framer.website/) is the **structure / component** reference. Chop Republic stays the **brand**.

Copy section rhythm and component types. Do not clone their burgundy/orange, Tanker/Inter, stock photos, or the paid template pixel-for-pixel.

FreshBox cream `#fff7e8` is almost Warm Off-White `#FFF8E8` — keep that canvas.

### Homepage stack to steal later

1. Sticky nav + **Order now**
2. Hero: kicker + huge headline + food photo
3. Horizontal category chips
4. Deal cards with % badge
5. Featured dish cards + Add to cart
6. About + opening hours + stats
7. Why-us row
8. Testimonials
9. FAQ accordion
10. Gallery
11. Closing band: Hungry? We’re ready + Order now
12. Footer

Do not take from FreshBox: “Book your table” as the main button, blog as v1, their burger photography unless it is our food.

---

## 4. Hosting (agreed)

You cannot skip hosting. You can skip a VPS.

| Need | Product |
|---|---|
| Site | Cloudflare Pages (this React app) |
| API later | Workers / Pages Functions |
| Database later | D1 (SQLite) — enough for one kitchen |
| Photos later | R2 |
| Kitchen live feed | Poll every 3s in v1; Durable Objects later |
| Store hours / recap | Cron Triggers |
| Protect `/admin` | Cloudflare Access |
| Domain + SSL | Cloudflare DNS (domain TBD) |

**Stays off Cloudflare:** Paystack or Stripe, SMS/WhatsApp (Termii / Twilio), Google Maps if delivery is distance-based.

**Do not need Next.js.** The React Vite SPA on Pages is enough for the shopfront. Ordering is JS + Workers + D1.

shadcn/ui needs React + Tailwind. It does **not** drop into the current Bootstrap pages. Optional later for cart/checkout/admin — not required to take orders.

---

## 5. Repo layout

```
Restoran-master/                 ← original static template (legacy)
  index.html, about.html, menu.html, reservation.html, contact.html
  assets/
  HANDOFF.md                     ← this file
  web/                           ← THE working Chop Republic app
    package.json
    index.html
    public/
      _redirects                 ← SPA: /* → /index.html 200
      assets/css/style.css
      assets/images/
      assets/fonts/
      assets/brand/              ← CR logos
        logo-mark.png            ← white CR, transparent
        logo-dark.png            ← navy CR, transparent
        logo-mark.jpg            ← original on black (source)
        logo-lockup.jpg          ← full lockup reference
    src/
      App.jsx                    ← routes
      components/Header, Footer, Logo, Cart, SearchBar, Layout
      pages/Home, About, Menu, Reservation, Contact
      context/UiContext.jsx
      hooks/useTemplateEffects.js
```

**Work in `web/`.** Do not keep editing the root HTML as the product.

---

## 6. What we have done

### Product / process

- Confirmed: real business, one location, pickup + delivery, Cloudflare-only app hosting, look before backend
- Locked brand: Chop Republic, colour, type, logo, patterns
- Chose FreshBox as layout reference (not yet built)
- Chose React rebuild in a separate folder over painting the five HTML files
- Removed the 3-second Restoran splash screen (root HTML + React app has none)
- Agreed headline uses **full stops**: Good Food. Big Vibes.

### React app (`web/`)

- Full visual recreation of Restoran: Home, About, Menu, Reservation, Contact
- Shared header, footer, search overlay, cart drawer, mobile menu
- Sliders (Slick), AOS, Bootstrap 5 CSS — same look as the template
- Name: Chop Republic in header, footer, about, welcome line, document title
- Real CR logo in header (home = white mark, inner pages = navy mark; scrolled header uses white mark on midnight)
- Hero: “Good Food. Big Vibes.” plus client subcopy (FreshBox-style meal blurb)
- CSS tokens: coral primary, midnight scrolled header, coral scrollbar
- Cloudflare Pages config: `public/_redirects`, build instructions in `web/README.md`

### Original HTML (legacy)

- Loader removed from all five pages
- AOS 3s delay removed
- Not the product going forward

---

## 7. What the site still is (honest)

It **looks** like a restaurant site. It does **not** take orders.

| Surface | Status |
|---|---|
| Cart drawer | Opens/closes. Items are fake. Qty does nothing. Checkout goes nowhere |
| Menu | Hard-coded dishes. No add-to-cart |
| Reservation / contact forms | Do not submit |
| Search | Overlay only |
| “Book a table” | Still the hero CTA — should become **Order now** |
| Copy | Mix of Chop Republic and old Restoran/lorem (Kansas City, Fooday, USD, diner dish names) |
| Type | Logo is Archivo Black; body still Nunito/Heebo/Pacifico |
| FreshBox sections | Not built (no chips, deals, FAQ, closing CTA band) |

---

## 8. What we talked about but have not built

### Brand / UI

- Space Grotesk + Permanent Marker across the site
- Pattern system on heroes, footer, cards
- FreshBox homepage IA and components
- Change “Book a table” → “Order now”
- Drop or demote `/reservation` from primary nav
- Offers page vs Home deals section only
- shadcn/ui (optional; needs Tailwind)

### Ordering (the real product)

1. Real cart (`localStorage`) + add to cart on menu
2. `checkout` — name, phone, pickup vs delivery
3. D1 schema + API (`functions/` or Worker)
4. Kitchen `admin` page (poll 3s), Cloudflare Access
5. Paystack (or Stripe) + webhook → `paid`
6. Delivery: flat fee + allowed postcodes/areas (v1)
7. Customer SMS on paid / ready / out for delivery
8. Sold-out toggles, repeat last order, cron to close after hours

### Data model (planned, not in code)

```
menu_categories
menu_items        (price as integer pence/kobo, available flag, variants_json)
customers         (created on first order)
orders            (fulfillment pickup|delivery, status, fees, pay ref, rider_name)
order_items
order_status_log
settings          (hours, kitchen lat/lng, fees, closed flag)
```

Statuses: `placed → paid → confirmed → preparing → ready | out_for_delivery → completed` (+ `cancelled`).

Guest checkout with phone only in v1. No customer accounts yet.

---

## 9. Open decisions (must lock before backend)

| Topic | Recommendation | Status |
|---|---|---|
| Kitchen city | Brand says London; “chop life” is West African | **Unconfirmed** — sets GBP vs NGN, Stripe vs Paystack, Twilio vs Termii |
| Domain | New `.com` / `.co.uk` / `.ng` | TBD — use `*.pages.dev` until bought |
| Checkout | Guest + phone | Recommended, not confirmed |
| Delivery fee | Flat fee + allowed postcodes | Recommended, not confirmed |
| Table booking | Drop from v1 nav; Order is the product | Recommended, not confirmed |
| Menu complexity | Simple items + optional `variants_json` | Recommended |
| Offers | Home section first, not a separate page | Recommended |
| shadcn | Skip until checkout/admin if we want it | Optional |

**Payments rule:** Paystack if Nigeria/Ghana; Stripe if UK. Do not assume Paystack for a London-only shop.

---

## 10. What we will do next (agreed sequence)

Look until the shopfront is Chop Republic. Then ordering. Do not start Paystack before cart + D1 orders.

### Phase A — Finish the look (current)

1. Hero CTA: **Order now** → `/menu` (not Book a table)
2. Replace remaining Restoran/lorem copy (addresses, dish names, USD)
3. Type: Space Grotesk body/headings, Permanent Marker accents, Archivo Black display
4. FreshBox sections on Home: chips, deals, FAQ, midnight closing band
5. Warm off-white page canvas; coral CTAs; midnight footer
6. Optional: patterns at low opacity

### Phase B — Cart (still frontend)

1. Shared cart state
2. Add to cart from menu
3. Live drawer qty / subtotal
4. Checkout page (fields only, can `console.log` or POST later)

### Phase C — Backend on Cloudflare

1. D1 + schema + seed menu
2. Pages Functions / Worker: create order, list, status
3. Kitchen `admin.html` or `/admin` route, poll 3s
4. Paystack/Stripe + webhook
5. Delivery fee + postcodes
6. SMS
7. Cron: stop orders outside hours

### Phase D — Out of v1

- Multiple kitchens / marketplace
- Customer accounts, loyalty
- Rider app / live map
- Durable Objects WebSocket kitchen
- Stock counts (available toggle only)
- Blog

---

## 11. How to run and deploy

```bash
cd web
npm install
npm run dev          # http://localhost:5173
npm run build        # output: web/dist
```

**Cloudflare Pages**

- Root directory: `web`
- Build command: `npm run build`
- Output directory: `dist`

SPA routes work via `public/_redirects`: `/*    /index.html   200`

---

## 12. Key files to touch next

| Change | File |
|---|---|
| Hero / Home sections | `web/src/pages/HomePage.jsx` |
| Logo / header | `web/src/components/Logo.jsx`, `Header.jsx` |
| Brand CSS tokens | `web/public/assets/css/style.css` (`:root`), `web/src/index.css` |
| Logo assets | `web/public/assets/brand/` |
| Routes | `web/src/App.jsx` |
| Cart behaviour | `web/src/components/Cart.jsx`, `web/src/context/UiContext.jsx` |

---

## 13. One-line status

Chop Republic exists as a React site on the Restoran layout: real logo, coral CTAs, midnight scroll header, hero copy. It is **not** an ordering product yet. Next: finish the look (Order now + type + FreshBox sections), then cart, then Cloudflare D1/Workers/Paystack.
