import { NativeModules } from 'react-native';

type DeviceLanguageModuleType = {
  getCurrentLanguage?: () => Promise<string>;
};

export async function getDeviceLanguageSafe(): Promise<string> {
  try {
    const module = NativeModules.DeviceLanguageModule as
      | DeviceLanguageModuleType
      | undefined;

    if (!module || typeof module.getCurrentLanguage !== 'function') {
      const settingsManager =
        NativeModules.SettingsManager?.settings?.AppleLocale ??
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];

      if (typeof settingsManager === 'string' && settingsManager.length > 0) {
        return settingsManager;
      }

      const localeIdentifier =
        NativeModules.I18nManager?.localeIdentifier ??
        NativeModules.I18nManager?.getConstants?.().localeIdentifier;

      if (typeof localeIdentifier === 'string' && localeIdentifier.length > 0) {
        return localeIdentifier;
      }

      return 'unavailable';
    }

    const language = await module.getCurrentLanguage();
    return language || 'unknown';
  } catch {
    return 'unavailable';
  }
}
