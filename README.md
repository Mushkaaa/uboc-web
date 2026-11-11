# Úboč – web marketingového štúdia (demo)

One-page web v slovenčine: Vite + TypeScript, GSAP (ScrollTrigger, SplitText), Lenis a vlastný WebGL shader v hero („živé vrstevnice“).
**Všetok obsah je vymyslený** – agentúra, ľudia, klienti, čísla, referencie aj kontakty.

## Spustenie

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # typecheck + produkčný build do dist/
npm run preview    # náhľad buildu, http://localhost:4180
npm run lint
```

## Kde je čo

| Súbor | Obsah |
|---|---|
| `src/data/site.ts` | **všetok text webu** (služby, práce, tím, referencie, formulár, SEO) |
| `src/render/` | z dát generuje HTML pri builde (obsah je v HTML aj bez JS) |
| `src/styles/` | tokeny, témy sekcií, layouty, generované náhľady projektov |
| `src/gl/hero.ts` | WebGL shader v hero |
| `src/sections/` | animácie a správanie sekcií, formulár |

Po úprave `site.ts` sa dev server sám reštartuje.

## Úrovne animácií

- `prefers-reduced-motion` → statická verzia (bez intra, plynulého scrollu, pinov a kurzora).
- slabšie zariadenia (≤ 4 jadrá / ≤ 4 GB RAM / šetrenie dát / bez WebGL2) → zjednodušený shader, bez pinu a paralaxy.
- Na testovanie: `?tier=high`, `?tier=low`, `?tier=static`, `?nointro`.

## Formulár

Bez nastavenia beží v **demo režime**: nič neodosiela a pod potvrdením to jasne napíše.
Na ostré odosielanie skopíruj `.env.example` do `.env` a doplň `VITE_WEB3FORMS_KEY` (kľúč z web3forms.com).
`?form=fail` nasimuluje chybu odoslania.
