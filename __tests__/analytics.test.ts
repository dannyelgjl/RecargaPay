describe('analytics', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('delegates tracking calls through the configured provider', () => {
    const mockTrack = jest.fn();

    jest.isolateModules(() => {
      jest.doMock('../src/feature/analytics/consoleProvider', () => ({
        consoleAnalyticsProvider: {
          track: (...args: unknown[]) => mockTrack(...args),
        },
      }));

      const { analytics } =
        require('../src/feature/analytics/analytics') as typeof import('../src/feature/analytics/analytics');

      analytics.track({ name: 'wallet_opened' });
    });

    expect(mockTrack).toHaveBeenCalledWith({ name: 'wallet_opened' });
  });

  it('logs events in development through the console provider', () => {
    const originalDev = __DEV__;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    Object.defineProperty(globalThis, '__DEV__', {
      value: true,
      configurable: true,
    });

    jest.unmock('../src/feature/analytics/consoleProvider');
    jest.isolateModules(() => {
      const { consoleAnalyticsProvider } =
        require('../src/feature/analytics/consoleProvider') as typeof import('../src/feature/analytics/consoleProvider');

      consoleAnalyticsProvider.track({
        name: 'transaction_opened',
        params: { transactionId: 'txn-123' },
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith('[analytics]', 'transaction_opened', {
      transactionId: 'txn-123',
    });

    Object.defineProperty(globalThis, '__DEV__', {
      value: originalDev,
      configurable: true,
    });
    consoleSpy.mockRestore();
  });

  it('skips console logging outside development', () => {
    const originalDev = __DEV__;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    Object.defineProperty(globalThis, '__DEV__', {
      value: false,
      configurable: true,
    });

    jest.unmock('../src/feature/analytics/consoleProvider');
    jest.isolateModules(() => {
      const { consoleAnalyticsProvider } =
        require('../src/feature/analytics/consoleProvider') as typeof import('../src/feature/analytics/consoleProvider');

      consoleAnalyticsProvider.track({ name: 'wallet_opened' });
    });

    expect(consoleSpy).not.toHaveBeenCalled();

    Object.defineProperty(globalThis, '__DEV__', {
      value: originalDev,
      configurable: true,
    });
    consoleSpy.mockRestore();
  });

  it('logs an empty params object when the event does not provide params', () => {
    const originalDev = __DEV__;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    Object.defineProperty(globalThis, '__DEV__', {
      value: true,
      configurable: true,
    });

    jest.unmock('../src/feature/analytics/consoleProvider');
    jest.isolateModules(() => {
      const { consoleAnalyticsProvider } =
        require('../src/feature/analytics/consoleProvider') as typeof import('../src/feature/analytics/consoleProvider');

      consoleAnalyticsProvider.track({ name: 'wallet_opened' });
    });

    expect(consoleSpy).toHaveBeenCalledWith('[analytics]', 'wallet_opened', {});

    Object.defineProperty(globalThis, '__DEV__', {
      value: originalDev,
      configurable: true,
    });
    consoleSpy.mockRestore();
  });
});
