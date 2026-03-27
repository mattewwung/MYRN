jest.mock('react-native-battery-level', () => ({
  getBatteryLevel: jest.fn(() => Promise.resolve(10)),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
}));
