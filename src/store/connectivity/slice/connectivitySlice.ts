import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ConnectivityState = {
  isConnected: boolean;
  lastCheckedAt: string | null;
  lastSuccessfulSyncAt: string | null;
};

const initialState: ConnectivityState = {
  isConnected: true,
  lastCheckedAt: null,
  lastSuccessfulSyncAt: null,
};

const connectivitySlice = createSlice({
  name: 'connectivity',
  initialState,
  reducers: {
    setConnectivity(
      state,
      action: PayloadAction<{
        isConnected: boolean;
        checkedAt?: string;
        successfulSyncAt?: string | null;
      }>,
    ) {
      state.isConnected = action.payload.isConnected;
      state.lastCheckedAt = action.payload.checkedAt ?? new Date().toISOString();

      if (action.payload.successfulSyncAt) {
        state.lastSuccessfulSyncAt = action.payload.successfulSyncAt;
      }
    },
  },
});

export const { setConnectivity } = connectivitySlice.actions;
export const connectivityReducer = connectivitySlice.reducer;
