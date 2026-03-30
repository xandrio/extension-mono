# Firefox extension workspace

This workspace is a **thin Firefox extension wrapper scaffold**.

## Purpose

- Provide a minimal `new tab` entry point.
- Keep a tiny background service worker stub for future extension logic.
- Stay simple so dashboard app integration can happen later without cleanup.

## Current structure

- `manifest.json`: Extension metadata and entry points.
- `src/newtab.html`: New tab document shell.
- `src/newtab.js`: Minimal new tab UI placeholder.
- `src/background.js`: Background service worker stub for future use.
- `src/bridge.js`: Minimal messaging bridge stub shared by extension pages.

## What is intentionally not implemented yet

- No dashboard app code from the separate repository.
- No bundler, TypeScript, or UI framework.
- No browser API integrations (bookmarks, history, tabs, etc.).
- No runtime messaging bridge implementation yet.
- No packaging or CI pipeline.
