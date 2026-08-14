# UI Review — Nhà Nhiệt Đới

Reviewed on the running dev server (Astro 5.14, `npm run dev`) at 1440×900, 820×1080 and 390×844.
`astro check` is clean: 0 errors, 0 warnings.

---

## P0 — Broken in production

### 1. Floating contact panel is permanently expanded on every page

The four pills (GỌI ĐIỆN / ZALO / MESSENGER / EMAIL) are visible and clickable on load, on
every page and every viewport. They sit `fixed … z-40` over the content: on mobile they cover
the right column of the project grid, on `/contact` they cover the CTA, in the footer they cut
off the "Facebook" link.

**Cause** — `src/components/layout/ContactButtons.astro:63`. The explanatory comment contains
`peer-*/group-*`. The `*/` inside it closes the CSS comment early:

```
/*  … Tailwind 4 bọc peer-*/          ← comment ends HERE
group-* trong :where() … khai báo.
  */
  .contact-panel { visibility: hidden; … }   ← swallowed as part of the garbage rule
```

Verified in the browser — the compiled stylesheet contains
`.contact-fab[data-open] .contact-panel { … }` but **not** the base `.contact-panel` hidden
state. Computed style on load: `visibility: visible; opacity: 1; pointer-events: auto`.

**Fix** — remove the `*/` sequence from the comment text, e.g. write `peer-* / group-*` or
"biến thể peer và group". One-character class of change; the rest of the component is correct.

### 2. Mobile menu breaks on pages that have a hero (`/` and `/projects/[slug]`)

Opening the menu on the homepage produces:

- the logo rendered **white on the paper overlay** — effectively invisible;
- the header's "Menu" label (white) and the overlay's "Đóng" label (dark) painted **at identical
  coordinates**, overlapping into an unreadable glyph soup;
- the hero scrim gradient still darkening the top of the overlay.

**Cause** — the overlay is `fixed inset-0 bg-paper` but the header bar div comes *after* it in
`Header.astro`, so the bar paints on top; and `data-over-hero` is still set, so that bar is still
in white-text mode. Both labels resolve to the same box: overlay `absolute top-2.5 right-3 h-11`
vs. bar `px-5 py-2.5` + `-mr-2 h-11`.

**Fix** — force the header out of over-hero styling while the menu is open (the `:has()` rule for
body scroll-lock is already there, so `body:has(#nav-toggle:checked) [data-site-header]` is the
natural hook), and drop the duplicate label — one toggle that swaps its text is enough.

---

## P1 — Layout

### 3. The project grid always ends with an empty cell

11 projects into `grid-cols-2 / sm:3 / md:4 / lg:6` leaves a hole at **every** breakpoint
(2→1 short, 3→1, 4→1, 6→1). Clearly visible as a grey void on `/projects` at all sizes.

The homepage's tail tile would have filled it, but `WALL_LIMIT = 35` in `src/pages/index.astro:15`
is larger than the 11 projects, so `hasMore` is false and the tile never renders. The comment
above it ("35 ô dự án + 1 ô … = 6 hàng tròn trịa") describes a 36-project set that doesn't exist.

**Fix** — render the tail tile unconditionally (on `/` link to `/projects`, on `/projects` link to
`/contact`), or derive the column count from `projects.length`.

### 4. The project detail page has four different alignment anchors

Down one page: hero title flush-left → excerpt flush-left in `md:col-span-6` → spec table
right-aligned in `md:col-start-8` → MDX body **centred** in `max-w-[62ch] mx-auto` → gallery
mixing full-bleed and centred `max-w-4xl`. Nothing lines up with anything above it.

Pick one measure. The centred prose column is the odd one out — everything else on the site is
flush-left off `px-5 / md:px-10`.

### 5. Spec table leaves a large void

`SpecTable` renders 4 rows for most projects (6 max) in a `sm:grid-cols-2` layout, next to a much
taller excerpt. At 1440px the entire right half below the table is empty. A single column, or
letting the excerpt span wider, reads better at this row count.

### 6. `/about` three-column band is unbalanced

Dịch vụ (4 items) / Hạng mục (8) / Quy trình (4). Hạng mục is roughly twice as tall, and because
the band uses `gap-px bg-line`, the dividers run the full height — so the short columns read as
broken rather than airy.

---

## P2 — Accessibility & polish

### 7. `--color-muted` fails WCAG AA

