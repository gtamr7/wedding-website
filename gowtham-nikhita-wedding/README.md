# Gowtham & Nikhita — Wedding Website

Full-stack wedding website for **Gowtham Ramesh & Nikhita Puvvada**, wedding **February 17, 2027** at Powel Crosley Estate, Sarasota FL.

Live site: TBD after Vercel deploy. See `DEPLOYMENT.md` for deploy instructions.

---

## Agent Quick-Start

> This section is for AI agents (Claude Code / OpenClaw) making updates. Read it before touching any file.

### Critical tech-stack gotchas

| Thing | What to know |
|---|---|
| **Next.js 16.2.9** | App Router only. `params` and `searchParams` in page components are **Promises** — always `await` them. Do NOT use Pages Router patterns. |
| **Tailwind CSS v4** | No `tailwind.config.js`. All config lives in `app/globals.css` inside `@theme {}`. Custom colors use `--color-*` prefix. Import is `@import "tailwindcss"` (not three separate directives). |
| **Framer Motion v12** | Use `motion.div`, `useInView`, `useScroll`, `useTransform`, `AnimatePresence` from `"framer-motion"`. |
| **React 19.2.4** | Server Components by default. Add `'use client'` to any component using hooks, browser APIs, or event handlers. |
| **Supabase client** | Use the factory `createSupabaseClient()` from `lib/supabase.ts` — never import a singleton. Call it inside the component/handler, not at module scope. |
| **AGENTS.md** | Always check `AGENTS.md` (referenced by `CLAUDE.md`) for project-level agent instructions before writing code. |

### Before making any change

1. Read `AGENTS.md` (required by `CLAUDE.md`)
2. Check the relevant component file — most logic is self-contained
3. Run `npm run dev` to test locally before claiming done
4. **Never commit `.env.local`** — it is gitignored

---

## Tech Stack

- **Framework:** Next.js 16.2.9 (App Router), TypeScript
- **Styling:** Tailwind CSS v4 (configured in `app/globals.css`)
- **Animation:** Framer Motion v12
- **Database / Realtime:** Supabase (PostgreSQL + Realtime pub/sub)
- **Fonts:** Cormorant Garamond (display) + Inter (body) via `next/font/google`
- **Deployment:** Vercel

---

## Color Palette & Design Tokens

Defined in `app/globals.css` `@theme {}` block. Use these class names:

| Token | Hex | Tailwind class |
|---|---|---|
| Olive dark | `#4A5C2F` | `bg-olive-dark`, `text-olive-dark` |
| Olive mid | `#6B7D4A` | `bg-olive-mid`, `text-olive-mid` |
| Olive light | `#E6EBD8` | `bg-olive-light`, `text-olive-light` |
| Ivory | `#FDFCF8` | `bg-ivory`, `text-ivory` |
| Gold | `#B8972A` | `bg-gold`, `text-gold` |
| Gold light | `#D4B84A` | `bg-gold-light`, `text-gold-light` |
| Charcoal | `#1C1C1A` | `bg-charcoal`, `text-charcoal` |
| Muted | `#8A9080` | `bg-muted`, `text-muted` |

Custom utilities: `.gold-divider`, `.section-py`, `animate-pulse-gold`, `animate-float`.

---

## Project Structure

```
app/
  layout.tsx              # Root layout — loads fonts, sets metadata
  page.tsx                # Home page (Hero + OurStory + Schedule + Travel + Registry + feature links)
  globals.css             # Tailwind v4 theme + global styles
  photos/
    page.tsx              # Guest photo-order view (Server Component, fetches initial index)
    admin/
      page.tsx            # Admin photo-order view
  bets/
    page.tsx              # Wedding bets board (guest view)
    admin/
      page.tsx            # Admin bets view
  guestbook/
    page.tsx              # Guestbook wall (Server Component, fetches initial entries)
  api/
    admin/
      verify/
        route.ts          # POST — PIN verification (reads PHOTO_ADMIN_PIN / BETS_ADMIN_PIN env vars)

components/
  Nav.tsx                 # Sticky nav — transparent on hero, solid on scroll/sub-pages
  Hero.tsx                # Parallax hero with names + countdown
  Countdown.tsx           # Flip-digit countdown to Feb 17, 2027 10:00 AM EST
  BotanicalSvg.tsx        # Olive leaf SVG decorations
  OurStory.tsx            # Our Story section (wraps Timeline)
  Timeline.tsx            # 5-milestone animated timeline (2019–2027)
  Schedule.tsx            # Three event cards (Sangeet / Muhurtham / Reception)
  Travel.tsx              # Venue map + airports + hotels + weather note
  Registry.tsx            # Link to Zola registry
  Footer.tsx              # Footer with names + date
  PhotoOrder/
    GuestView.tsx         # Realtime photo-order display for guests
    AdminView.tsx         # PIN-gated admin panel to advance photo groups
    GroupCard.tsx         # Individual group card (NOW/NEXT/DONE/upcoming states)
  Bets/
    BetBoard.tsx          # Main bets UI — tabs for bets + leaderboard
    Leaderboard.tsx       # Leaderboard builder (buildLeaderboardFixed export)
    AdminBets.tsx         # PIN-gated admin to set bet results
  Guestbook/
    GuestbookWall.tsx     # Masonry wall of guestbook entries + submit form

lib/
  supabase.ts             # createSupabaseClient() factory
  types.ts                # Shared TypeScript interfaces
  photoGroups.ts          # PHOTO_GROUPS array (12 groups, index 0–11)

supabase/
  schema.sql              # Full DB schema + seed data — run once in Supabase SQL editor

DEPLOYMENT.md             # Step-by-step deploy guide (Supabase → Vercel → custom domain)
```

