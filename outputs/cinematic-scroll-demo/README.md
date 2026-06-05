# Cinematic Scroll Demo

Open `index.html` through a local static server.

## Current Structure

- `index.html` contains the three-page layout and modal markup.
- `style.css` controls the page visuals, responsive layout, and alignment variables.
- `script.js` controls Lenis smooth scrolling, GSAP/ScrollTrigger animation, video playback, modals, and the debug panel.

## Active Pages

- Page 1: lake scene, title image, boat layer, snow, scroll cue, and hero video transition.
- Page 2: three hanging circle assets; the middle circle opens the mini portfolio modal.
- Page 3: placeholder page for the next section.

## Asset Paths

The page currently references these exact files:

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
