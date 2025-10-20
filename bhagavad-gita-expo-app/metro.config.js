const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Performance optimizations for bundle size and loading
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    // Enable advanced minification
    mangle: {
      keep_fnames: true,
    },
    output: {
      ascii_only: true,
      quote_keys: false,
      wrap_iife: true,
    },
    sourceMap: false,
    toplevel: false,
    warnings: false,
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      comparisons: false,
      inline: 2,
    },
  },
};

// Optimize resolver for faster builds
config.resolver = {
  ...config.resolver,
  alias: {
    // Add aliases for commonly used paths to reduce bundle size
    '@components': './src/components',
    '@utils': './src/utils',
    '@types': './src/types',
    '@constants': './src/constants',
    '@data': './src/data',
  },
};

module.exports = config;
