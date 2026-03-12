describe('deviceLanguage service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  function loadService(nativeModules: Record<string, unknown>) {
    jest.resetModules();
    jest.doMock('react-native', () => ({
      NativeModules: nativeModules,
    }));

    return require('../src/services/device/deviceLanguage') as typeof import('../src/services/device/deviceLanguage');
  }

  it('returns the locale from the native module when it exists', async () => {
    const { getDeviceLanguageSafe } = loadService({
      DeviceLanguageModule: {
        getCurrentLanguage: jest.fn().mockResolvedValue('es-AR'),
      },
    });

    await expect(getDeviceLanguageSafe()).resolves.toBe('es-AR');
  });

  it('falls back to SettingsManager when the native module is missing', async () => {
    const { getDeviceLanguageSafe } = loadService({
      SettingsManager: {
        settings: {
          AppleLanguages: ['pt_PT'],
        },
      },
    });

    await expect(getDeviceLanguageSafe()).resolves.toBe('pt_PT');
  });

  it('falls back to I18nManager constants when no direct language module exists', async () => {
    const { getDeviceLanguageSafe } = loadService({
      I18nManager: {
        getConstants: () => ({
          localeIdentifier: 'fr-FR',
        }),
      },
    });

    await expect(getDeviceLanguageSafe()).resolves.toBe('fr-FR');
  });

  it('returns unavailable when every strategy fails', async () => {
    const { getDeviceLanguageSafe } = loadService({
      DeviceLanguageModule: {
        getCurrentLanguage: jest.fn().mockRejectedValue(new Error('boom')),
      },
    });

    await expect(getDeviceLanguageSafe()).resolves.toBe('unavailable');
  });
});
