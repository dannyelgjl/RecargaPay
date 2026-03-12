import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../src/store/auth/slice/authSlice';
import { connectivityReducer } from '../src/store/connectivity/slice/connectivitySlice';
import {
  bootstrapWallet,
  fetchTransactionDetail,
  refreshWallet,
  walletReducer,
  type TransactionDetail,
  type TransactionItem,
  type WalletSnapshot,
} from '../src/store/wallet/slice/walletSlice';

const mockLoadWalletSnapshot = jest.fn();
const mockSaveWalletSnapshot = jest.fn();
const mockFetchBalanceRequest = jest.fn();
const mockFetchTransactionsHistoryRequest = jest.fn();
const mockFetchTransactionByIdRequest = jest.fn();
const mockAnalyticsTrack = jest.fn();

jest.mock('../src/services/wallet/walletCache', () => ({
  loadWalletSnapshot: (...args: unknown[]) => mockLoadWalletSnapshot(...args),
  saveWalletSnapshot: (...args: unknown[]) => mockSaveWalletSnapshot(...args),
}));

jest.mock('../src/services/wallet/walletService', () => ({
  fetchBalanceRequest: (...args: unknown[]) => mockFetchBalanceRequest(...args),
  fetchTransactionsHistoryRequest: (...args: unknown[]) =>
    mockFetchTransactionsHistoryRequest(...args),
  fetchTransactionByIdRequest: (...args: unknown[]) =>
    mockFetchTransactionByIdRequest(...args),
}));

jest.mock('../src/feature/analytics/analytics', () => ({
  analytics: {
    track: (...args: unknown[]) => mockAnalyticsTrack(...args),
  },
}));

function createTestStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      wallet: walletReducer,
      connectivity: connectivityReducer,
    },
  });
}

const transaction: TransactionItem = {
  id: 'txn-001',
  title: 'Pix received',
  description: 'Offline snapshot item',
  amount: 150,
  type: 'credit',
  status: 'completed',
  createdAt: '2026-03-10T10:00:00.000Z',
};

const transactionDetail: TransactionDetail = {
  ...transaction,
  reference: 'PIX-001',
  category: 'Transfer',
  recipient: 'Alice',
};

describe('wallet offline behaviour', () => {
  beforeEach(() => {
    mockLoadWalletSnapshot.mockReset();
    mockSaveWalletSnapshot.mockReset();
    mockFetchBalanceRequest.mockReset();
    mockFetchTransactionsHistoryRequest.mockReset();
    mockFetchTransactionByIdRequest.mockReset();
    mockAnalyticsTrack.mockReset();
  });

  it('hydrates the last available snapshot before syncing', async () => {
    const snapshot: WalletSnapshot = {
      balance: 150,
      transactions: [transaction],
      transactionDetailsById: { 'txn-001': transactionDetail },
      lastSyncedAt: '2026-03-10T10:05:00.000Z',
    };
    const store = createTestStore();

    mockLoadWalletSnapshot.mockResolvedValue(snapshot);
    await store.dispatch(bootstrapWallet());

    expect(store.getState().wallet.balance).toBe(150);
    expect(store.getState().wallet.isOfflineSnapshot).toBe(true);
    expect(mockAnalyticsTrack).toHaveBeenCalledWith({
      name: 'offline_snapshot_loaded',
    });
  });

  it('persists fresh data and marks connectivity online after a sync', async () => {
    const store = createTestStore();

    mockFetchBalanceRequest.mockResolvedValue({ balance: 320 });
    mockFetchTransactionsHistoryRequest.mockResolvedValue([transaction]);

    await store.dispatch(refreshWallet());

    expect(store.getState().wallet.balance).toBe(320);
    expect(store.getState().wallet.transactions).toHaveLength(1);
    expect(store.getState().wallet.isOfflineSnapshot).toBe(false);
    expect(store.getState().connectivity.isConnected).toBe(true);
    expect(mockSaveWalletSnapshot).toHaveBeenCalledTimes(1);
    expect(mockAnalyticsTrack).toHaveBeenCalledWith({
      name: 'wallet_sync_succeeded',
    });
  });

  it('uses cached transaction detail when the device is offline', async () => {
    const snapshot: WalletSnapshot = {
      balance: 150,
      transactions: [transaction],
      transactionDetailsById: { 'txn-001': transactionDetail },
      lastSyncedAt: '2026-03-10T10:05:00.000Z',
    };
    const store = createTestStore();

    mockLoadWalletSnapshot.mockResolvedValue(snapshot);
    mockFetchTransactionByIdRequest.mockRejectedValue(new Error('offline'));

    await store.dispatch(bootstrapWallet());
    await store.dispatch(fetchTransactionDetail('txn-001'));

    expect(store.getState().wallet.transactionDetailsById['txn-001']).toEqual(
      transactionDetail,
    );
    expect(store.getState().wallet.detailError).toBeNull();
  });
});
