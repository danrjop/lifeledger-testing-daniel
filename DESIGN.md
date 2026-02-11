# LifeLedger Design Guidelines

> **Design philosophy:** Calm confidence. LifeLedger replaces the anxiety of a chaotic camera roll with a space that feels warm, organized, and trustworthy. Every design decision should reduce cognitive load, not add to it.

---

## 1. Color Palette

### Foundation

The palette is built on warm neutrals — never pure white or pure black. This creates the inviting, paper-like quality shared by Anthropic, Notion, and Wispr.

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#FAF9F0` | Page background — warm cream, not sterile white |
| `--bg-secondary` | `#F3F1E8` | Card backgrounds, elevated surfaces |
| `--bg-tertiary` | `#ECEADF` | Subtle dividers, hover states on neutral surfaces |
| `--fg-primary` | `#1A1A17` | Headings, primary text — warm near-black |
| `--fg-secondary` | `#5C5B53` | Body text, descriptions |
| `--fg-tertiary` | `#8D8C83` | Captions, placeholders, metadata |

### Accent — Sage

The primary accent is a muted sage green — grounded, natural, and calming. It reinforces LifeLedger's promise of bringing order to chaos without creating urgency or alarm.

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#6B8072` | Primary buttons, active states, key CTAs |
| `--accent-hover` | `#5A6F61` | Button hover, focused interactive elements |
| `--accent-light` | `#E2EBE5` | Accent backgrounds, subtle highlights, badges |
| `--accent-fg` | `#FFFFFF` | Text on accent-colored surfaces |

### Semantic Colors

| Token | Value | Usage |
|---|---|---|
| `--success` | `#3D8B6E` | Confirmed extractions, completed deadlines |
| `--warning` | `#D4A03C` | Approaching deadlines, trial endings |
| `--danger` | `#C75450` | Overdue items, failed extractions, destructive actions |
| `--info` | `#5B7FA5` | Tips, informational banners, links |

### Dark Mode

Dark mode inverts the warmth — deep warm grays replace cool blacks.

| Token | Light | Dark |
|---|---|---|
| `--bg-primary` | `#FAF9F0` | `#1A1916` |
| `--bg-secondary` | `#F3F1E8` | `#23221C` |
| `--bg-tertiary` | `#ECEADF` | `#2E2D26` |
| `--fg-primary` | `#1A1A17` | `#EDECE4` |
| `--fg-secondary` | `#5C5B53` | `#A8A79F` |
| `--fg-tertiary` | `#8D8C83` | `#6E6D66` |

Accent colors remain consistent across themes — sage reads well on both light and dark warm backgrounds.

---

## 2. Typography

### Font Stack

Use **Geist Sans** (already loaded in layout) as the primary typeface. It's clean, geometric, and highly legible — similar in spirit to the typefaces used across all three inspiration sites.

- **Primary:** `var(--font-geist-sans)` — all UI text
- **Monospace:** `var(--font-geist-mono)` — extracted data, amounts, dates, code-like content

### Type Scale

A modular scale based on `1rem = 16px`, using Tailwind's built-in sizing. Headings should feel substantial without shouting.

| Role | Class | Size | Weight | Tracking |
|---|---|---|---|---|
| Display | `text-5xl` / `text-6xl` | 48–60px | `font-semibold` (600) | `tracking-tight` |
| H1 | `text-4xl` | 36px | `font-semibold` (600) | `tracking-tight` |
| H2 | `text-2xl` | 24px | `font-semibold` (600) | `tracking-tight` |
| H3 | `text-xl` | 20px | `font-medium` (500) | — |
| Body | `text-base` | 16px | `font-normal` (400) | — |
| Small | `text-sm` | 14px | `font-normal` (400) | — |
| Caption | `text-xs` | 12px | `font-medium` (500) | `tracking-wide` |

### Line Height

- Headings: `leading-tight` (1.25)
- Body text: `leading-relaxed` (1.625)
- UI labels/buttons: `leading-normal` (1.5)

### Guidelines

- **Maximum line width:** `max-w-prose` (65ch) for any paragraph of body text. Readability drops sharply beyond this.
- **Hierarchy through weight, not size:** Prefer changing weight or color to jumping a full size level. Subtle differences build calm hierarchy.
- **Monospace for data:** Extracted values (amounts, dates, merchant names) should use `font-mono` to signal "this came from your screenshot" — reinforcing trust in the extraction.

