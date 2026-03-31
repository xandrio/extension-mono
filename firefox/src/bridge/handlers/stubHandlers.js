(function initBridgeStubHandlers(globalScope) {
  const messageTypes = globalScope.BRIDGE_MESSAGE_TYPES;
  const protocol = globalScope.BridgeProtocol;
  const capabilitiesModel = globalScope.BridgeCapabilities;

  if (!messageTypes || !protocol || !capabilitiesModel) {
    throw new Error('Bridge contracts and capabilities must load before stub handlers.');
  }

  const defaultSettings = {
    theme: 'system',
    dashboardUrl: 'http://localhost:3000',
    telemetryEnabled: false
  };

  // In-memory scaffold state (background-lifetime only).
  let settingsState = Object.assign({}, defaultSettings);

  function cloneSettings() {
    return Object.assign({}, settingsState);
  }

  function getCapabilities() {
    return capabilitiesModel.createCapabilitiesSnapshot(cloneSettings());
  }

  function applySettingsPatch(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return {
        ok: false,
        error: 'Settings payload must be an object.'
      };
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'theme')) {
      if (typeof payload.theme !== 'string' || payload.theme.trim() === '') {
        return {
          ok: false,
          error: 'theme must be a non-empty string.'
        };
      }

      settingsState.theme = payload.theme;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'dashboardUrl')) {
      const isValidType =
        payload.dashboardUrl === null || typeof payload.dashboardUrl === 'string';

      if (!isValidType) {
        return {
          ok: false,
          error: 'dashboardUrl must be a string or null.'
        };
      }

      settingsState.dashboardUrl = payload.dashboardUrl;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'telemetryEnabled')) {
      if (typeof payload.telemetryEnabled !== 'boolean') {
        return {
          ok: false,
          error: 'telemetryEnabled must be a boolean.'
        };
      }

      settingsState.telemetryEnabled = payload.telemetryEnabled;
    }

    return { ok: true };
  }

  function handlePing() {
    return protocol.createSuccessResponse(messageTypes.PING, {
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  }

  function handleCapabilities() {
    return protocol.createSuccessResponse(messageTypes.GET_CAPABILITIES, getCapabilities());
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
      settings: cloneSettings()
    });
  }

  function handleSaveSettings(request) {
    const result = applySettingsPatch(request ? request.payload : null);

    if (!result.ok) {
      return protocol.createErrorResponse(messageTypes.SAVE_SETTINGS, result.error);
    }

    return protocol.createSuccessResponse(messageTypes.SAVE_SETTINGS, {
      saved: true,
      settings: cloneSettings()
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
    handlersByType,
    getCapabilities
  };
})(self);
