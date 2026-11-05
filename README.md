# Mitsubishi Motors Kuwait: website redesign

A premium, responsive, single-page homepage with a cinematic hero film and an interactive vehicle showcase in which the
wheels roll as the car drives in. Static HTML/CSS/JS (GSAP + ScrollTrigger), no build step.

## Run it

```bash
npm install        # optional: only needed to refresh vendor files (gsap + fonts are already copied into /vendor and /assets/fonts)
npm start          # zero-dependency static server -> http://localhost:8080
```

Any static host works (the site is plain files). The local server adds HTTP range support so the hero video can seek.

## Structure

```
index.html              page markup (13 homepage sections, in order)
css/styles.css          design system + all section styles + responsive rules
js/config.js            EDIT ME: phone, WhatsApp, service centres, hours, address, socials, enquiry destination
js/data.js              the 9 showcase vehicles: specs, image, wheel geometry
js/main.js              showcase, GSAP motion system, nav, fleet selector, form, teardown
assets/cars/*.webp      transparent vehicle cutouts (+ wheel geometry in data.js)
assets/img, assets/video, assets/fonts, assets/icons
vendor/                 gsap.min.js, ScrollTrigger.min.js
scripts/vendor.js       copies vendor files out of node_modules
server.js               tiny static server (npm start)
```

## Page order

Header, cinematic hero, trust strip, **interactive car showcase**, featured vehicle + specifications (editorial, syncs to the
showcase), About, Why us (USPs), Fleet (interactive selector), Genuine parts, Media/news/offers, Contact + enquiry form,
Footer, floating WhatsApp / Call / Enquire controls (a bottom bar at tablet and mobile widths so it never covers content).

## Design system

| | |
|---|---|
| Colour | ink `#0b0b0c`, graphite `#141416`, paper `#eeede9`, Mitsubishi red `#ed0000` (with AA-safe `#c40000` on light and `#ff4545` on dark for small text) |
| Type | Headings: Avant Garde Gothic Condensed Demi, falling back to **Barlow Condensed 600** (see "Fonts"). Text: Barlow |
| Space | 8px base; fluid gutter `--pad` (20 to 72px); section rhythm `--sec` (88 to 176px) |
| Lines | 1px hairlines; no shadows, rounded boxes or decorative gradients (the only gradient is the hero legibility scrim) |
| Motion | one easing language (power3/power4 out), opacity+transform reveals, masked image reveals, controlled horizontal movement |
| Breakpoints | 1440+ desktop, 1024 to 1439 laptop, 768 to 1023 tablet, 320 to 767 mobile |

## The vehicle showcase

* 9 vehicles, large transparent cutouts, name + intro, key specs, **Explore details** (jumps to the featured section, which
  updates to the same model) and **Enquire now** (pre-selects the vehicle in the form).
* Horizontally scrollable thumbnail strip with an active state; arrows, keyboard (arrow keys on the stage and thumbs) and
  swipe. Swipe uses `touch-action: pan-y`, so vertical page scroll is never hijacked.
* Controlled auto-rotation (7s): pauses on hover/focus, off-screen and in a hidden tab; has a Pause/Play button; stops for good
  once the visitor navigates manually; off by default for `prefers-reduced-motion`.
* **Rolling wheels.** Each cutout is a flat side-view image, so there are no separate wheel assets. The wheel is cut from
  the same image as a circular disc and rotated independently about its measured centre. Rotation is driven by the car's
  travel (angle = distance / radius), so the wheels roll correctly as the car drives in and out and settle when it stops.
  Hub centres (front and rear separately) were located by a rotational-symmetry search and checked against the logo caps, then verified by rotating each disc and confirming the hub stays put. **Limitation:** the shading/highlights baked into the disc
  rotate with it, which looks right at this scale but is an approximation of a true 3D wheel.

## Content and verification

All text, prices, specs, contacts and links come from https://www.mitsubishi-motors.com.kw/en (and the trim listing at
https://dev18.intersmarthosting.in/mitsubishi/vehicle/ for the L200). Nothing technical was invented. Where a model page
lists no usable figure, the site shows fewer specs rather than guessing. Please confirm these with the client:

* **Price conflicts on the source site.** The homepage selector lists Outlander "From KWD 7,999" but the Outlander page's
  lowest trim is KWD 9,000; it lists Eclipse Cross "From KWD 7,349" but the model page shows a Base Line from KWD 5,999. The build uses
  the homepage selector prices. Edit `price` in `js/data.js` once confirmed.
* **No public enquiry e-mail** and **no dated news items** exist on the source. The Media section therefore links the real
  items that do exist (Sales Offers, Press Releases, Brand/Philosophy, Heritage, mobile app) and invents no articles.
* "100+ years" and the 1982 / 2009 / 2013 milestones come from the source Philosophy page. "Al Mulla service garages" and the
  manufacturer's warranty on genuine parts come from the source Parts page.

## Enquiry form and integrations (`js/config.js`)

Fields: name, phone, email, vehicle, message, consent. Validation is inline (`aria-invalid`, `role=alert`) with a polite
live status region. Destination, in priority order:

