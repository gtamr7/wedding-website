# Deployment Guide — Gowtham & Nikhita Wedding Site

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New project (free tier)
2. Name it `gowtham-nikhita-wedding`
3. Copy your **Project URL** and **anon public key** from Settings → API

## 2. Run the Database Schema

1. In Supabase dashboard → SQL Editor
2. Paste the contents of `/supabase/schema.sql`
3. Click Run

## 3. Enable Realtime on photo_order

1. Supabase dashboard → Database → Replication
2. Find `photo_order` table → toggle on **"Enable Realtime"**

This allows live photo group updates to broadcast to all guest devices instantly.

## 4. Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
PHOTO_ADMIN_PIN=1234
BETS_ADMIN_PIN=5678
RSVP_ADMIN_PIN=9012
```

> **Security note:** `PHOTO_ADMIN_PIN`, `BETS_ADMIN_PIN`, and `RSVP_ADMIN_PIN` are server-only env vars (no `NEXT_PUBLIC_` prefix).
> They never reach the client — only the API route at `/api/admin/verify` reads them.
> Choose a 4-digit PIN you'll remember on the wedding day.

## 5. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and check:
- [ ] Hero loads with countdown timer
- [ ] Nav links work (scroll to sections, navigate to /photos, /bets, /guestbook)
- [ ] `/photos` shows photo groups
- [ ] `/photos/admin` PIN gate works
- [ ] `/bets` loads (shows loading spinner without Supabase)
- [ ] `/guestbook` loads

## 6. Deploy to Vercel

1. Push code to GitHub (create a new private repo)
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `PHOTO_ADMIN_PIN`
   - `BETS_ADMIN_PIN`
4. Click **Deploy**

## 7. Custom Domain (Optional, ~$15/yr)

1. Buy a domain from Namecheap or Squarespace Domains (e.g., `gowthamandnikhita.com`)
2. In Vercel → Project → Settings → Domains → Add domain
3. Follow Vercel's DNS instructions

## Day-of Checklist

- [ ] Coordinator has `/photos/admin` URL saved (or QR code)
- [ ] Coordinator PIN confirmed working
- [ ] `/bets` URL shared with guests before wedding
- [ ] Test realtime: open `/photos` on two devices, advance group in admin, verify both update
- [ ] Guestbook working (post a test entry)

## Admin URLs

| Page | URL |
|------|-----|
| Photo Order (guests) | `yourdomain.com/photos` |
| Photo Order (admin)  | `yourdomain.com/photos/admin` |
| Bets (guests)        | `yourdomain.com/bets` |
| Bets (admin)         | `yourdomain.com/bets/admin` |
| RSVP (guests)        | `yourdomain.com/rsvp` |
| RSVP (admin)         | `yourdomain.com/rsvp/admin` |
| Guestbook            | `yourdomain.com/guestbook` |
