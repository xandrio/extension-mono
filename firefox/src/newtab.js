(function renderNewTab(globalScope) {
  const root = document.getElementById('app');

  if (!root) {
    return;
  }

  function prettyJson(value) {
    return JSON.stringify(value, null, 2);
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

  function renderBase(status) {
    root.innerHTML = `
      <section style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 3rem auto; max-width: 40rem; padding: 0 1rem;">
        <h1 style="font-size: 1.5rem; margin: 0 0 0.75rem;">Firefox Extension Wrapper</h1>
        <p style="margin: 0 0 0.75rem; line-height: 1.5; color: #333;">
          New tab is wired to the bridge contract scaffold.
        </p>
        <p style="margin: 0 0 1rem; line-height: 1.5; color: ${status.ok ? '#0a6b2d' : '#8a1d1d'};">
          ${status.ok ? '✅' : '⚠️'} ${status.detail}
        </p>
        <button id="toggle-telemetry" style="padding: 0.5rem 0.75rem;">Toggle telemetry + save</button>
        <p style="margin: 0.75rem 0 0.25rem; color: #555;">Current settings (from GET_SETTINGS):</p>
        <pre id="settings-output" style="background: #f7f7f7; padding: 0.75rem; border-radius: 0.375rem; overflow-x: auto; font-size: 0.875rem;">Loading settings…</pre>
        <p style="margin: 0.75rem 0 0.25rem; color: #555;">Last SAVE_SETTINGS response:</p>
        <pre id="save-output" style="background: #f7f7f7; padding: 0.75rem; border-radius: 0.375rem; overflow-x: auto; font-size: 0.875rem;">No save yet.</pre>
      </section>
    `;
  }

  async function initializeSettingsDemo() {
    const messageTypes = globalScope.BRIDGE_MESSAGE_TYPES;
    const bridge = globalScope.ExtensionBridge;

    if (!messageTypes || !bridge) {
      return;
    }

    const settingsOutput = document.getElementById('settings-output');
    const saveOutput = document.getElementById('save-output');
    const toggleButton = document.getElementById('toggle-telemetry');

    async function refreshSettingsView() {
      const settingsResponse = await bridge.request(messageTypes.GET_SETTINGS);
      settingsOutput.textContent = prettyJson(settingsResponse);
      return settingsResponse;
    }

    await refreshSettingsView();

    toggleButton.addEventListener('click', async () => {
      const currentResponse = await bridge.request(messageTypes.GET_SETTINGS);

      if (!currentResponse || !currentResponse.ok) {
        saveOutput.textContent = prettyJson(currentResponse);
        return;
      }

      const currentSettings = currentResponse.data.settings;
      const saveResponse = await bridge.request(messageTypes.SAVE_SETTINGS, {
        telemetryEnabled: !currentSettings.telemetryEnabled
      });

      saveOutput.textContent = prettyJson(saveResponse);
      await refreshSettingsView();
    });
  }

  loadBridgeStatus().then((status) => {
    renderBase(status);
    initializeSettingsDemo();
  });
})(self);
