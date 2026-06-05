# Cinematic Scroll Demo

Open `index.html` through a local static server.

## Current Structure

- `index.html` contains the three-page layout and modal markup.
- `style.css` controls the page visuals, responsive layout, and alignment variables.
- `script.js` controls Lenis smooth scrolling, GSAP/ScrollTrigger animation, video playback, modals, and the debug panel.
- Global UI items live in `.global-ui-layer` near the top of `body`, outside individual page sections.

## Active Pages

- Page 1: lake scene, title image, boat layer, snow, scroll cue, and hero video transition.
- Page 2: three hanging circle assets; the middle circle opens the mini portfolio modal.
- Page 3: placeholder page for the next section.

## Global UI Layer

- The top-left logo is a single global element: `.global-logo`.
- The logo is fixed above ordinary pages and is controlled by `--top-left-x`, `--top-left-y`, `--top-left-scale`, and `--top-left-opacity`.
- The debug panel has a `Top Left Logo` group for adjusting those variables.
- During the hero video section, `body.is-video-section` hides the global logo.

## Asset Paths

The page currently references these exact files:

- `title_p1/top-left.png`
- `assets/images/lake1.png`
- `assets/images/star.png`
- `assets/images/title_p1.png`
- `assets/images/boat.png`
- `assets/images/001.svg`
- `assets/images/002.svg`
- `assets/images/003.svg`
- `assets/videos/hero-video.mp4`

Source/vector backups live in `assets/source/`.

## Controls

- Scroll through the page to trigger the pinned hero animation and video transition.
- Click the top buttons to open the introduction and portfolio modals.
- Click the middle circle on Page 2 to open the mini portfolio modal.
- Press `D` to show or hide the alignment debug panel.
- Use the debug panel's collapse button to fold or expand the alignment controls.
