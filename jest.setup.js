// jest.setup.js


import '@testing-library/jest-dom';


jest.mock('expo-sqlite', () => ({
    openDatabase: jest.fn(() => ({
      transaction: jest.fn((callback) => callback({
        executeSql: jest.fn((query, params, success, error) => success?.([], [])),
      })),
    })),
  }));
  

  jest.mock('expo-asset', () => ({
    Asset: {
      fromModule: jest.fn(() => ({
        downloadAsync: jest.fn(() => Promise.resolve()),
        localUri: 'mocked-asset-uri',
      })),
    },
  }));
  