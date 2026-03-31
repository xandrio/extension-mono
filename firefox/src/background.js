// Background service worker acts as the central bridge broker.
importScripts(
  'bridge/contracts/messageTypes.js',
  'bridge/contracts/protocol.js',
  'bridge/capabilities/bridgeCapabilities.js',
  'bridge/handlers/stubHandlers.js',
  'bridge/bridgeBroker.js'
);

(function initBackgroundBridge(globalScope) {
  function getRuntime() {
    if (globalScope.browser && globalScope.browser.runtime) {
      return globalScope.browser.runtime;
    }

    if (globalScope.chrome && globalScope.chrome.runtime) {
      return globalScope.chrome.runtime;
    }

    return null;
  }

  const runtime = getRuntime();

  if (!runtime || !runtime.onMessage) {
    return;
  }

  runtime.onMessage.addListener((message) => {
    return globalScope.BridgeBroker.handleRequest(message);
  });
})(self);