1. `enquiry.endpoint`: JSON `POST` to your CRM / form service / WordPress REST route (the reference site is WordPress with
   Contact Form 7, so a CF7 or custom REST route fits).
2. `enquiry.email` / `enquiry.fleetEmail`: opens a pre-filled `mailto:`.
3. Neither set (current state): opens WhatsApp with the enquiry pre-filled to +965 2205 5888.

The header call button, the Contact section and the WhatsApp links (including the form's WhatsApp fallback) now use the Libya office: `phone`, `whatsapp` and `address` in `config.js`. The Libya page lists no WhatsApp number, so `whatsapp.number` is set to the first Libya mobile (+218 918 804 961); confirm it is WhatsApp-enabled. The Kuwait showroom hours and service centres were removed from the Contact section (`hours` and `serviceCentres` remain in the config, unused); the Parts section still shows the Kuwait parts number.

Phone numbers, WhatsApp number, service-centre lines, hours, address, and social links are all read from `config.js`. The footer's two offices (Libya and Dubai) come from `footerOffices` in the same file, copied from https://middleeastgrp.com/mitsubishi-libya-automotives-vehicle/.

## Assets: what could not be used, and why

* **Hero film.** The supplied 21e9a61d….mp4 is a Porsche 911 interface recording, not Mitsubishi footage, so it was not used.
  The hero now uses `1102.mp4` (Mitsubishi L200 film, 1920x1080, 87s, 110 MB, in `assets/video/`). It has subtitles burned into the bottom ~10%,
  which are cropped out by scaling the film from its top edge (`.hero__media` in the CSS). It is streamed on desktop (1024px and up) only;
  phones, tablets, Save-Data and reduced-motion visitors get the poster still (`assets/img/l200-ext.webp`).
* **`logo.svg` (supplied)** reads "Mitsubishi Motors **Libya**". The site uses the official Kuwait/Global logo
  (`assets/img/logo-kw.svg`). Both supplied files are untouched in the project root and can be deleted.
* **Vehicle images and details (Choose your Mitsubishi).** The whole showcase now uses the supplied `New folder (2)` set: Destinator M Line and P Line, L200 2WD GL, L200 4WD GL, L200 GL Single Cabin, L200 GLS Petrol, L200 GLX Diesel, Outlander Sport H Line and M Line. Images were cut out with transparency (white-background files flood-filled) and resized to WebP. The only details shown are those readable from the file names (model, trim, drivetrain, fuel, body); no prices or technical specs were supplied, so every card says Price upon enquiry. Notes: (1) three supplied files, `L200 4WD GL Diesel Double Cabin`, `L200 4WD GL Petrol Double Cabin` and `L200 Sportero Diesel Double Cabin`, are byte-identical, so only one slide (`L200 4WD GL`, fuel not stated) is used; (2) by the file names `Destinator P Line` looks like an Xpander and `Outlander Sport M Line` looks like an XForce, and they are labelled as named; (3) the 4WD GL (800px) and GLS (811px) sources are low resolution and were upscaled. The old Kuwait model images and specs were removed.
* **Fonts.** *Avant Garde Gothic Condensed Demi* is a licensed commercial font and was not available. Headings use Barlow
  Condensed 600 (open licence) as the closest free match. To switch, add the licensed webfont and an `@font-face` (the
  commented hook is in `css/styles.css`); it is already first in the `--display` stack.
* **Stock photography** was not needed; every image is from the source site.
* **Not included:** Arabic/RTL, an online parts shop (per brief), the configure/finance/compare tools (link to the official site).

## Performance and QA

* Desktop streams the 110 MB hero film (range requests, so playback starts at once); mobile first load is about 1 MB. Re-encode the film to roughly 8 to 12 MB for production (`ffmpeg -i 1102.mp4 -vf scale=1920:-2 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart hero.mp4`; `ffmpeg` was not available here), then point `data-src` on `#heroVideo` at it.
* Cars are WebP (about 50 to 100 KB each), lazy-loaded thumbnails, first car preloaded, others warmed when idle; video plays
  only while on screen and is skipped for `prefers-reduced-motion` and Save-Data.
* Verified in headless Chrome at 1440, 820 and 390 widths: no horizontal overflow, no console errors, menu / swipe /
  keyboard / forms / deep links behave. **axe-core (WCAG 2.1 A/AA + best-practice): 0 violations.**
* All GSAP/ScrollTrigger instances live in one `gsap.context`; DOM listeners share one `AbortController`;
  `MMK_destroy()` (also run on `pagehide`) leaves 0 tweens and 0 triggers.
* Not tested: real devices, Safari/Firefox, screen readers (NVDA/VoiceOver).

## Inner pages

`node scripts/build-pages.js` regenerates the inner pages (vehicles, destinator/l200/outlander/xpander, compare, parts, fleet, about,
media, blog, article, contact, brochures, 404) from `scripts/content.js`. Styles: `css/inner.css`; behaviour: `js/inner.js`.
Edit copy and specs in `scripts/content.js`, then rebuild. Brochure PDF links go in `js/config.js` (`brochures`); until set, the
buttons open an enquiry. Anything unconfirmed is shown as "On request".
