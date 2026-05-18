# JV Eagle Roofing & Waterproofing — pitch site

A demo marketing site for [JV Eagle Roofing & Waterproofing](https://jveagleroofingandwaterproofing.com/) built to pitch a redesign to the owner.

Live preview: see Vercel deployment URL.

## What's in the box

- **Next.js 16** + **Tailwind 4** + **TypeScript** (App Router, Turbopack).
- All copy scraped from the live site; reviews are illustrative placeholders.
- Real photos pulled from the live site for hero/gallery.

## Client-facing customizer

Floating "Customize" button (bottom-right of every page) lets the client toggle:

| Section        | Options                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| **Theme**      | Navy & Gold · Bold Crimson · Coastal Teal · Dark Pro                    |
| **Layout**     | Classic · Centered Editorial · Magazine (full-bleed) · Bento Grid       |
| **Typography** | Modern Sans (Inter) · Editorial Serif (Playfair) · Industrial (JetBrains Mono) · Friendly Rounded (DM Sans) |
| **Logo**       | 8 variants. 3 are silver/chrome "DARK ONLY" — fall back to Original on light themes. |

State persists in `localStorage` per visitor.

## Local dev

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project layout

```
app/                     # routes (App Router)
  layout.tsx             # root shell, registers fonts and SiteProvider
  page.tsx               # homepage (Hero component handles layout switch)
  about/services/reviews/faq/contact/
components/
  site-provider.tsx      # theme/layout/typography/logo state + localStorage
  picker.tsx             # floating customizer panel
  hero.tsx               # 4 hero variants
  nav.tsx · footer.tsx
lib/
  themes.ts · layouts.ts · typography.ts · logos.tsx
  content.ts             # all copy
public/
  logos/                 # 8 logo variants (transparent PNGs + JPEG)
  hero/                  # roof photography
```

## No backend (yet)

This is intentionally static. The contact form posts to `mailto:`. If the client signs:

- Wire `app/contact/page.tsx` to a Supabase `contact_submissions` table.
- Add an email notification via Resend or similar.
