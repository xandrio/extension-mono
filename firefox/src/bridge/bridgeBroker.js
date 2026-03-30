(function initBridgeBroker(globalScope) {
  const protocol = globalScope.BridgeProtocol;
  const stubHandlers = globalScope.BridgeStubHandlers;

  if (!protocol || !stubHandlers) {
    throw new Error('Bridge broker requires protocol and handlers.');
  }

  function handleRequest(request) {
    try {
      return stubHandlers.handleRequest(request);
    } catch (error) {
      return protocol.createErrorResponse(
        request && request.type ? request.type : 'UNKNOWN',
        error && error.message ? error.message : 'Bridge broker error.'
      );
    }
  }

  globalScope.BridgeBroker = {
    handleRequest
  };
})(self);