---

## 3. Spacing & Layout

### Spacing Scale

Use Tailwind's default spacing scale. Prefer multiples of 4 (`1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`) for consistency.

### Guiding Principles

- **Generous whitespace.** All three inspiration sites use significantly more space than feels "necessary." This is intentional — it reduces cognitive load and signals quality. When in doubt, add more space.
- **Content width:** Main content should sit within a `max-w-5xl` (64rem / 1024px) container, centered. Full-bleed backgrounds are fine, but text and cards stay contained.
- **Section spacing:** Major page sections should be separated by `py-20` to `py-28` — large enough to feel like distinct beats.
- **Card internal padding:** `p-6` minimum, `p-8` preferred on larger cards.
- **Element gaps:** Use `gap-4` to `gap-6` between sibling elements (cards, list items, form fields).

### Grid

- Use CSS Grid or Flexbox via Tailwind utilities.
- Default card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Bento-style layouts (like Notion) are encouraged for feature showcases — mix `col-span-2` and `col-span-1` for visual variety.

---

## 4. Components

### Buttons

Buttons should feel solid and tactile, with subtle depth on hover.

| Variant | Style |
|---|---|
| **Primary** | `bg-accent text-accent-fg rounded-xl px-5 py-2.5 font-medium` — used for main CTAs |
| **Secondary** | `bg-bg-secondary text-fg-primary border border-bg-tertiary rounded-xl px-5 py-2.5` — used for secondary actions |
| **Ghost** | `text-fg-secondary hover:bg-bg-secondary rounded-xl px-4 py-2` — used for tertiary actions, navigation |