`#7c786e` on `#f4f3f0` = **3.97:1**, below the 4.5:1 required for normal text. It is the colour of
the `.label` class (11px) — used for every eyebrow, spec-table label, figcaption, press outlet and
date — plus the 12px footer copyright. On `--color-paper-deep` it drops to 3.56:1.

**Recommended** — `#69665e`: 5.17:1 on paper, 4.64:1 on paper-deep, same warm-grey hue. One token
change in `src/styles/global.css:13`.

Other tokens are fine: `ink-soft` 10.55:1, `ink` 16.62:1, `accent` 5.29:1.

### 8. Filter chips on `/projects`

- The count runs straight into the label with no separator: `NHÀ PHỐ 8`, and worse
  `CĂN HỘ | PENTHOUSE 1` — the pipe plus a trailing digit is hard to parse.
- On mobile the bar wraps to three ragged rows. A single horizontally-scrollable row is the
  usual pattern here.
- Three of the five filters return exactly one project, so the bar mostly promises more
  navigation than it delivers. Worth hiding filters below a threshold, or merging thin categories.

### 9. `/contact` duplicates itself

The page is `h1 "Liên hệ"` + contact rows, and directly beneath it the footer renders another
"Liên hệ" heading with the same email and phone — and that heading links to `/contact`, the page
you are already on. `BaseLayout` already has a `showFooter` prop for exactly this; it is defined
but never passed as `false` anywhere.

### 10. Duplicated values in the contact list

`Điện thoại` and `Zalo` both display `0964 990 168`; Facebook and YouTube both display
"Xem trang". Showing the handle (or dropping the redundant Zalo row, since the FAB covers it)
would carry more information in the same space.

### 11. Above-the-fold images load lazily

`eagerCount={4}` but the first row is 6 tiles at `lg:grid-cols-6`, so tiles 5 and 6 are lazy while
fully in view. Match the eager count to the widest breakpoint's first row.

### 12. Dead code

- `--color-accent: #8a5a2b` (`global.css:15`) — defined, never referenced.
- `CtaLink` variants `light-solid` and `light-outline` — defined, never used (no CTA currently
  sits on a dark image).

### 13. Desktop grid carries no labels until hover

Deliberate per the component comment, and the hover treatment itself is well done. Flagging it
only because the 11 covers are visually similar interior renders, so the wall is hard to scan
without them. Mobile (`max-md:opacity-100`) is better off here than desktop.

---

## Content blockers — not UI bugs, but they dominate every screen

These are already marked `# TẠM` in the source, listing them so they're not lost:

- All 11 projects are placeholders: titles `Dự án 01`…`Dự án 11`, `location: Chưa cập nhật`,
  identical excerpt, body `Nội dung dự án đang được bổ sung.`
- The excerpt renders at `text-title` (up to 3.25rem), so on every project page the largest text
  on screen is the placeholder apology.
- The eyebrow prints `NHÀ PHỐ — CHƯA CẬP NHẬT — 2021` to the visitor.
- `site.address` is empty → the JSON-LD `PostalAddress` ships without `streetAddress`, and the
  office row is hidden on both footer and `/contact`. For a local architecture studio this is the
  single highest-value missing field.
- `astro.config.mjs` still has `site: 'https://studio07.vn'` — every canonical URL, OG URL and
  sitemap entry currently points at the wrong domain.
- The cover images carry baked-in "NHÀ NHIỆT ĐỚI" watermarks, several of them centred over the
  subject.

---

## What's working well

- Art-directed hero via `<picture>` with a real portrait crop for mobile — genuinely correct, not
  the usual `object-cover` compromise.
- Motion is centralised in one component, gated on `prefers-reduced-motion`, and GSAP is only
  fetched when `[data-parallax]` exists.
- Header state driven by `IntersectionObserver` instead of a scroll listener, correctly accounting
  for Lenis not emitting window scroll events.
- `BackToTop` correctly scrolls through the Lenis instance rather than `window.scrollTo`.
- Per-project OG images cropped to 1200×630 at build time.
- Filter state reflected in the URL with `replaceState`, so back doesn't walk through filters.
- Type-safe taxonomy with a single source of truth; `astro check` clean.

---

## Suggested order

1. The comment fix in `ContactButtons.astro` (one line, unblocks every page).
2. Header state while the mobile menu is open.
3. `--color-muted` token.
4. The grid tail tile.
5. Project-page alignment.
6. Then content: real titles, locations, the studio address, and the production domain.
