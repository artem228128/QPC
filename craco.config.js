/* CRACO config to relax CRA module scope for react-refresh runtime absolute import */

module.exports = {
	webpack: {
		configure: (webpackConfig) => {
			// Remove CRA's ModuleScopePlugin so absolute paths under node_modules are allowed
			if (webpackConfig.resolve && Array.isArray(webpackConfig.resolve.plugins)) {
				webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
					(plugin) => plugin && plugin.constructor && plugin.constructor.name !== 'ModuleScopePlugin'
				);
			}

			// Add Node.js polyfills for WalletConnect
			webpackConfig.resolve.fallback = {
				...webpackConfig.resolve.fallback,
				"stream": require.resolve("stream-browserify"),
				"http": require.resolve("stream-http"),
				"https": require.resolve("https-browserify"),
				"os": require.resolve("os-browserify/browser"),
				"url": require.resolve("url"),
				"crypto": require.resolve("crypto-browserify"),
				"assert": require.resolve("assert"),
				"buffer": require.resolve("buffer"),
				"process": require.resolve("process/browser"),
				"util": require.resolve("util")
			};

			// Provide process and Buffer globally
			const webpack = require('webpack');
			webpackConfig.plugins = [
				...webpackConfig.plugins,
				new webpack.ProvidePlugin({
					process: 'process/browser',
					Buffer: ['buffer', 'Buffer'],
				}),
			];

			return webpackConfig;
		},
	},
};


