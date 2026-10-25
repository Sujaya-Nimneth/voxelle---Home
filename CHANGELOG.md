# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-10-25

First engineering-hardened release of the Voxelle Home dashboard demo.

### Added

- Strict TypeScript migration of the entire codebase with a typed domain model.
- Vitest + React Testing Library suite (46 tests) and Playwright e2e smoke suite (6 scenarios).
- Pure reducer state layer with versioned localStorage persistence and a reset affordance.
- Global automations state — generated rules now survive navigation; sidebar badge is derived.
- Real Ollama and LM Studio provider bridges with health checks, model picker, timeout-guarded
  fetches, and validated structured JSON command execution.
- Honest AI failure UX: explicit error bubbles with one-click fallback to the offline engine.
- Accessibility pass: keyboard-operable tiles/cards/sidebar, modal focus traps with Escape,
  aria-live chat, switch roles, visible focus rings, pinch-zoom re-enabled.
- Toast notification system replacing blocking `alert()` calls.
- Root ErrorBoundary with a styled crash fallback.
- WebP image pipeline (`npm run optimize:images`) — asset payload reduced from 5.4 MB to ~0.6 MB.
- Self-hosted variable fonts via @fontsource (no third-party CDN requests).
- Prettier, husky + lint-staged pre-commit, expanded oxlint rules (jsx-a11y included).
- GitHub Actions CI (lint/typecheck/test/build/e2e) and GitHub Pages deployment on `main`.
- Dependabot, issue templates, PR template, CONTRIBUTING, SECURITY policy.

### Fixed

- AI pipeline errors no longer masquerade as success ("Home state verified").
- `updateDevice` no longer discards explicit `statusText` passed by scene triggers.
- Open modals stay in sync when their device is toggled or updated elsewhere.
- Fan-blade and Ollama-refresh animations actually run (missing keyframes added).
- Timer and speech-recognition leaks on unmount (camera snapshot, automation synth, dictation).
- Climate summary pill now derives from real thermostat targets instead of a constant.
- Fonts are no longer double-loaded from Google Fonts on every page load.

### Changed

- Hosting moved from GitHub Pages to Vercel (Pages deploy workflow removed; `vercel.json` added).
- Camera feeds are honestly badged DEMO with simulated-detection labeling.
- Camera and AI reply copy derives from actual state instead of fabricated telemetry.
- Stylesheet split from a single 1,635-line file into scoped modules (no visual changes).
- Production bundle split into cacheable react/icons chunks (~95 kB gzipped app code).
