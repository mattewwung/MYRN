const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const { withSentryConfig } = require('@sentry/react-native/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const aliasMap = {
  '@assets': path.resolve(__dirname, 'src/assets'),
  '@components': path.resolve(__dirname, 'src/components'),
};

const resolveAlias = (moduleName) => {
  for (const [aliasKey, aliasPath] of Object.entries(aliasMap)) {
    if (moduleName === aliasKey) {
      return aliasPath;
    }
    if (moduleName.startsWith(`${aliasKey}/`)) {
      return path.join(aliasPath, moduleName.slice(aliasKey.length + 1));
    }
  }
  return null;
};

const config = {
  transformer: {
    babelTransformerPath: require.resolve(
      "react-native-svg-transformer/react-native"
    )
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
    resolveRequest: (context, moduleName, platform) => {
      const aliasPath = resolveAlias(moduleName);
      if (aliasPath) {
        return context.resolveRequest(context, aliasPath, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = withSentryConfig(
  mergeConfig(defaultConfig, config),
);
