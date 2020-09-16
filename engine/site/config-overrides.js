const {removeModuleScopePlugin, override, addWebpackAlias, babelInclude} = require('customize-cra');
const path = require('path');
const postcss = require('react-app-rewire-postcss');
const findSassModuleRule = (config) => {
  let sassModuleRuleIndex;
  const cssLoaderModule = config.module.rules.find((ruleItem) => {
    if (!ruleItem.oneOf || !ruleItem.oneOf.length) {
      return false;
    }
    sassModuleRuleIndex = ruleItem.oneOf.findIndex(
      (loaderItem) => loaderItem.test && loaderItem.test.toString() === '/\\.module\\.(scss|sass)$/'
    );
    return sassModuleRuleIndex !== -1;
  });

  const sassModuleRule = cssLoaderModule.oneOf[sassModuleRuleIndex];
  return sassModuleRule;
};

// Remove resolve-url-loader which causes SASS modules to not work properly
// TODO: Remove this when below issue gets fixed
// https://github.com/facebook/create-react-app/issues/7682
const removeResolveUrlLoader = (config) => {
  const sassModuleRule = findSassModuleRule(config);
  for (const loaderItem of sassModuleRule.use) {
    if (loaderItem.loader && loaderItem.loader.includes('resolve-url-loader')) {
      loaderItem.options.removeCR = true;
    }
  }
  return config;
};

module.exports = override(
  removeResolveUrlLoader,
  removeModuleScopePlugin(),
  (config) => {
    postcss(config, true /* any truthy value will do */);
    return config;
  },
  babelInclude([path.resolve('src'), path.resolve('../common')]),
  addWebpackAlias({
    ['@common']: path.resolve(__dirname, '..', 'common'),
    react: path.resolve('./node_modules/react'),
  }),
  function override(config, env) {
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
  }
);
