export type AnalyticsEvent =
  | { name: 'app_opened' }
  | { name: 'pin_created' }
  | { name: 'pin_unlock_failed'; params: { attempts: number } }
  | { name: 'pin_unlock_succeeded' }
  | { name: 'wallet_opened' }
  | { name: 'wallet_refresh' }
  | { name: 'wallet_sync_succeeded' }
  | { name: 'wallet_sync_failed'; params: { reason: string } }
  | { name: 'transaction_opened'; params: { transactionId: string } }
  | { name: 'offline_snapshot_loaded' };

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
}
