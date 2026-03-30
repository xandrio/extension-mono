(function renderNewTab(globalScope) {
  const root = document.getElementById('app');

  if (!root) {
    return;
  }

  async function loadBridgeStatus() {
    const messageTypes = globalScope.BRIDGE_MESSAGE_TYPES;

    if (!messageTypes || !globalScope.ExtensionBridge) {
      return {
        ok: false,
        detail: 'Bridge is not available.'
      };
    }

    const pingResponse = await globalScope.ExtensionBridge.request(messageTypes.PING);

    if (!pingResponse || !pingResponse.ok) {
      return {
        ok: false,
        detail: pingResponse && pingResponse.error ? pingResponse.error.message : 'Ping failed.'
      };
    }

    return {
      ok: true,
      detail: `Bridge healthy at ${pingResponse.data.timestamp}`
    };
  }

  loadBridgeStatus().then((status) => {
    root.innerHTML = `
      <section style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 3rem auto; max-width: 40rem; padding: 0 1rem;">
        <h1 style="font-size: 1.5rem; margin: 0 0 0.75rem;">Firefox Extension Wrapper</h1>
        <p style="margin: 0 0 0.75rem; line-height: 1.5; color: #333;">
          New tab is wired to the bridge contract scaffold.
        </p>
        <p style="margin: 0; line-height: 1.5; color: ${status.ok ? '#0a6b2d' : '#8a1d1d'};">
          ${status.ok ? '✅' : '⚠️'} ${status.detail}
        </p>
      </section>
    `;
  });
})(self);
