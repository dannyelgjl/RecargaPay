import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getDeviceLanguageSafe } from '../services/device/deviceLanguage';
import {
  translations,
  type SupportedLanguage,
  type TranslationKey,
} from './translations';

type TranslationParams = Record<string, string | number>;

type I18nContextValue = {
  deviceLanguage: string;
  formatLocale: string;
  isReady: boolean;
  language: SupportedLanguage;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

function normalizeLanguageCode(deviceLanguage: string) {
  return deviceLanguage.trim().replace(/_/g, '-');
}

function isUnavailableLanguageCode(deviceLanguage: string) {
  return deviceLanguage === 'unavailable' || deviceLanguage === 'unknown';
}

function interpolate(template: string, params?: TranslationParams) {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = params[key];
    return value === undefined ? '' : String(value);
  });
}

function resolveLanguage(deviceLanguage: string): SupportedLanguage {
  return deviceLanguage.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

const defaultLanguage: SupportedLanguage = 'en';

const I18nContext = createContext<I18nContextValue>({
  deviceLanguage: 'unavailable',
  formatLocale: 'en-US',
  isReady: false,
  language: defaultLanguage,
  t: (key, params) => interpolate(translations.en[key], params),
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [deviceLanguage, setDeviceLanguage] = useState('en-US');
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getDeviceLanguageSafe()
      .then(languageCode => {
        if (!isMounted) {
          return;
        }

        const normalizedLanguageCode = normalizeLanguageCode(languageCode);
        const safeDeviceLanguage = isUnavailableLanguageCode(
          normalizedLanguageCode,
        )
          ? 'unavailable'
          : normalizedLanguageCode;

        setDeviceLanguage(safeDeviceLanguage);
        setLanguage(resolveLanguage(safeDeviceLanguage));
        setIsReady(true);
      })
      .catch(() => {
        if (isMounted) {
          setDeviceLanguage('unavailable');
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) =>
      interpolate(translations[language][key], params),
    [language],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      deviceLanguage,
      formatLocale: isUnavailableLanguageCode(deviceLanguage)
        ? language === 'pt'
          ? 'pt-BR'
          : 'en-US'
        : deviceLanguage,
      isReady,
      language,
      t,
    }),
    [deviceLanguage, isReady, language, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
