# XYZ — IT Consultancy Website

A premium, responsive portfolio website for an IT consultancy, built with **React (Vite)**.
There is no server to run: it builds to plain files you can host almost anywhere, often for free.

> All company details, clients, case studies, people, quotes and addresses are **placeholder data**.
> Edit `frontend/src/data.js` to replace them with real content before going live.

## What's inside

```
it consultancy/
├── frontend/              React app (Vite)
│   ├── src/data.js        ← ALL website text and content lives here
│   ├── src/styles.css     Design tokens (colours, fonts) at the top
│   ├── src/motion.js      Smooth scrolling and scroll animations (GSAP + Lenis)
│   └── src/components/    One file per section
└── start-dev.bat          Windows: starts the site and opens it in your browser
```

**Sections:** intro screen · hero with a live 3D globe of the offices and office clocks · scroll-reactive
services marquee · services accordion · client marquee · filterable case studies with detail pop-ups ·
process (scrolls sideways on large screens) · about, stats, testimonials, leadership · insights and FAQ ·
contact form · newsletter footer.

**Motion:** smooth scrolling, words that rise into view, magnetic buttons, a custom cursor, tilting case
cards and count-up stats. Most of it is switched on with data attributes in the components
(`data-split`, `data-reveal`, `data-fill`, `data-draw`, `data-count`, `data-speed`); `src/motion.js`
explains each one.

## Requirements

- Node.js 18 or newer

## Run it locally

**Quick start on Windows:** double-click `start-dev.bat` (the first run installs everything).

**Or manually:**

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173**.

## Contact form and newsletter

The forms are delivered by [Web3Forms](https://web3forms.com), a free service that emails each
submission to you, so no server is needed:

1. On web3forms.com, enter the email address that should receive enquiries. They email you an access key.
2. Paste the key into `formKey` in `frontend/src/data.js`.

Contact-form messages then arrive in that inbox (replying answers the visitor directly), and each
newsletter sign-up arrives as an email too. Until a key is set, both forms open the visitor's own email
app with their message filled in, addressed to `email` in `data.js`.

## Deploy

```bash
cd frontend
npm run build          # creates frontend/dist
```

Upload the `frontend/dist` folder to any static host, such as Netlify, Vercel, Cloudflare Pages or GitHub
Pages. If the host builds the site for you, use these settings: base directory `frontend`, build command
`npm run build`, output directory `dist`.

## Customising

- **Text, services, projects, team, offices:** `frontend/src/data.js`
- **Where form messages go:** `formKey` in `data.js` (see above)
- **Colours and fonts:** variables at the top of `frontend/src/styles.css`
- **Logo:** `frontend/src/components/Logo.jsx` and `frontend/public/favicon.svg`
- **Office clocks:** each office has an IANA time zone (`tz`) in `data.js`; "Open" means 09:00–18:00, Monday to Friday, local time.
- **Globe:** offices are placed by their `lat`/`lon` in `data.js`; the arcs between them are listed in `ROUTES` in `components/Globe.jsx`.

Fonts (Bricolage Grotesque and Figtree) are bundled with the site, so no Google Fonts requests are made — good for speed and GDPR.
Animations (including the marquees, intro screen, smooth scrolling and custom cursor) are switched off automatically
for visitors who turn on "reduce motion" on their device: everything is shown in place and the globe is a still image.
