# 3D Poster Boilerplate (Next.js + TSX)

This project is pre-wired for your three incoming assets:

- PNG poster background
- Custom OTF font
- 3D parallax text composition

## Drop-In Setup

Place files at these exact paths:

- `public/assets/poster/poster-portrait.png`
- `public/assets/fonts/custom-display.otf`

Then run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Where To Tweak

- Main scene component: `src/app/page.tsx`
- Styling and asset hooks: `src/app/globals.css`

Quick edits you can do fast:

- Change text content/layers: `textLayers` in `src/app/page.tsx`
- Change parallax intensity: `springFactor` and rotate multipliers in `src/app/page.tsx`
- Change poster ratio/look: `.poster-scene` and `.poster-card` in `src/app/globals.css`

## Notes About Poster Size

The boilerplate is tuned for portrait posters (`aspect-ratio: 0.75`, i.e. 3:4).

- If your delivered poster is portrait (for example, 1080x1440), it should fit directly.
- If your delivered poster is 1440x1080 (landscape), it will still render with `cover` but be cropped to portrait framing.

## Build Check

```bash
npm run build
```
