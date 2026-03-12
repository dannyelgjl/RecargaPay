import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { analytics } from '../../../feature/analytics/analytics';
import {
  loadWalletSnapshot,
  saveWalletSnapshot,
} from '../../../services/wallet/walletCache';
import {
  fetchBalanceRequest,
  fetchTransactionByIdRequest,
  fetchTransactionsHistoryRequest,
  type TransactionDetailResponse,
  type TransactionHistoryItem,
} from '../../../services/wallet/walletService';
import { setConnectivity } from '../../connectivity/slice/connectivitySlice';
import type { RootState } from '../../store';

export type TransactionItem = TransactionHistoryItem;
export type TransactionDetail = TransactionDetailResponse;

export type WalletSnapshot = {
  balance: number | null;
  transactions: TransactionItem[];
  transactionDetailsById: Record<string, TransactionDetail>;
  lastSyncedAt: string | null;
};

type WalletState = WalletSnapshot & {
  isBootstrapped: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isDetailLoading: boolean;
  error: string | null;
  detailError: string | null;
  isOfflineSnapshot: boolean;
};

const initialState: WalletState = {
  balance: null,
  transactions: [],
  transactionDetailsById: {},
  lastSyncedAt: null,
  isBootstrapped: false,
  isLoading: false,
  isRefreshing: false,
  isDetailLoading: false,
  error: null,
  detailError: null,
  isOfflineSnapshot: false,
};

function buildSnapshot(
  state: Pick<
    WalletState,
    'balance' | 'transactions' | 'transactionDetailsById' | 'lastSyncedAt'
  >,
): WalletSnapshot {
  return {
    balance: state.balance,
    transactions: state.transactions,
    transactionDetailsById: state.transactionDetailsById,
    lastSyncedAt: state.lastSyncedAt,
  };
}

export const bootstrapWallet = createAsyncThunk(
  'wallet/bootstrapWallet',
  async () => {
    const snapshot = await loadWalletSnapshot();

    if (snapshot) {
      analytics.track({ name: 'offline_snapshot_loaded' });
    }

    return snapshot;
  },
);

export const refreshWallet = createAsyncThunk<
  WalletSnapshot,
  { silent?: boolean } | void,
  { state: RootState; rejectValue: string }
>('wallet/refreshWallet', async (_arg, { dispatch, getState, rejectWithValue }) => {
  try {
    const [balanceResponse, transactions] = await Promise.all([
      fetchBalanceRequest(),
      fetchTransactionsHistoryRequest(),
    ]);
    const currentState = getState().wallet;
    const snapshot: WalletSnapshot = {
      balance: balanceResponse.balance,
      transactions,
      transactionDetailsById: currentState.transactionDetailsById,
      lastSyncedAt: new Date().toISOString(),
    };

    await saveWalletSnapshot(snapshot);
    dispatch(
      setConnectivity({
        isConnected: true,
        successfulSyncAt: snapshot.lastSyncedAt,
      }),
    );
    analytics.track({ name: 'wallet_sync_succeeded' });

    return snapshot;
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : 'Unable to sync wallet data';

    dispatch(setConnectivity({ isConnected: false }));
    analytics.track({
      name: 'wallet_sync_failed',
      params: { reason },
    });

    return rejectWithValue(reason);
  }
});

export const fetchTransactionDetail = createAsyncThunk<
  TransactionDetail,
  string,
  { state: RootState; rejectValue: string }
>('wallet/fetchTransactionDetail', async (transactionId, thunkApi) => {
  const { getState, rejectWithValue } = thunkApi;
  const currentState = getState().wallet;
  const cachedTransaction = currentState.transactionDetailsById[transactionId];

  if (cachedTransaction) {
    return cachedTransaction;
  }

  try {
    const detail = await fetchTransactionByIdRequest(transactionId);
    const snapshot: WalletSnapshot = {
      ...buildSnapshot(currentState),
      transactionDetailsById: {
        ...currentState.transactionDetailsById,
        [transactionId]: detail,
      },
    };

    await saveWalletSnapshot(snapshot);
    return detail;
  } catch (error) {
    const snapshot = await loadWalletSnapshot();
    const offlineDetail = snapshot?.transactionDetailsById[transactionId];

    if (offlineDetail) {
      return offlineDetail;
    }

    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Failed to load transaction detail',
    );
  }
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletError(state) {
      state.error = null;
    },
    clearTransactionDetailError(state) {
      state.detailError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(bootstrapWallet.fulfilled, (state, action) => {
        state.isBootstrapped = true;

        if (!action.payload) {
          return;
        }

        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
        state.transactionDetailsById = action.payload.transactionDetailsById;
        state.lastSyncedAt = action.payload.lastSyncedAt;
        state.isOfflineSnapshot = true;
      })
      .addCase(refreshWallet.pending, (state, action) => {
        const silent = action.meta.arg?.silent ?? false;

        if (!state.isBootstrapped && !silent) {
          state.isLoading = true;
        } else {
          state.isRefreshing = true;
        }
      })
      .addCase(refreshWallet.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
        state.transactionDetailsById = action.payload.transactionDetailsById;
        state.lastSyncedAt = action.payload.lastSyncedAt;
        state.isBootstrapped = true;
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = null;
        state.isOfflineSnapshot = false;
      })
      .addCase(refreshWallet.rejected, (state, action) => {
        state.isBootstrapped = true;
        state.isLoading = false;
        state.isRefreshing = false;
        state.error =
          action.payload ?? action.error.message ?? 'Failed to load wallet';
        state.isOfflineSnapshot =
          state.balance !== null || state.transactions.length > 0;
      })
      .addCase(fetchTransactionDetail.pending, state => {
        state.isDetailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchTransactionDetail.fulfilled, (state, action) => {
        state.transactionDetailsById[action.payload.id] = action.payload;
        state.isDetailLoading = false;
        state.detailError = null;
      })
      .addCase(fetchTransactionDetail.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.detailError =
          action.payload ??
          action.error.message ??
          'Failed to load transaction detail';
      });
  },
});

export const { clearWalletError, clearTransactionDetailError } =
  walletSlice.actions;
export const walletReducer = walletSlice.reducer;
