# Firefox extension workspace

This workspace is a **thin Firefox extension wrapper scaffold**.

## Purpose

- Provide a minimal `new tab` entry point.
- Keep a tiny background service worker ready to become a bridge broker.
- Define a small internal bridge contract for future browser-backed features.

## Current structure

- `manifest.json`: Extension metadata and entry points.
- `src/newtab.html`: New tab document shell.
- `src/newtab.js`: Minimal new tab UI that exercises bridge `PING`.
- `src/background.js`: Background bridge broker and runtime message entry.
- `src/bridge/contracts/*`: Shared bridge message types and request/response helpers.
- `src/bridge/handlers/stubHandlers.js`: Placeholder bridge handlers with static/mock results.
- `src/bridge/bridgeBroker.js`: Small dispatcher for bridge requests.
- `src/bridge/bridgeClient.js`: Bridge request API used by UI entry points.

## What is intentionally not implemented yet

- No dashboard app code from the separate repository.
- No bundler, TypeScript, or UI framework.
- No real browser API integrations (`bookmarks`, `history`, `tabs`).
- No external web app communication.
- No packaging or CI pipeline.
