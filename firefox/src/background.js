// Background service worker stub.
// Keep this file minimal until extension-level logic is needed.

self.addEventListener('install', () => {
  // Reserved for future setup steps.
});

self.addEventListener('message', (event) => {
  // Reserved for future message handling between extension entry points.
  console.debug('Background message stub:', event.data);
});
