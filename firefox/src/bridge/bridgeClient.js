(function initExtensionBridge(globalScope) {
  const protocol = globalScope.BridgeProtocol;
  const broker = globalScope.BridgeBroker;

  if (!protocol) {
    throw new Error('Bridge protocol must load before bridge client.');
  }

  function getRuntime() {
    if (globalScope.browser && globalScope.browser.runtime) {
      return globalScope.browser.runtime;
    }

    if (globalScope.chrome && globalScope.chrome.runtime) {
      return globalScope.chrome.runtime;
    }

    return null;
  }

  async function request(type, payload) {
    const requestMessage = protocol.createRequest(type, payload);
    const runtime = getRuntime();

    if (runtime && typeof runtime.sendMessage === 'function') {
      try {
        return await runtime.sendMessage(requestMessage);
      } catch (error) {
        return protocol.createErrorResponse(
          type,
          error && error.message ? error.message : 'Runtime bridge request failed.'
        );
      }
    }

    if (broker && typeof broker.handleRequest === 'function') {
      return broker.handleRequest(requestMessage);
    }

    return protocol.createErrorResponse(type, 'No bridge transport available.');
  }

  globalScope.ExtensionBridge = {
    request
  };
})(self);
