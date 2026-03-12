describe('secureStorage service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  function loadService(nativeModules: Record<string, unknown> = {}) {
    const asyncStorage = {
      setItem: jest.fn(
        (_key: string, _value: string): Promise<void> => Promise.resolve(),
      ),
      getItem: jest.fn(
        (_key: string): Promise<string | null> => Promise.resolve(null),
      ),
      removeItem: jest.fn((_key: string): Promise<void> => Promise.resolve()),
    };

    jest.resetModules();
    jest.doMock('react-native', () => ({
      NativeModules: nativeModules,
    }));
    jest.doMock(
      '@react-native-async-storage/async-storage',
      () => asyncStorage,
    );

    const service =
      require('../src/services/secure/secureStorage') as typeof import('../src/services/secure/secureStorage');

    return {
      asyncStorage,
      ...service,
    };
  }

  it('uses the native module when secure storage is available', async () => {
    const nativeModule = {
      setItem: jest.fn().mockResolvedValue(undefined),
      getItem: jest.fn().mockResolvedValue('1234'),
      removeItem: jest.fn().mockResolvedValue(undefined),
    };
    const {
      asyncStorage,
      hasNativeSecureStorage,
      secureGetItem,
      secureRemoveItem,
      secureSetItem,
    } = loadService({
      SecureStorageModule: nativeModule,
    });

    await secureSetItem('wallet_pin_value', '1234');
    await expect(secureGetItem('wallet_pin_value')).resolves.toBe('1234');
    await secureRemoveItem('wallet_pin_value');

    expect(hasNativeSecureStorage()).toBe(true);
    expect(nativeModule.setItem).toHaveBeenCalledWith(
      'wallet_pin_value',
      '1234',
    );
    expect(nativeModule.getItem).toHaveBeenCalledWith('wallet_pin_value');
    expect(nativeModule.removeItem).toHaveBeenCalledWith('wallet_pin_value');
    expect(asyncStorage.setItem).not.toHaveBeenCalled();
    expect(asyncStorage.getItem).not.toHaveBeenCalled();
    expect(asyncStorage.removeItem).not.toHaveBeenCalled();
  });

  it('falls back to AsyncStorage with a namespaced key when the native module is unavailable', async () => {
    const {
      asyncStorage,
      hasNativeSecureStorage,
      secureGetItem,
      secureRemoveItem,
      secureSetItem,
    } = loadService();

    asyncStorage.getItem.mockImplementationOnce(() => Promise.resolve('1234'));

    await secureSetItem('wallet_pin_value', '1234');
    await expect(secureGetItem('wallet_pin_value')).resolves.toBe('1234');
    await secureRemoveItem('wallet_pin_value');

    expect(hasNativeSecureStorage()).toBe(false);
    expect(asyncStorage.setItem).toHaveBeenCalledWith(
      'secure:wallet_pin_value',
      '1234',
    );
    expect(asyncStorage.getItem).toHaveBeenCalledWith(
      'secure:wallet_pin_value',
    );
    expect(asyncStorage.removeItem).toHaveBeenCalledWith(
      'secure:wallet_pin_value',
    );
  });
});
