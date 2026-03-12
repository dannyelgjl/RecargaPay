import type { RootState } from '../../store';

export const selectAuth = (state: RootState) => state.auth;
export const selectHasPin = (state: RootState) => state.auth.hasPin;
export const selectIsUnlocked = (state: RootState) => state.auth.isUnlocked;
export const selectIsBootstrapped = (state: RootState) =>
  state.auth.isBootstrapped;
export const selectPendingPin = (state: RootState) => state.auth.pendingPin;
export const selectFailedAttempts = (state: RootState) =>
  state.auth.failedAttempts;
export const selectLastActiveAt = (state: RootState) =>
  state.auth.lastActiveAt;
export const selectSessionTimeoutMs = (state: RootState) =>
  state.auth.sessionTimeoutMs;
