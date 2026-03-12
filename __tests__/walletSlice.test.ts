import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../src/store/auth/slice/authSlice';
import { connectivityReducer } from '../src/store/connectivity/slice/connectivitySlice';
import {
  bootstrapWallet,
  clearTransactionDetailError,
  clearWalletError,
  fetchTransactionDetail,
  refreshWallet,
  walletReducer,
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

const transactionDetail = {
  id: 'txn-123',
  title: 'Pix',
  description: 'Payment',
  amount: 20,
  type: 'credit' as const,
  status: 'completed' as const,
  createdAt: '2026-03-11T10:00:00.000Z',
  reference: 'PIX-123',
  category: 'Transfer',
  recipient: 'Alice',
};

describe('walletSlice', () => {
  beforeEach(() => {
    mockLoadWalletSnapshot.mockReset();
    mockSaveWalletSnapshot.mockReset();
    mockFetchBalanceRequest.mockReset();
    mockFetchTransactionsHistoryRequest.mockReset();
    mockFetchTransactionByIdRequest.mockReset();
    mockAnalyticsTrack.mockReset();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-11T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handles bootstrap without a cached snapshot', () => {
    const state = walletReducer(
      undefined,
      bootstrapWallet.fulfilled(null, 'req'),
    );

    expect(state.isBootstrapped).toBe(true);
    expect(state.balance).toBeNull();
    expect(state.transactions).toEqual([]);
    expect(state.isOfflineSnapshot).toBe(false);
  });

  it('clears wallet-level errors with the explicit reducers', () => {
    const withErrors = {
      ...walletReducer(undefined, { type: '@@INIT' }),
      error: 'wallet failed',
      detailError: 'detail failed',
    };

    const walletErrorCleared = walletReducer(withErrors, clearWalletError());
    const detailErrorCleared = walletReducer(
      walletErrorCleared,
      clearTransactionDetailError(),
    );

    expect(walletErrorCleared.error).toBeNull();
    expect(detailErrorCleared.detailError).toBeNull();
  });

  it('sets loading states correctly for regular and silent refreshes', () => {
    const initialState = walletReducer(undefined, { type: '@@INIT' });
    const loadingState = walletReducer(
      initialState,
      refreshWallet.pending('req', undefined),
    );
    const refreshingState = walletReducer(
      {
        ...loadingState,
        isBootstrapped: true,
      },
      refreshWallet.pending('req', { silent: true }),
    );

    expect(loadingState.isLoading).toBe(true);
    expect(loadingState.isRefreshing).toBe(false);
    expect(refreshingState.isRefreshing).toBe(true);
  });

  it('marks the wallet offline when refresh fails but cached data still exists', () => {
    const state = walletReducer(
      {
        ...walletReducer(undefined, { type: '@@INIT' }),
        balance: 50,
      },
      refreshWallet.rejected(new Error('offline'), 'req', undefined, 'offline'),
    );

    expect(state.isBootstrapped).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.isRefreshing).toBe(false);
    expect(state.error).toBe('offline');
    expect(state.isOfflineSnapshot).toBe(true);
  });

  it('falls back to a generic refresh error when no payload or error message exists', () => {
    const state = walletReducer(
      walletReducer(undefined, { type: '@@INIT' }),
      {
        type: refreshWallet.rejected.type,
        payload: undefined,
        error: {},
      } as ReturnType<typeof refreshWallet.rejected>,
    );

    expect(state.error).toBe('Failed to load wallet');
  });

  it('tracks detail loading and error fallback states', () => {
    const pendingState = walletReducer(
      {
        ...walletReducer(undefined, { type: '@@INIT' }),
        detailError: 'old error',
      },
      fetchTransactionDetail.pending('req', 'txn-123'),
    );
    const fallbackErrorState = walletReducer(
      pendingState,
      {
        type: fetchTransactionDetail.rejected.type,
        payload: undefined,
        error: {},
      } as ReturnType<typeof fetchTransactionDetail.rejected>,
    );

    expect(pendingState.isDetailLoading).toBe(true);
    expect(pendingState.detailError).toBeNull();
    expect(fallbackErrorState.isDetailLoading).toBe(false);
    expect(fallbackErrorState.detailError).toBe(
      'Failed to load transaction detail',
    );
  });

  it('returns a cached transaction detail without calling the network', async () => {
    const store = createTestStore();
    store.dispatch({
      type: fetchTransactionDetail.fulfilled.type,
      payload: transactionDetail,
    });

    await store.dispatch(fetchTransactionDetail('txn-123') as any);

    expect(mockFetchTransactionByIdRequest).not.toHaveBeenCalled();
    expect(mockSaveWalletSnapshot).not.toHaveBeenCalled();
    expect(store.getState().wallet.transactionDetailsById['txn-123']).toEqual(
      transactionDetail,
    );
  });

  it('rejects refresh with a generic reason when the thrown value is not an Error', async () => {
    const store = createTestStore();
    mockFetchBalanceRequest.mockRejectedValue('network down');

    await store.dispatch(refreshWallet() as any);

    expect(store.getState().wallet.error).toBe('Unable to sync wallet data');
    expect(store.getState().connectivity.isConnected).toBe(false);
    expect(mockAnalyticsTrack).toHaveBeenCalledWith({
      name: 'wallet_sync_failed',
      params: { reason: 'Unable to sync wallet data' },
    });
  });

  it('rejects detail loading with a generic reason when offline cache also misses', async () => {
    const store = createTestStore();
    mockFetchTransactionByIdRequest.mockRejectedValue('offline');
    mockLoadWalletSnapshot.mockResolvedValue(null);

    await store.dispatch(fetchTransactionDetail('txn-404') as any);

    expect(store.getState().wallet.detailError).toBe(
      'Failed to load transaction detail',
    );
  });
});
