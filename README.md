# Voxelle Home 🏡✨

> **A design-forward smart home dashboard demo with frosted glassmorphism, three device chassis, and a local-first AI assistant.**

[![CI](https://github.com/Sujaya-Nimneth/voxelle---Home/actions/workflows/ci.yml/badge.svg)](https://github.com/Sujaya-Nimneth/voxelle---Home/actions/workflows/ci.yml)
[![Hosted on Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?logo=vercel)](https://voxelle-home.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](tsconfig.json)

**Live demo:** <https://voxelle-home.vercel.app/> _(deployed from `main` by Vercel)_

---

## 🌟 What this is

Voxelle Home is a **frontend portfolio project**: an Apple-Home-inspired dashboard rendered with a
frosted glassmorphic design system, switchable Mac / iPad / iPhone chassis, and a natural-language
assistant that can genuinely drive the in-app home state.

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
| Camera feeds & detection overlays   | 🎬 Simulated | Still images with sample detection tags/bounding boxes. Badged "DEMO" in the UI.                    |
| Accessory discovery (Matter/Thread) | 🎬 Simulated | The Add button reports that discovery is simulated.                                                 |
| Automation execution                | 🎬 Simulated | Automations are stored and persisted; triggers do not execute on real events.                       |

## 🚀 Key features

- **Glassmorphic accessory tiles** — one-tap toggles with stateful glows, dimmer sliders, color
  temperature swatches, thermostat dial with modes, and lock/unlock controls.
- **Six scenes** (Arrive Home, Wake Up, Leave Home, Movie Night, Goodnight, Focus Work) that
  synchronously update device state — with confetti.
- **Camera inspector** with intercom/siren/snapshot affordances (demo actions) and a simulated
  detection timeline.
- **AI assistant** with three interchangeable providers, measured health/latency display, model
  picker, honest error reporting, and one-click fallback to the offline engine.
- **Three chassis** — Mac desktop, iPad, iPhone (dynamic island + tab bar) — switchable live.
- **Ambient wallpapers** and an iridescent assistant orb, all WebP-optimized and self-hosted.

## 🛠️ Tech stack

- **React 19 + TypeScript (strict)** — `noUncheckedIndexedAccess`, zero `any`
- **Vite 8** — production build ~95 kB gzipped app code, split vendor chunks, relative base for Pages
- **State** — pure reducer (`src/store/homeReducer.ts`) + memoized context, versioned localStorage persistence
- **Styling** — hand-rolled CSS design system in `src/styles/` (no Tailwind), self-hosted variable fonts
- **AI** — provider abstraction under `src/services/ai/` with timeout/abort-guarded fetches
- **Testing** — Vitest + React Testing Library (46 tests) + Playwright e2e (6 scenarios)
- **Tooling** — oxlint (correctness presets, jsx-a11y), Prettier, husky + lint-staged, GitHub Actions CI/CD

```
src/
├── components/        # Dashboard views, tiles, modals, toasts
├── context/           # HomeContext — typed store facade
├── data/              # Seed devices, scenes, cameras, automations, rooms
├── hooks/             # useModalDialog (focus trap, Escape, restore)
├── services/ai/       # Rule engine + Ollama + LM Studio providers
├── store/             # Pure reducer + persistence
├── styles/            # tokens / layout / sidebar / dashboard / cameras /
│                      # scenes / accessories / modals / toast
├── test/              # Vitest setup
└── types/             # Domain model
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
```

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

- No analytics, no trackers, no third-party CDNs — fonts are self-hosted via @fontsource.
- The only network calls the app can make are to `localhost` endpoints you configure.
- All home state lives in your browser's localStorage; the reset button clears it.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security disclosures: [SECURITY.md](SECURITY.md).

## 📄 License

MIT — see [LICENSE](LICENSE).
