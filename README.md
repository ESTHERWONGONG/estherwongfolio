# Cinematic Scroll Demo

Open `index.html` through a local static server.

## Current Structure

- `index.html` contains the three-page layout and modal markup.
- `style.css` controls the page visuals, responsive layout, and alignment variables.
- `script.js` controls Lenis smooth scrolling, GSAP/ScrollTrigger animation, modals, and the debug panel.
- Global UI items live in `.global-ui-layer` near the top of `body`, outside individual page sections.

## Active Pages

- Page 1: simplified pinned hero scene prepared for the next scroll-driven video direction.
- Page 2: three hanging circle assets; the middle circle opens the mini portfolio modal.
- Page 3: placeholder page for the next section.

## Global UI Layer

- The bottom-left logo is a single global element: `.global-logo`.
- The logo is fixed above ordinary pages and is controlled by `--top-left-x`, `--top-left-y`, `--top-left-scale`, and `--top-left-opacity`.
- The right-side navigation is a single global element: `.global-nav`.
- Global navigation contains image buttons for Personal Introduction, Portfolio, and Mute.
- The debug panel has a `Top Left Logo` group for adjusting those variables.
- During future video playback sections, `body.is-video-section` can hide the global logo, global navigation, and global scroll indicator.

## Asset Paths

The page currently references these exact files:

- `assets/images/title_p1/top-left.png`
- `assets/images/buttons/buttons_p1/introduction.png`
- `assets/images/buttons/buttons_p1/portfolio.png`
- `assets/images/buttons/buttons_p1/mute_1.png`
- `assets/images/buttons/buttons_p1/mute_2.png`
- `assets/images/buttons/buttons_p1/dot.png`
- `assets/images/buttons/buttons_whole/scrolldown.png`
- `assets/images/lake1.png`
- `assets/images/title_p1.png`
- `assets/images/001.svg`
- `assets/images/002.svg`
- `assets/images/003.svg`
- `assets/cursor/cursor-default.svg`
- `assets/cursor/cursor-hover.svg`
- `assets/cursor/cursor-click.svg`

Source/vector backups live in `assets/source/`.

## Controls

- Scroll through the page to trigger the simplified pinned hero animation.
- Click the top buttons to open the introduction and portfolio modals.
- Click the middle circle on Page 2 to open the mini portfolio modal.
- Press `D` to show or hide the alignment debug panel.
- Use the debug panel's collapse button to fold or expand the alignment controls.
