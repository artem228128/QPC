const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
      webpackConfig.resolve.plugins = (webpackConfig.resolve.plugins || []).filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );
      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias || {}),
        'react-refresh/runtime': require.resolve('react-refresh/runtime'),
      };
      return webpackConfig;
    },
  },
};


