(function renderNewTab() {
  const root = document.getElementById('app');

  if (!root) {
    return;
  }

  if (self.ExtensionBridge) {
    self.ExtensionBridge.send({ type: 'newtab:ready' });
  }

  root.innerHTML = `
    <section style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 3rem auto; max-width: 36rem; padding: 0 1rem;">
      <h1 style="font-size: 1.5rem; margin: 0 0 0.75rem;">Firefox Extension Wrapper</h1>
      <p style="margin: 0; line-height: 1.5; color: #333;">
        This is a minimal new tab scaffold. Future dashboard UI integration will be added here.
      </p>
    </section>
  `;
})();
