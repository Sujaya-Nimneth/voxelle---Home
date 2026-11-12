# Voxelle Home 🏡✨

> **A smart home dashboard demo built with the Astryx design system and a local-first AI assistant.**

[![CI](https://github.com/Sujaya-Nimneth/voxelle---Home/actions/workflows/ci.yml/badge.svg)](https://github.com/Sujaya-Nimneth/voxelle---Home/actions/workflows/ci.yml)
[![Hosted on Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?logo=vercel)](https://voxelle-home.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](tsconfig.json)

**Live demo:** <https://voxelle-home.vercel.app/> _(deployed from `main` by Vercel)_

---

## 🌟 What this is

Voxelle Home is a **frontend portfolio project**: a smart home dashboard built entirely with the
[Astryx](https://www.npmjs.com/package/@astryxdesign/core) design system (light-first
`@astryxdesign/theme-neutral`) and a natural-language assistant that can genuinely drive the
in-app home state.

It is built to enterprise engineering standards — strict TypeScript, a pure reducer store with
persistence, 46 unit/component tests plus Playwright e2e, WCAG-minded accessibility, CI on every
push — while being honest about what is real and what is a demo.

### What's real vs. simulated

| Capability                          | Status       | Notes                                                                                               |
| :---------------------------------- | :----------- | :-------------------------------------------------------------------------------------------------- |
| Built-in rule engine                | ✅ Real      | Deterministic NLU: scenes, lights/locks/climate/fans, camera intents. Runs fully in-browser.        |
| Ollama bridge                       | ✅ Real      | Live `/api/tags` health check + `/api/chat` structured command execution against your local Ollama. |
| LM Studio bridge                    | ✅ Real      | `/v1/models` + `/v1/chat/completions` (OpenAI-compatible) against your local server.                |
| Voice input / spoken replies        | ✅ Real      | Web Speech API (recognition + synthesis), browser support dependent.                                |
| Scene orchestration & device state  | ✅ Real      | Reducer-backed state with localStorage persistence; scenes mutate real app state.                   |
| Camera feeds & detection overlays   | 🎬 Simulated | Still images with sample detection tags. Badged "Demo" in the UI.                                   |
| Accessory discovery (Matter/Thread) | 🎬 Simulated | The Add button reports that discovery is simulated.                                                 |
| Automation execution                | 🎬 Simulated | Automations are stored and persisted; triggers do not execute on real events.                       |

## 🚀 Key features

- **Astryx-native UI** — `AppShell` + `SideNav`/`TopNav` frame, `List`/`Item` device rows with
  `Switch` and `Slider` controls, `SegmentedControl` scenes, `Grid`/`Card` cameras, Astryx `Dialog`s
  for device, camera and assistant detail. No hand-rolled CSS, no `<div>` layout wrappers, no raw
  hex/px: styling is component props plus theme tokens.
- **Light-first neutral theme** with a self-hosted Figtree font (zero third-party CDNs) and a
  responsive shell: a 230px labelled sidebar on desktop, an automatic mobile nav drawer on phones.
- **Six scenes** (Arrive Home, Wake Up, Leave Home, Movie Night, Goodnight, Focus Work) that
  synchronously update device state — with confetti (respecting reduced-motion preferences).
- **Camera inspector** with intercom/siren/snapshot affordances (demo actions) and a simulated
  detection timeline.
- **AI assistant** with three interchangeable providers, measured health/latency display, model
  picker, honest error reporting, and one-click fallback to the offline engine.

## 🛠️ Tech stack

- **React 19 + TypeScript (strict)** — `noUncheckedIndexedAccess`, zero `any`
- **Vite 8** — production build with lazy Astryx chunks, relative base for subpath hosting
- **UI** — `@astryxdesign/core`, `@astryxdesign/theme-neutral`, `@stylexjs/stylex`, `@astryxdesign/cli`
- **State** — pure reducer (`src/store/homeReducer.ts`) + memoized context, versioned localStorage persistence
- **Styling** — Astryx component props + `var(--color-*)`/`--spacing-*`/`--radius-*` tokens; a single
  self-hosted `@font-face` file for Figtree
- **AI** — provider abstraction under `src/services/ai/` with timeout/abort-guarded fetches
- **Testing** — Vitest + React Testing Library (46 tests) + Playwright e2e (6 scenarios)
- **Tooling** — oxlint (correctness presets, jsx-a11y), Prettier, husky + lint-staged, GitHub Actions CI/CD

```
src/
├── components/        # Views, rows, cards, dialogs, toast adapter
├── context/           # HomeContext — typed store facade
├── data/              # Seed devices, scenes, cameras, automations, rooms
├── services/ai/       # Rule engine + Ollama + LM Studio providers
├── store/             # Pure reducer + persistence
├── styles/            # Self-hosted Figtree @font-face only
├── test/              # Vitest setup (jsdom polyfills)
├── types/             # Domain model
├── App.tsx            # AppShell frame + view switch
├── astryx-themes.ts   # Generated by `astryx theme add` — do not edit
└── main.tsx           # Base stylesheets + Theme + LayerProvider
e2e/                   # Playwright smoke suite
```

## 🏁 Getting started

Requires Node 22+ (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
```

All quality gates:

```bash
npm run lint          # oxlint
npm run typecheck     # tsc --noEmit
npm test              # Vitest unit + component
npm run build         # production build
npm run test:e2e      # Playwright against vite preview (builds first)
npx astryx doctor --built dist   # Astryx build gate
```

### Working with Astryx

The generated [AGENTS.md](AGENTS.md) is the authoritative convention set for coding agents: start
every page from a template, read `astryx component <Name>` before use, keep dense data in rows,
style with component props first then tokens, and never hand-write `:root` palette overrides.
Useful reads: `npx astryx docs getting-started`, `npx astryx docs principles`,
`npx astryx docs layout`, `npx astryx docs is-my-code-good`.

### Environment configuration

Copy [.env.example](.env.example) to `.env` to point at non-default local AI endpoints:

| Variable            | Default                  | Purpose                   |
| :------------------ | :----------------------- | :------------------------ |
| `VITE_OLLAMA_URL`   | `http://localhost:11434` | Ollama server base URL    |
| `VITE_LMSTUDIO_URL` | `http://localhost:1234`  | LM Studio server base URL |

## 🤖 Connecting a local LLM

**Ollama:**

```bash
ollama run llama3.2
# Allow browser origins if needed:
OLLAMA_ORIGINS="*" ollama serve
```

Then open the assistant → **Ollama Bridge** tab → the health chip shows measured round-trip latency
and a model picker populated from your installation. Commands are answered as strict JSON and
validated before touching home state; anything unreadable surfaces an honest error with a
fallback to the built-in engine.

**LM Studio:** start the local server (port 1234), then pick the **LM Studio Bridge** tab.

No server running? The **Built-in Rule Engine** works offline with zero configuration.

## 🔒 Privacy posture

- No analytics, no trackers, no third-party CDNs — Figtree is self-hosted via `@fontsource-variable/figtree`.
- The only network calls the app can make are to `localhost` endpoints you configure.
- All home state lives in your browser's localStorage; the reset button clears it.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security disclosures: [SECURITY.md](SECURITY.md).

## 📄 License

MIT — see [LICENSE](LICENSE).
