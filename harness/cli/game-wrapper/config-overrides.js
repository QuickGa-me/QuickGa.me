const {removeModuleScopePlugin, override, addWebpackAlias, babelInclude} = require('customize-cra');
const path = require('path');

module.exports = override(function override(config, env) {
    config.module.rules.some((rule, index) => {
        if (Array.isArray(rule.use)) {
            const eslintUse = rule.use.find((item) => Object.keys(item.options).find((key) => key === 'useEslintrc'));
            eslintOptions = eslintUse && eslintUse.options;
            if (eslintOptions) {
                config.module.rules.splice(index, 1);
                return true;
            }
        }
    });

    return config;
});
