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
			return webpackConfig;
		},
	},
};


