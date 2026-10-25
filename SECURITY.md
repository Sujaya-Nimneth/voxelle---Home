# Security Policy

## Supported versions

Only the latest `main` branch receives updates.

## Reporting a vulnerability

Please use
[GitHub Security Advisories](https://github.com/Sujaya-Nimneth/voxelle---Home/security/advisories)
to report vulnerabilities privately. Do not open public issues for security problems.

You can expect an acknowledgement within a few days.

## Scope notes

Voxelle Home is a browser-only demo application:

- It stores home state in `localStorage` — never put real credentials or sensitive data into it.
- The local AI bridges call only the endpoints configured via `VITE_OLLAMA_URL` /
  `VITE_LMSTUDIO_URL` (default `localhost`). Requests carry your prompts to those servers;
  point them only at servers you control.
- There is no backend, database, or authentication surface in this project.