---

## Database Schema

Four tables in Supabase (see `supabase/schema.sql` for full DDL + seed):

### `photo_order`
Single row (`id = 'wedding'`). `current_index` (0–11) controls which photo group is active. Updated by admin; broadcast via Realtime to all guest devices.

### `bets`
19 seeded rows — 9 over/unders + 10 props. Fields: `category`, `question`, `option_a/b`, `option_a/b_line`, `result` (`'a'` | `'b'` | `null`), `active`, `sort_order`.

### `bet_picks`
One row per guest per bet. Unique index on `(bet_id, guest_name)`. Fields: `bet_id`, `guest_name`, `pick` (`'a'` | `'b'`).

### `guestbook`
Free-text entries. Fields: `name`, `message`, `visible` (bool, default true), `created_at`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `PHOTO_ADMIN_PIN` | Yes | 4-digit PIN for photo admin |
| `BETS_ADMIN_PIN` | Yes | 4-digit PIN for bets admin |

- `NEXT_PUBLIC_*` vars are exposed to the browser. The PIN vars are **server-only** (no `NEXT_PUBLIC_` prefix) — they're only read in `app/api/admin/verify/route.ts`.
- Local dev: copy `.env.local` and fill in real values. See `DEPLOYMENT.md`.
- Vercel: add all four in Project → Settings → Environment Variables.

---

## Pages & Features

### Home (`/`)
Sections (in order): Hero → Our Story → Schedule → Travel → Registry → Feature Links footer.
All sections are anchor-linked from the nav (`#story`, `#schedule`, `#travel`, `#registry`).

### Photo Order (`/photos`)
Real-time display of which photo group is currently being photographed. Guest view auto-scrolls and shows NOW/NEXT/DONE badges. Connects to Supabase Realtime on `photo_order` table.

### Photo Admin (`/photos/admin`)
PIN-gated (env var `PHOTO_ADMIN_PIN`). Advance/retreat through 12 photo groups. Session auth stored in `sessionStorage` key `photoAdminAuth`.

### Wedding Bets (`/bets`)
Guest picks over/under and prop bets. Guest name persisted in `localStorage` key `weddingGuestName`. Optimistic UI. Tabs: Bets | Leaderboard.

### Bets Admin (`/bets/admin`)
PIN-gated (`BETS_ADMIN_PIN`). Set/clear results per bet, toggle active/inactive, view leaderboard. Session auth in `sessionStorage` key `betsAdminAuth`.

### Guestbook (`/guestbook`)
Masonry wall. Server-renders existing entries; new entries prepended optimistically on submit.

---

## Updating Content

### Change wedding date/time
`components/Countdown.tsx` line ~5: `new Date('2027-02-17T10:00:00-05:00')`

### Change venue or schedule details
`components/Schedule.tsx` — three event card objects near the top.
`components/Travel.tsx` — Google Maps embed src, airport list, hotel list.

### Add/remove photo groups
`lib/photoGroups.ts` — edit the `PHOTO_GROUPS` array. Keep indices contiguous starting at 0.

### Add/edit bets
Run new SQL against the `bets` table in Supabase dashboard, or edit `supabase/schema.sql` for a fresh deploy.

### Change registry link
`components/Registry.tsx` — update the `href` on the Zola link.

### Change color palette
`app/globals.css` `@theme {}` block — update `--color-*` variables.

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env file and fill in Supabase credentials
# (get URL + anon key from supabase.com → project → Settings → API)
cp .env.local.example .env.local   # or edit .env.local directly

# Run dev server
npm run dev
# → http://localhost:3000
```

Photos and Bets features require a live Supabase project. Guestbook, nav, and all static sections work without one.

---

## Deployment

See `DEPLOYMENT.md` for the full 7-step guide.

Short version:
1. Create Supabase project → run `supabase/schema.sql` → enable Realtime on `photo_order`
2. Push this repo to GitHub
3. Import to Vercel → add four env vars → Deploy
4. (Optional) Add custom domain

---

## Admin URLs (day-of reference)

| Page | Path |
|---|---|
| Photo Order (guests) | `/photos` |
| Photo Order (admin) | `/photos/admin` |
| Bets (guests) | `/bets` |
| Bets (admin) | `/bets/admin` |
| Guestbook | `/guestbook` |
