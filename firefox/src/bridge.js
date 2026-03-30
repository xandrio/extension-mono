(function initBridge(globalScope) {
  globalScope.ExtensionBridge = {
    send(message) {
      // Stub for future runtime messaging.
      // Example future use: browser.runtime.sendMessage(message)
      console.debug('Bridge stub message:', message);
    }
  };
})(self);
