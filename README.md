# NCSS website

The official website of NCSS (NUML Computer Science Society), National University of Modern Languages, Islamabad.

Built with Next.js (App Router), TypeScript and Tailwind CSS, deployed on Vercel. There is no server of our own:
content, the admin login and uploaded photos live in [Supabase](https://supabase.com) (a hosted service with a free plan),
and the site pages are pre-built and refreshed automatically when the admin saves a change.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (run this before you push)
```

Until Supabase is connected, the site shows the starter content from the `data/` folder.

## Admin panel setup (one time)

The admin panel lives at **`/admin`** (for example `https://your-site.vercel.app/admin`).
It is not linked anywhere on the website and asks search engines not to list it. Only one email can create the admin account.

1. **Create a Supabase project.** Sign up at [supabase.com](https://supabase.com), click *New project*, pick any name and a strong database password, and choose the region closest to Pakistan (for example *Singapore* or *Mumbai*).
2. **Set the admin email.** Open `supabase/setup.sql` in this project. Near the top, replace `CHANGE-ME@example.com` with the official admin email.
3. **Run the setup.** In Supabase open *SQL Editor* → *New query*, paste the whole `supabase/setup.sql` file and press *Run*. It creates the content table, the image storage and the rule that only the admin email can sign up and make changes.
4. **Copy the two keys.** In Supabase open *Project Settings* → *API* (Data API). Copy the *Project URL* and the *anon public* key (or the *publishable* key).
   - For your computer: copy `.env.example` to a new file called `.env.local` and paste both values there. Restart `npm run dev`.
   - For Vercel: open your project → *Settings* → *Environment Variables*, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the same values, then redeploy.
5. **Allow the login links.** In Supabase open *Authentication* → *URL Configuration*:
   - *Site URL*: your website address, for example `https://your-site.vercel.app`
   - *Redirect URLs*: add `https://your-site.vercel.app/admin` and `http://localhost:3000/admin`
6. **Create the admin account.** Open `/admin`, choose *Create account*, and sign up with the admin email and a password (at least 8 characters). Open the confirmation email, click the link, then sign in.

To change the admin email later, change it in `supabase/setup.sql` and run the file again.

## Using the admin panel

The menu on the left has six sections. Every change stays on your screen until you press **Save & publish**.
After saving, refresh the website to see it (it can take a few seconds).

| Section | What you can change |
|---|---|
| Site & home page | Society name, tagline, email, Instagram, extra contact cards (WhatsApp, phone, LinkedIn…), logo, hero photo, current cabinet year, and the heading and text of every home page section (including the "What we do" cards) |
| Leadership & members | Add, edit, delete and reorder person cards: name, photo, role (President, Vice President, Other leadership, Team Lead, Member), the title shown on the card (e.g. General Secretary, Co-lead), team, year and social links |
| Teams | Team name, descriptions, colour, tile photo, and the order of the tiles |
| Events | Add, edit or delete events: details, cover photo and the photo gallery (you can upload several photos at once) |
| Sponsors | Logo, name, website, every sponsorship (event, year, type) and the feedback quote |
| Alumni | Past cabinets with as many people as needed (leadership, other posts, team leads), plus a one-click yearly handover |

Tips:

- **Photos:** use *Upload image* on any photo field. Replaced or removed photos are deleted from storage after you save.
- **Adding cards:** every list has a **+ Add new …** button, and every new card shows on the website after you save. There is no fixed number of cards anywhere.
- **Leadership cards:** President, Vice President and every person with role *Other leadership* appear in the Leadership section. Set *Title on the card* (e.g. General Secretary).
- **Team membership:** a team shows everyone with role *Team Lead* in that team first (so co-leads work), then everyone with role *Member*.
- **Card order:** use ↑ ↓ in Leadership & members (works with the team filter too).
- **Only the current cabinet shows on the site:** people whose *Cabinet year* matches the *Current cabinet year* in *Site & home page*.
- **The first save of a section** takes over the starter content for that section. Until then, the admin panel shows the starter content and a note at the top.

### Yearly handover (moving a cabinet into alumni)

1. Open **Alumni** and press **Add current cabinet to Alumni**, then **Save & publish**. This copies the President, Vice President, other leadership and every Team Lead of the current year.
2. Open **Site & home page**, change *Current cabinet year* (for example to `2027-28`) and save.
3. Open **Leadership & members** and add the new cabinet with the new year. Delete the old members if you like; their alumni cards keep their photos.

## Where things live (for developers)

| What | Where |
|---|---|
| Starter content | `data/` (site.ts, teams.ts, members.ts, alumni.ts, sponsors.ts, events.ts) |
| Content types | `types/index.ts` |
| Loading content (Supabase first, then starter content) | `lib/content.ts` and `lib/data.ts` |
| Admin panel | `app/admin/`, `components/admin/` and `lib/admin/` (`lib/admin/schema.ts` describes every form) |
| Page refresh after a save | `app/api/revalidate/route.ts` |
| Supabase setup | `supabase/setup.sql` |
| Colours and fonts | `app/globals.css` (colour tokens) and `app/layout.tsx` (fonts) |

Pages refresh on their own every 5 minutes too, and right away after every save from the admin panel.

To add a new editable field: add it to the type in `types/index.ts`, show it in a component, and add it to the section's `fields` in `lib/admin/schema.ts`. The form is built from that list.

## Without the admin panel

The starter content in `data/` can still be edited by hand (useful before Supabase is set up). Images for it go in `public/`:

```
public/brand/logo.png                    the logo
public/images/hero/team.jpg              the big group photo (also the link preview image)
public/images/people/<person-id>.jpg     one photo per person
public/images/teams/<team-slug>.jpg      background photo for each team tile (landscape)
public/images/events/<event-slug>/       cover.jpg plus 1.jpg, 2.jpg, ...
public/images/sponsors/<sponsor-id>.png  sponsor logos
```

Everything marked `// TODO` in `data/` is placeholder content. Once a section is saved from the admin panel, the admin panel's version is used instead of the file.

- **Member:** add a line to `data/members.ts` with a unique `id`, `name`, `role`, `teamSlug` (for leads and members), `year`, and optionally `photo` and `socials`.
- **Event:** copy an event block in `data/events.ts` and change it. `date` looks like `"2027-02-20"`; `ourRole` is `"Organized"` or `"Managed"`.
- **Sponsor:** copy a block in `data/sponsors.ts`. Each sponsorship's `eventSlug` must match an event's `slug` to link to it.
- **Logo:** replace `public/brand/logo.png`, update `width` and `height` in `data/site.ts`, then run `npm run icons`.

Run `npm run build` after editing to catch typos.

## Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run the site locally |
| `npm run build` | Build and check for errors |
| `npm run icons` | Rebuild the favicon and app icons from `public/brand/logo.png` |
| `npm run placeholders` | Create placeholder images for any image path in `data/` that has no file yet (never overwrites real photos) |
