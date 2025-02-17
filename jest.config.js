module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(expo-sqlite|expo-asset|expo-modules-core|@react-native|react-native|expo)/)',
  ],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^expo-asset$': '<rootDir>/node_modules/expo-asset/build/index.js',
  },
};
