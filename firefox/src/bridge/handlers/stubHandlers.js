(function initBridgeStubHandlers(globalScope) {
  const messageTypes = globalScope.BRIDGE_MESSAGE_TYPES;
  const protocol = globalScope.BridgeProtocol;

  if (!messageTypes || !protocol) {
    throw new Error('Bridge contracts must load before stub handlers.');
  }

  const placeholderSettings = {
    theme: 'system',
    dashboardUrl: null,
    telemetryEnabled: false
  };

  function handlePing() {
    return protocol.createSuccessResponse(messageTypes.PING, {
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  }

  function handleCapabilities() {
    return protocol.createSuccessResponse(messageTypes.GET_CAPABILITIES, {
      supportsBookmarks: false,
      supportsHistory: false,
      supportsTabs: false,
      supportsSettings: true
    });
  }

  function handleGetBookmarks() {
    return protocol.createSuccessResponse(messageTypes.GET_BOOKMARKS, {
      items: []
    });
  }

  function handleGetHistory() {
    return protocol.createSuccessResponse(messageTypes.GET_HISTORY, {
      items: []
    });
  }

  function handleGetTabs() {
    return protocol.createSuccessResponse(messageTypes.GET_TABS, {
      items: []
    });
  }

  function handleGetSettings() {
    return protocol.createSuccessResponse(messageTypes.GET_SETTINGS, {
      settings: placeholderSettings
    });
  }

  function handleSaveSettings(request) {
    const nextSettings = request && request.payload ? request.payload : {};

    return protocol.createSuccessResponse(messageTypes.SAVE_SETTINGS, {
      saved: true,
      settings: Object.assign({}, placeholderSettings, nextSettings)
    });
  }

  const handlersByType = {
    [messageTypes.PING]: handlePing,
    [messageTypes.GET_CAPABILITIES]: handleCapabilities,
    [messageTypes.GET_BOOKMARKS]: handleGetBookmarks,
    [messageTypes.GET_HISTORY]: handleGetHistory,
    [messageTypes.GET_TABS]: handleGetTabs,
    [messageTypes.GET_SETTINGS]: handleGetSettings,
    [messageTypes.SAVE_SETTINGS]: handleSaveSettings
  };

  function handleStubBridgeRequest(request) {
    if (!protocol.isBridgeRequest(request)) {
      return protocol.createErrorResponse('UNKNOWN', 'Invalid bridge request shape.');
    }

    const handler = handlersByType[request.type];
    if (!handler) {
      return protocol.createErrorResponse(request.type, 'Unsupported bridge request type.');
    }

    return handler(request);
  }

  globalScope.BridgeStubHandlers = {
    handleRequest: handleStubBridgeRequest,
    handlersByType
  };
})(self);
