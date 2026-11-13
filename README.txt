WAAD DESIGN STUDIO — HOLDING PAGE
=================================
Build date: 3 November 2026   (assets ?v=7)

WHAT THIS IS
------------
A static "coming soon" page for waaddesignstudio.com. No build step, no
dependencies, no server-side code. Upload the whole folder as-is.


HOW TO DEPLOY (Netlify — current host)
--------------------------------------
1. Zip the CONTENTS of this folder (index.html must sit at the top level
   of the zip, not inside a sub-folder).
2. Go to https://app.netlify.com  ->  project "cosmic-moxie-e26838"
   ->  the **Deploys** tab.
3. Drag the zip onto the drop area on that page.

   Important: dropping a zip on the Netlify *dashboard* (the team home
   page) creates a brand-new project instead of updating this one. It
   must be the project's Deploys tab.

4. Wait for "Published", then hard-refresh waaddesignstudio.com.


DNS (unchanged, lives at GoDaddy)
---------------------------------
  A      @     75.2.60.5
  CNAME  www   cosmic-moxie-e26838.netlify.app

waaddesignstudio.com has no MX records, so this setup does not touch
the @doubleyouinteriors.com mailboxes hosted with Microsoft — those are
on a different domain entirely.


FILE LAYOUT
-----------
  index.html          every slide, both layouts, and the contact popup
  css/style.css       all styling
  js/app.js           carousel engine, lazy-loading, popup
  assets/svg/         logo, monogram, wordmarks, icons (vector)
  assets/img/         photography (.webp) + two raster text strips


HOW THE TWO LAYOUTS WORK
------------------------
There are two complete slide sets in index.html:

  .set--desktop   9 slides at the 1440 x 1024 design
  .set--mobile    9 slides at the 402 x 872 design

A single media query switches between them:

    @media (max-aspect-ratio: 4/5) { ... }

Portrait-ish screens get the mobile set, everything else gets the
desktop set. js/app.js re-binds the carousel (adopt()) whenever the
breakpoint changes, so rotating a phone does the right thing.

SCALING — PLEASE READ BEFORE EDITING CSS
Sizes are NOT in px. The mobile block sets

    font-size: min(0.248756vw, 0.114679vh)

so that 1em == 1 point of the 402-wide design. Every mobile measurement
is therefore written in em and scales automatically.

Do NOT reintroduce `calc(N * var(--u))` with a `min()` custom property.
iOS Safari fails to resolve it and the page renders completely unstyled.
The em approach exists specifically to avoid that bug. `<button>` needs
`font: inherit` or it will not inherit the scale.


CAROUSEL BEHAVIOUR
------------------
  - auto-advance: 6s normally, 9s if the visitor has "reduce motion" on
  - arrows (desktop only) and swipe both work
  - with "reduce motion" the slides still advance; only the scrolling
    text holds still


CONTACT DETAILS (in index.html, in the popup)
---------------------------------------------
  email      info@doubleyouinteriors.com
  instagram  https://www.instagram.com/doubleyouinteriors


EDITING NOTES
-------------
* Photos are supplied in four sizes each: 1440 / 2400 landscape and
  800 / 1200 portrait. The <picture> element picks the portrait variant
  at the mobile breakpoint. If you swap a photo, replace all four.
* Two pieces of text are images, not fonts: assets/img/marquee-unit.png
  (the scrolling "WE'RE REMODELLING" strip) and assets/img/reach-us-here.png.
  Their typeface could not be extracted from the source PDFs as a
  webfont, so they are rendered artwork. Editing that copy means
  re-cutting those PNGs.
* SVG artwork is recoloured through CSS masks (background-color:
  currentColor + mask: url(...)), so the theme colour drives it. Do not
  hard-code fills in those SVGs.
* Theme colours, per slide, via data-theme on the section:
      burgundy  bg #4B232B  ink #B38580
      olive     bg #464826  ink #95957B
      teal      bg #05242D  ink #26666B
* After changing css/style.css or js/app.js, bump the ?v= number in
  index.html (currently 7) or returning visitors will keep the old file.


CHANGE LOG
----------
v7  Mobile: the stone ground is gone. The coloured panel now runs edge
    to edge, full-bleed, per the design team's November frames. The
    page background colour follows the panel.
v6  Mobile: CONTACT US raised to just below the oval, and the scrolling
    "WE'RE REMODELLING" strip added near the bottom of the panel.
v5  Fixed the blank/unstyled page on iOS Safari (see SCALING above).
v4  Mobile layout built from the studio's 402 x 872 frames.
v3  Netlify badge removed; HTTPS certificate issued.
v2  Live on waaddesignstudio.com.
v1  Desktop build from the 1440 x 1024 frames.
