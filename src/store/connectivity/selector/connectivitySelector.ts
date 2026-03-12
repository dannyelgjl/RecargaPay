import type { RootState } from '../../store';

export const selectConnectivity = (state: RootState) => state.connectivity;
export const selectIsConnected = (state: RootState) =>
  state.connectivity.isConnected;
export const selectLastSuccessfulSyncAt = (state: RootState) =>
  state.connectivity.lastSuccessfulSyncAt;
