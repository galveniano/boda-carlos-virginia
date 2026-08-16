# Carlos & Virginia — 14.11.2026

Wedding invitation site. Plain static HTML, CSS and JavaScript — no build
step, no dependencies, no framework. Deployed on Vercel's free tier.

## Structure

```
index.html            markup and content (all copy lives here)
styles.css            layout column, fonts, keyframes, hover, reduced motion
app.js                countdown, cover animation, house-fund state, IBAN copy
img/                  story photos and the link-preview image
favicon.svg           the biznaga, used as the browser-tab icon
favicon-96.png        raster fallback for browsers without SVG icon support
apple-touch-icon.png  home-screen icon on iOS
vercel.json           caching and security headers
```

The two PNG icons are rendered from `favicon.svg`. If you change the SVG,
regenerate them rather than editing the PNGs by hand.

## Responsive behaviour

The invitation is a single column that fills the screen up to 430 px and
then stays centred, so a phone gets a full-bleed page and a desktop gets a
centred card. Verified at 320, 390, 430, 768 and 1440 px. Below 360 px the
wax-seal band shrinks its labels so the seal does not cover them.

On touch devices the map is covered by a shield until tapped — an embedded
Google map otherwise swallows the vertical scroll gesture.

## Editing content

Text, times and dates are plain HTML in `index.html`. Search for the
section comment (`<!-- El día -->`, `<!-- Autobús de vuelta -->`, …) and
edit in place.

Everything the site computes at runtime is in the `CONFIG` block at the
top of `app.js`:

| Key           | Meaning                                                             |
| ------------- | ------------------------------------------------------------------- |
| `weddingDate` | Countdown target, ISO 8601 with offset                              |
| `houseStage`  | `cimientos` \| `paredes` \| `tejado` \| `terraza`                   |
| `showIban`    | `false` hides the bank-transfer block                               |
| `iban`        | Account number shown and copied                                     |

> **Before sharing the site:** `CONFIG.iban` is still the placeholder
> `ES12 3456 7890 1234 5678 9012`. Replace it with the real account
> number, or set `showIban: false`.

## Running locally

Any static server works. With Node installed:

```bash
npx serve .
```

Opening `index.html` directly via `file://` also works, except that the
clipboard API falls back to the legacy copy path.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Go to <https://vercel.com/new> and import the repository.
3. Framework preset: **Other**. Leave build command and output directory
   empty — this is a static site served from the repository root.
4. Deploy.

Every push to `main` redeploys automatically. Pull requests get their own
preview URL.

To use a custom domain, add it under **Settings → Domains** in the Vercel
project and point the DNS records Vercel shows you.
