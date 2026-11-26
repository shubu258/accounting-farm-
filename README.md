# Accounting Farm — homepage redesign sample

Proposal prototype for the Accounting Farm homepage (outsourced accounting for CPA, accounting and bookkeeping firms).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (static)
```

## Stack
Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Three.js via React Three Fiber + drei · GSAP + ScrollTrigger + SplitText · Lenis smooth scroll.

## Where things live
- `src/lib/content.ts` — every piece of copy and every fact, sourced from the live accountingfarm.info site. Edit content here.
- `src/components/hero/LedgerScene.tsx` — the hero 3D scene ("The Ledger Model"), lazy-loaded, paused off-screen, static under reduced motion.
- `src/components/sections/*` — one file per homepage section.
- `src/lib/image-loader.ts` — images are served and resized by Unsplash's CDN (placeholder photography for the proposal).

## Notes
- Photography is Unsplash stock, chosen as placeholders; swap in real office/team photography before launch.
- `legacy/static-sample.html` is the earlier single-file concept, kept for reference.
