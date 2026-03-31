(function initBridgeCapabilities(globalScope) {
  function createCapabilitiesSnapshot(settingsState) {
    const hasDashboardUrl = Boolean(settingsState && settingsState.dashboardUrl);

    return {
      features: {
        bookmarks: {
          supported: false,
          mode: 'stub'
        },
        history: {
          supported: false,
          mode: 'stub'
        },
        tabs: {
          supported: false,
          mode: 'stub'
        },
        settings: {
          supported: true,
          mode: 'memory'
        },
        dashboardIntegration: {
          supported: false,
          mode: hasDashboardUrl ? 'configured-url-only' : 'none'
        }
      }
    };
  }

  function getFeature(capabilities, featureName) {
    if (!capabilities || !capabilities.features) {
      return null;
    }

    return capabilities.features[featureName] || null;
  }

  function isFeatureSupported(capabilities, featureName) {
    const feature = getFeature(capabilities, featureName);
    return Boolean(feature && feature.supported);
  }

  globalScope.BridgeCapabilities = {
    createCapabilitiesSnapshot,
    getFeature,
    isFeatureSupported
  };
})(self);
