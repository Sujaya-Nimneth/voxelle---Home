# Contributing to Voxelle Home

Thanks for your interest in improving this project!

## Development setup

```bash
git clone https://github.com/Sujaya-Nimneth/voxelle---Home.git
cd "voxelle - Home"
npm install
npm run dev
```

Node 22+ is required (`.nvmrc` pins the version; `nvm use` picks it up).

## Before opening a PR

All of these must pass — CI runs them on every pull request:

```bash
npm run lint          # oxlint (correctness presets incl. jsx-a11y)
npm run typecheck     # tsc --noEmit, strict mode
npm test              # Vitest unit + component tests
npm run build         # production build
npm run test:e2e      # Playwright smoke suite (builds and serves first)
```

The husky pre-commit hook formats and lints staged files automatically.

## Commit style

Conventional commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `ci:`, `perf:`).
Keep commits small and focused; each should leave the gates green.

## Project conventions

- **TypeScript strict** — no `any`, prefer narrowing over assertions.
- **State changes go through the reducer** (`src/store/homeReducer.ts`) — never mutate context
  state directly. New state slices need persistence versioning consideration.
- **Honesty in the UI** — anything simulated must be labeled as such (e.g. the DEMO camera badge).
  Never present fabricated telemetry as real.
- **Accessibility** — interactive elements need keyboard paths and labels; modals use
  `useModalDialog`; new icons-only buttons need `aria-label`s.
- **Styling** — design tokens live in `src/styles/tokens.css`; component styles in the matching
  `src/styles/*.css` module. No inline magic colors when a token exists.
- **Tests** — bug fixes should land with a regression test; new service logic needs unit tests;
  user-visible flows should be covered by a Playwright scenario.

## Adding imagery

Drop files into `public/assets/` and run `npm run optimize:images` — the script generates
WebP variants; reference the `.webp` files in code.

## Reporting bugs

Use the issue templates. Include the chassis mode and AI provider if relevant.
