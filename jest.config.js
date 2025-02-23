module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-reanimated|react-native-confetti-cannon|@react-native|@react-navigation)/)',
  ],
};