**Interaction states:**
- Hover: subtle scale (`hover:scale-[1.02]`) + color shift
- Active: `active:scale-[0.98]` for a gentle press feel
- Focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`
- Transitions: `transition-all duration-200 ease-out`

### Cards

Cards are the primary content container — every screenshot/record lives in one.

```
rounded-2xl bg-bg-secondary p-6
border border-bg-tertiary/50
hover:border-bg-tertiary transition-colors duration-200
```

- **No heavy box shadows.** Depth comes from background color contrast and borders, not drop shadows. This keeps the interface flat and calm.
- **Hover:** Subtle border darkening, not elevation change.
- Cards containing screenshot thumbnails should use `rounded-xl overflow-hidden` for the image area with `object-cover`.

### Inputs

```
rounded-xl bg-bg-primary border border-bg-tertiary
px-4 py-2.5 text-fg-primary placeholder:text-fg-tertiary
focus:border-accent focus:ring-2 focus:ring-accent-light
transition-colors duration-200
```

- Inputs sit flush with the warm background, becoming more prominent on focus.
- Search input (a key interaction in LifeLedger) should be larger: `text-lg py-3 px-5` with a subtle search icon.

### Badges & Tags

Used for categories, extracted metadata, deadline statuses.

```
inline-flex items-center rounded-full px-3 py-1
text-xs font-medium tracking-wide
```

- **Neutral:** `bg-bg-tertiary text-fg-secondary`
- **Accent:** `bg-accent-light text-accent-hover`
- **Status badges** use semantic colors with light backgrounds (e.g., `bg-success/10 text-success`)

### Navigation

- Top nav should be minimal: logo left, primary actions right.
- Use a `backdrop-blur-md bg-bg-primary/80` sticky header for scroll context.
- Active nav items indicated by accent color underline or text color, not background change.

---

## 5. Imagery & Icons

### Screenshots & Documents

Screenshots are the core content — they should be presented respectfully, not as raw dumps.

- Always display in a card container with rounded corners and a subtle border.
- Use a soft background behind transparent images.
- Consider a light inner shadow (`shadow-inner`) on the image container to frame the content.
- Thumbnails in grid view: consistent aspect ratio via `aspect-[4/3]` with `object-cover`.

### Icons

- Use a consistent icon set: **Lucide** (React-compatible, clean line icons that pair with Geist).
- Icon size: `16px` inline with text, `20px` in buttons, `24px` standalone.
- Stroke width: `1.5px` (Lucide default) for the warm, light feel.
- Icon color should match the text color of its context (`currentColor`).

### Illustration Style

If illustrations are used (onboarding, empty states, error pages):
- Flat or semi-flat style with the palette's warm tones.
- Minimal detail — suggest rather than depict.
- Use sage accent sparingly to draw attention.

---

## 6. Motion & Animation

### Principles

Inspired by all three sites: animation should be **purposeful and subtle**. It guides attention and provides feedback — it never decorates.

### Defaults

- **Duration:** `150ms` for micro-interactions (hover, focus), `200–300ms` for transitions (expand, collapse, enter/exit), `400–600ms` for page-level transitions.
- **Easing:** `ease-out` (Tailwind default) for most transitions. `cubic-bezier(0.16, 1, 0.3, 1)` for entrances that feel smooth and natural.
- **Respect preferences:** Always wrap non-essential animation in `motion-safe:` to honor `prefers-reduced-motion`.

### Key Animations

| Element | Animation |
|---|---|
| Page/section enter | Fade up: `opacity 0→1` + `translateY 8px→0` over `400ms` |
| Card hover | Border color transition over `200ms` |
| Button press | Scale `1→0.98→1` over `150ms` |
| Modal/panel open | Fade in + slide from edge over `300ms` with backdrop fade |
| Toast/notification | Slide in from top-right, auto-dismiss with progress bar |
| Skeleton loading | Gentle pulse (`animate-pulse`) using `bg-bg-tertiary` |

### What to Avoid

- Bounce effects or elastic easing — too playful for a tool handling financial data.
- Parallax scrolling — adds visual noise, not clarity.
- Auto-playing carousels or rotating content.
- Any animation longer than `600ms` for UI interactions.

---

## 7. Voice & Tone (UI Copy)

The interface copy should match the visual warmth.

- **Be direct, not blunt.** "No deadlines coming up" not "No data found."
- **Be reassuring.** "All caught up" not "0 results."
- **Use plain language.** "We found 3 receipts from Amazon" not "3 documents matched your query."
- **Acknowledge effort.** "Nice — 12 screenshots organized" not "Upload complete."
- **Error messages should help, not blame.** "We couldn't read this image clearly. Try a sharper screenshot?" not "Invalid image format."

---

## 8. Accessibility

- **Color contrast:** All text meets WCAG AA (4.5:1 for body, 3:1 for large text). The warm palette is chosen to satisfy this — `#5C5B53` on `#FAF9F0` passes AA.
- **Focus indicators:** Every interactive element must have a visible focus ring (see button/input specs above).
- **Motion:** All non-essential animations gated behind `motion-safe:`.
- **Touch targets:** Minimum `44px` tap target on mobile (Tailwind: `min-h-11 min-w-11`).
- **Semantic HTML:** Use `<main>`, `<nav>`, `<section>`, `<article>`, proper heading hierarchy. Cards for screenshots should be `<article>` elements.
- **Alt text:** Screenshot images should use extracted text as alt text (or a summary), not "screenshot."

---

## 9. Responsive Breakpoints

Follow Tailwind's defaults:

| Breakpoint | Width | Behavior |
|---|---|---|
| Default | < 640px | Single column, stacked layout, larger touch targets |
| `sm` | 640px | Minor adjustments |
| `md` | 768px | Two-column grids, sidebar appears |
| `lg` | 1024px | Three-column grids, full navigation |
| `xl` | 1280px | Max content width reached, extra breathing room |

- Mobile is the default — design for single-column first, then expand.
- The search experience should be prominent at every breakpoint — it's the primary interaction.

---

## Summary: The LifeLedger Feel

| Attribute | Expression |
|---|---|
| **Warm** | Cream backgrounds, sage accents, warm grays |
| **Calm** | Generous whitespace, subtle animations, no visual noise |
| **Trustworthy** | Monospace for extracted data, evidence-backed UI, clear hierarchy |
| **Organized** | Consistent card system, clean grids, structured layouts |
| **Human** | Friendly copy, gentle interactions, acknowledgment of user effort |

When in doubt, ask: *"Does this make the user feel more in control, or less?"* LifeLedger should always make people feel like they've got it handled.
