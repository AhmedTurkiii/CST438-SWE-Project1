module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Keep this if you use it
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    transformIgnorePatterns: [
            'node_modules/(?!(expo-modules-core|@react-native|react-native|expo)/)',
    ],
  };
  module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
      'node_modules/(?!(expo-modules-core|@react-native|react-native|expo)/)',
    ],
  };
  