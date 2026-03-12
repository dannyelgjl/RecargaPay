import type { RootState } from '../../store';

export const selectWalletState = (state: RootState) => state.wallet;
export const selectBalance = (state: RootState) => state.wallet.balance;
export const selectTransactions = (state: RootState) => state.wallet.transactions;
export const selectLastSyncedAt = (state: RootState) =>
  state.wallet.lastSyncedAt;
export const selectIsOfflineSnapshot = (state: RootState) =>
  state.wallet.isOfflineSnapshot;
export const selectTransactionById = (transactionId: string) =>
  (state: RootState) => state.wallet.transactionDetailsById[transactionId];
