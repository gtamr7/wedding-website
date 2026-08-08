# Gowtham & Nikhita — Wedding Website

Wedding site for **Gowtham Ramesh & Nikhita Puvvada**, **February 17–18, 2027**.

Live at **[gowthamandnikhita.com](https://www.gowthamandnikhita.com)** · deployed from `main` on Vercel.

> **This repository is public.** Never commit PINs, the Supabase service role key, guest
> names, phone numbers, or anything else guests told us in confidence. Secrets belong in
> `.env.local` (gitignored) and in Vercel's environment variables. `.env.local.example`
> lists the variable names without values.

---

## ⚠️ Current state — read this first

**As of 8 August 2026 the site is in a holding pattern.** The original venue fell through
and the replacement is undecided, so two things are deliberately switched off.

### 1. The venue is unset and unnamed anywhere on the site

`lib/wedding.ts` is the single source of truth for the venue and the dates.
`VENUE.announced` is `false`, so:

- Every surface that would name a venue shows **"Venue to be announced"**
- The **Travel** section renders a short placeholder instead of its normal content —
  its airports, hotels and venue photos are all city-specific and are still in
  `components/Travel.tsx` waiting to be rewritten
- **Calendar invites carry no address at all.** This is on purpose: a calendar entry
  with a stale address outlives the announcement in someone's phone, and there is no
  way to reach it once downloaded

> Guests who added the events to their calendar **before** August 2026 still have the old
> venue saved. That cannot be fixed from here — any announcement has to tell them to
> delete and re-add.

### 2. RSVPs are closed, in two independent layers

| Layer | Where | Effect |
|---|---|---|
| UI | `RSVP_PAUSED` in `lib/wedding.ts` | `/rsvp` shows a notice instead of the form — no name field at all |
| API | `guest_parties.on_hold = true` on **all** rows | A request made directly to the API is refused |

Both exist so that bypassing the interface does not get you a submission. **Reopening
requires clearing both.**

**Existing responses were kept, not wiped** — 24 parties, 58 rows, 54 people attending.
Dietary notes, contact details and hotel answers are all intact.

> **The collected hotel answers are unreliable for sizing a room block.** 14 of 24 parties
> asked for a room, but they answered when the wedding was a destination event in Florida.
> Nearly the whole guest list has Atlanta area codes, so an Atlanta venue turns this into a
> local wedding and most of those answers would flip. Treat them as stale until guests
> re-confirm.

---

## What needs to happen next

### When the venue is decided

1. **Fill in `lib/wedding.ts`** — set `VENUE.name`, `street`, `city`, `state`,
   `postalCode`, then set `announced: true`. That is the only edit needed for the venue
   to appear across the whole site, including calendar invites.
2. **Rewrite the three arrays at the top of `components/Travel.tsx`** —
   `venuePhotos`, `airports`, `hotels`. These are the only hand-written city-specific
   content left. Replace `public/venue-*.jpg` with photos of the new venue.
3. **Revisit `DATES`** in `lib/wedding.ts` if the dates moved. The countdown
   (`components/Countdown.tsx`), the per-event calendar timestamps in
   `components/Schedule.tsx` and `components/RSVP/RsvpForm.tsx`, and the wedding-day
   trigger in `components/PhotoOrder/GuestView.tsx` all carry their own hardcoded
   date values and are **not** yet driven by the config.

### To reopen RSVPs

1. Set `RSVP_PAUSED = false` in `lib/wedding.ts`
2. Clear the database holds — **but not for everyone.** Three parties were on hold for
   their own unrelated reasons before the global pause and must stay held. Their party
   IDs are recorded outside this repo; ask Gowtham before clearing, because a blanket
   `on_hold = false` will silently let those three through.
3. Re-check the RSVP deadline in `components/RSVP/RsvpForm.tsx` — `RSVP_CLOSE_DATE` is
   currently **6 October 2026**, which may no longer make sense depending on when the
   venue lands and how much travel notice guests need.
4. Ask the 24 parties who already replied to revisit. **No wipe is needed** — the
   already-RSVP'd screen prefills their previous answers, so they adjust in place and
   dietary notes survive.

### Still outstanding, unrelated to the venue

- **`supabase/run-this-in-dashboard.sql` is untracked and unreviewed.** Work out whether
  it is a pending migration or a leftover, then commit or delete it.
- **No database backups.** Supabase's free tier does not include them. The guest list has
  been rebuilt once and hand-corrected many times since; none of that lives in git.
- **Admin PINs are 4–5 digits with no rate limiting.** Fine while nobody is looking, but
  it is the only thing protecting guest contact details.

---

## How it works

### Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion v12 · Supabase
(Postgres + Realtime) · ExcelJS · deployed on Vercel.

### Tech gotchas

| Thing | What to know |
|---|---|
| **Next.js 16** | App Router only. `params` / `searchParams` are **Promises** — `await` them. Read the bundled docs in `node_modules/next/dist/docs/` before writing route or page code; this version differs from older Next.js. |
| **Tailwind v4** | No `tailwind.config.js`. Theme lives in `app/globals.css` under `@theme {}`, colours as `--color-*`. |
| **React 19** | Server Components by default. `'use client'` for anything with hooks, browser APIs or handlers. |
| **Supabase client** | Use `createSupabaseClient()` from `lib/supabase.ts` inside the component or handler — never a module-scope singleton. |
| **`AGENTS.md`** | Referenced by `CLAUDE.md`. Read it before writing code. |

### Palette

Defined in `app/globals.css`. Olive dark `#4A5C2F` · olive mid `#6B7D4A` ·
olive light `#E6EBD8` · ivory `#FDFCF8` · gold `#B8972A` · gold light `#D4B84A` ·
charcoal `#1C1C1A`.

> **Watch inherited text colour.** Several pages set `text-ivory` high in the tree.
> A cell or block that does not set its own colour will inherit ivory and render
> invisible on the ivory background. This has happened once already, in the RSVP
> admin's Hotel column, where the data was correct but unreadable for days.

---

## Routes

### Guest-facing

| Route | What it is |
|---|---|
| `/` | Hero, Our Story, Schedule, Travel, Registry |
| `/rsvp` | RSVP flow — **currently a paused notice** |
| `/faq` | Parking, hotel, outfit shops, schedule |
| `/photos` | Photo line-up — goes live on the wedding day |
| `/bets` | Wedding bets board |
| `/guestbook` | Guestbook wall — behind a shared password, posts are moderated |
| `/checklist` | Per-guest checklist, looked up by name |
| `/privacy`, `/terms` | Legal pages, no longer linked from the footer |

### Admin — all PIN-gated, all `noindex`

| Route | Purpose |
|---|---|
| `/rsvp/admin` | Responses, stats, hotel filter, Excel export |
| `/rsvp/admin/seating` | Drag-and-drop reception seating |
| `/photos/admin` | Advance the photo line-up on the day |
| `/bets/admin` | Set bet results |
| `/guestbook/admin` | Approve or remove guestbook posts |

PINs are separate per area and live in environment variables — see
`.env.local.example` for the names. **They are not written down in this repo.**

---

## Data model

Supabase Postgres. The RSVP tables are the ones that matter.

| Table | Rows | Purpose |
|---|---|---|
| `guest_parties` | 131 | One row per household. Carries `on_hold` and `table_number`. |
| `guest_list` | 256 | One row per guest, linked to a party. Name, phone, email. |
| `rsvp_responses` | 58 | One row per guest per submission. |
| `guestbook` | 0 | Posts, held until `visible = true`. |
| `bets`, `bet_picks` | 16, 16 | Bets board. |
| `photo_order` | 1 | Single row driving the live photo line-up. |
| `rsvps` | 1 | **Legacy and dead.** Nothing writes to it. Do not read from it. |

### Three things that will bite you

**1. Lookup is an exact match on first + last name.** A guest whose name is spelled
differently in the database than how they type it gets *"we don't see that name on our
list"* — which reads as "you weren't invited." Several guests have already hit this.
The fix is always to correct the database, never to ask the guest to guess.

Two related traps:
- The importer splits names on the **first space**, so anyone with a two-word given name
  is stored with half of it in the surname and has to be corrected by hand. Several
  guests on the list are affected; expect more on any future import.
- Last name is **optional** — nine guests go by a single name. The label no longer says
  so, but the field still accepts blank and matches against guests who have no last name.

**2. `submit_rsvp` deletes and reinserts a party's rows on every edit.** It runs under an
advisory lock so two people submitting at once cannot clobber each other, and it issues a
**new `submission_id` each time**. Anything that needs to survive an edit must therefore
key on `party_id`, not `submission_id`, and must live on `guest_parties` rather than
`rsvp_responses`. This is why `table_number` sits where it does.

**3. Supabase is the source of truth for guests — not this repo, and not any
spreadsheet.** The master CSV in the owner's Downloads is a stale snapshot, and Zola holds
a one-time export used only for texting. Apply guest changes directly to the database.

---

## Security posture

- **Row-level security** blocks anonymous reads of `rsvp_responses`, `guest_list` and
  `guest_parties`. Verified: the public anon key returns zero rows.
- **Photo line-up writes** go through `/api/admin/photo-order` behind the PIN. Anonymous
  writes were revoked in `supabase/photo-order-lock.sql`. Read access stays open on
  purpose — the guest view's realtime subscription rides on it.
- **Guestbook posts** are created server-side via `/api/guestbook/submit` so the browser
  cannot publish its own message. One gap remains: RLS still permits an anonymous insert
  with `visible = true`, so a determined person could post straight to the wall.
- **Guest photos** are compressed in the browser before upload (~29 MB → ~430 KB). This
  is what keeps the 1 GB free-tier storage from filling mid-reception.

---

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in the real values
npm run dev                        # http://localhost:3000
```

`.env.local` needs the Supabase URL, anon key and service role key, plus the four admin
PINs. Ask Gowtham — they are not in this repo.

```bash
npm run build     # always run before pushing
npx tsc --noEmit  # type check
```

### Database migrations

SQL in `supabase/` is applied by hand in the Supabase SQL editor — there is no migration
runner. Each file says what it does and is safe to re-run.

| File | What it does |
|---|---|
| `schema.sql` | Original schema and seed |
| `rsvp-v2-migration.sql` | Party-based RSVP tables |
| `rsvp-atomic-submit.sql` | The `submit_rsvp` function |
| `seating-table-number.sql` | `guest_parties.table_number` |
| `party-hold.sql` | `guest_parties.on_hold` |
| `photo-order-lock.sql` | Revokes anonymous writes to `photo_order` |
| `run-this-in-dashboard.sql` | **Unreviewed — see outstanding items above** |

---

## Deploying

Push to `main`; Vercel builds and deploys automatically.

**Environment variables are baked in at build time.** Adding one in Vercel does nothing
until the next deploy — a new variable needs a manual redeploy to take effect.

After anything that matters, check the live site rather than assuming. A deploy has
silently failed to trigger at least once.
