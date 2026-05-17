const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Performance optimizations for bundle size and loading
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    mangle: { keep_fnames: true },
    output: { ascii_only: true, quote_keys: false, wrap_iife: true },
    sourceMap: false,
    toplevel: false,
    warnings: false,
    parse: { ecma: 8 },
    compress: { ecma: 5, warnings: false, comparisons: false, inline: 2 },
  },
};

// Optimize resolver for faster builds
config.resolver = {
  ...config.resolver,
  alias: {
    '@components': './src/components',
    '@utils': './src/utils',
    '@types': './src/types',
    '@constants': './src/constants',
    '@data': './src/data',
    '@tw': './src/tw',
  },
};

module.exports = withNativewind(config, {
  inlineVariables: false,
  globalClassNamePolyfill: false,
});
