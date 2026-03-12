import type { AnalyticsProvider, AnalyticsEvent } from './types';

export const consoleAnalyticsProvider: AnalyticsProvider = {
  track(event: AnalyticsEvent) {
    if (!__DEV__) {
      return;
    }

    const params = 'params' in event ? event.params : {};
    console.log('[analytics]', event.name, params);
  },
};
