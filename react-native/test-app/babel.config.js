module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-reanimated plugin removed - not used and requires New Architecture
    // which conflicts with react-native-track-player
  };
};
