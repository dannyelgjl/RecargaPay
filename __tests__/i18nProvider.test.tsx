import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import { I18nProvider, useI18n } from '../src/i18n';

const mockGetDeviceLanguageSafe = jest.fn();

jest.mock('../src/services/device/deviceLanguage', () => ({
  getDeviceLanguageSafe: () => mockGetDeviceLanguageSafe(),
}));

type Snapshot = {
  deviceLanguage: string;
  formatLocale: string;
  language: string;
  loadingLabel: string;
  interpolatedLabel?: string;
};

let snapshot: Snapshot | null = null;

function CaptureI18nSnapshot() {
  const { deviceLanguage, formatLocale, language, t } = useI18n();

  snapshot = {
    deviceLanguage,
    formatLocale,
    language,
    loadingLabel: t('wallet.loading'),
  };

  return null;
}

async function renderProvider(languageCode: string) {
  let renderer: ReactTestRenderer;

  mockGetDeviceLanguageSafe.mockResolvedValue(languageCode);
  snapshot = null;

  await act(async () => {
    renderer = create(
      <I18nProvider>
        <CaptureI18nSnapshot />
      </I18nProvider>,
    );
  });

  await act(async () => {
    await Promise.resolve();
  });

  return renderer!;
}

function DefaultI18nConsumer() {
  const { deviceLanguage, formatLocale, language, t } = useI18n();

  snapshot = {
    deviceLanguage,
    formatLocale,
    language,
    loadingLabel: t('wallet.loading'),
    interpolatedLabel: t('unlock.errorIncorrectAttempts', {}),
  };

  return null;
}

describe('I18nProvider', () => {
  beforeEach(() => {
    mockGetDeviceLanguageSafe.mockReset();
    snapshot = null;
  });

  it('switches translations to Portuguese and normalizes the locale code', async () => {
    const renderer = await renderProvider('pt_PT');

    expect(snapshot).toEqual({
      deviceLanguage: 'pt-PT',
      formatLocale: 'pt-PT',
      language: 'pt',
      loadingLabel: 'Carregando carteira...',
    });

    await act(async () => {
      renderer.unmount();
    });
  });

  it('preserves non-Portuguese locales while falling back to English copy', async () => {
    const renderer = await renderProvider('es-AR');

    expect(snapshot).toEqual({
      deviceLanguage: 'es-AR',
      formatLocale: 'es-AR',
      language: 'en',
      loadingLabel: 'Loading wallet...',
    });

    await act(async () => {
      renderer.unmount();
    });
  });

  it('falls back to the default locale when the device language is unavailable', async () => {
    const renderer = await renderProvider('unavailable');

    expect(snapshot).toEqual({
      deviceLanguage: 'unavailable',
      formatLocale: 'en-US',
      language: 'en',
      loadingLabel: 'Loading wallet...',
    });

    await act(async () => {
      renderer.unmount();
    });
  });

  it('falls back to the default locale when device-language resolution throws', async () => {
    let renderer: ReactTestRenderer;

    mockGetDeviceLanguageSafe.mockRejectedValue(new Error('boom'));

    await act(async () => {
      renderer = create(
        <I18nProvider>
          <CaptureI18nSnapshot />
        </I18nProvider>,
      );
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(snapshot).toEqual({
      deviceLanguage: 'unavailable',
      formatLocale: 'en-US',
      language: 'en',
      loadingLabel: 'Loading wallet...',
    });

    await act(async () => {
      renderer!.unmount();
    });
  });

  it('exposes the default context safely without a provider', () => {
    let renderer: ReactTestRenderer;

    act(() => {
      renderer = create(<DefaultI18nConsumer />);
    });

    expect(snapshot).toEqual({
      deviceLanguage: 'unavailable',
      formatLocale: 'en-US',
      language: 'en',
      loadingLabel: 'Loading wallet...',
      interpolatedLabel: 'Incorrect passcode. Attempts: ',
    });

    act(() => {
      renderer!.unmount();
    });
  });

  it('ignores async device-language updates after unmount', async () => {
    let resolveLanguage: ((value: string) => void) | null = null;
    let renderer: ReactTestRenderer;

    mockGetDeviceLanguageSafe.mockImplementation(
      () =>
        new Promise<string>(resolve => {
          resolveLanguage = resolve;
        }),
    );

    await act(async () => {
      renderer = create(
        <I18nProvider>
          <CaptureI18nSnapshot />
        </I18nProvider>,
      );
    });

    await act(async () => {
      renderer!.unmount();
    });

    await act(async () => {
      resolveLanguage?.('pt-BR');
      await Promise.resolve();
    });

    expect(snapshot).toEqual({
      deviceLanguage: 'en-US',
      formatLocale: 'en-US',
      language: 'en',
      loadingLabel: 'Loading wallet...',
    });
  });
});
