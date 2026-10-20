# kotie-portfolio

Retro, N64-inspired portfolio for Dakota Heim.

- **Stack:** React 19, Vite, TypeScript, Tailwind v4, shadcn/ui (Base UI), React Three Fiber + drei
- **Content:** all resume data lives in `src/data/resume.json` (typed in `src/data/resume.ts`). Edit the JSON and the site updates.
- **3D:** `src/components/Scene.tsx` renders at reduced resolution (`dpr={0.4}`) and upscales with `image-rendering: pixelated` for the low-res look. It is lazy-loaded and respects `prefers-reduced-motion`.

```sh
npm install
npm run dev     # http://localhost:5173
npm run build
```
