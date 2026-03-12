import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  bootstrapAuth,
  createPin,
  unlockWithPin,
  lockSession,
} from '../../../services/auth/authService';
import { SESSION_TIMEOUT_MS } from '../../../utils/constants/constants';

export type AuthState = {
  isBootstrapped: boolean;
  hasPin: boolean;
  isUnlocked: boolean;
  failedAttempts: number;
  pendingPin: string | null;
  lastActiveAt: number | null;
  lockReason: 'app_start' | 'background' | 'timeout' | 'manual' | null;
  sessionTimeoutMs: number;
};

const initialState: AuthState = {
  isBootstrapped: false,
  hasPin: false,
  isUnlocked: false,
  failedAttempts: 0,
  pendingPin: null,
  lastActiveAt: null,
  lockReason: 'app_start',
  sessionTimeoutMs: SESSION_TIMEOUT_MS,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPendingPin(state, action: PayloadAction<string | null>) {
      state.pendingPin = action.payload;
    },
    touchSession(state) {
      if (state.isUnlocked) {
        state.lastActiveAt = Date.now();
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.isBootstrapped = true;
        state.hasPin = action.payload.hasPin;
        state.isUnlocked = false;
      })
      .addCase(bootstrapAuth.rejected, state => {
        state.isBootstrapped = true;
        state.hasPin = false;
        state.isUnlocked = false;
      })
      .addCase(createPin.fulfilled, state => {
        state.hasPin = true;
        state.isUnlocked = true;
        state.pendingPin = null;
        state.failedAttempts = 0;
        state.lastActiveAt = Date.now();
        state.lockReason = null;
      })
      .addCase(unlockWithPin.fulfilled, (state, action) => {
        state.isUnlocked = action.payload.success;
        state.failedAttempts = action.payload.success
          ? 0
          : state.failedAttempts + 1;
        state.lastActiveAt = action.payload.success
          ? Date.now()
          : state.lastActiveAt;
        state.lockReason = action.payload.success ? null : state.lockReason;
      })
      .addCase(lockSession, (state, action) => {
        state.isUnlocked = false;
        state.lockReason = action.payload;
      });
  },
});

export const { setPendingPin, touchSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
