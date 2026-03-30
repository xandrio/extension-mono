(function initBridgeProtocol(globalScope) {
  function createRequest(type, payload) {
    return {
      version: '1.0',
      type,
      payload: payload || null
    };
  }

  function createSuccessResponse(type, data) {
    return {
      ok: true,
      type,
      data: data || null,
      error: null
    };
  }

  function createErrorResponse(type, message) {
    return {
      ok: false,
      type,
      data: null,
      error: {
        message: message || 'Unknown bridge error'
      }
    };
  }

  function isBridgeRequest(value) {
    return Boolean(value && typeof value.type === 'string');
  }

  globalScope.BridgeProtocol = {
    createRequest,
    createSuccessResponse,
    createErrorResponse,
    isBridgeRequest
  };
})(self);
