import type { AnalyticsEvent, AnalyticsProvider } from './types';

class AnalyticsService {
  constructor(private provider: AnalyticsProvider) {}

  track(event: AnalyticsEvent) {
    this.provider.track(event);
  }
}

import { consoleAnalyticsProvider } from './consoleProvider';
export const analytics = new AnalyticsService(consoleAnalyticsProvider);
