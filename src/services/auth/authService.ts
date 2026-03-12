import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

import {
  secureGetItem,
  secureSetItem,
} from '../../services/secure/secureStorage';
import { SECURE_KEYS } from '../../utils/constants/constants';
import { analytics } from '../../feature/analytics/analytics';
import type { RootState } from '../../store/store';

export const lockSession = createAction<
  'app_start' | 'background' | 'timeout' | 'manual'
>('auth/lockSession');

export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrapAuth',
  async () => {
    const storedPin = await secureGetItem(SECURE_KEYS.PIN_VALUE);

    return {
      hasPin: Boolean(storedPin),
    };
  },
);

export const createPin = createAsyncThunk(
  'auth/createPin',
  async (pin: string) => {
    await secureSetItem(SECURE_KEYS.PIN_VALUE, pin);
    analytics.track({ name: 'pin_created' });
    return true;
  },
);

export const unlockWithPin = createAsyncThunk(
  'auth/unlockWithPin',
  async (pin: string, { getState }) => {
    const storedPin = await secureGetItem(SECURE_KEYS.PIN_VALUE);
    const success = Boolean(storedPin && pin === storedPin);

    if (success) {
      analytics.track({ name: 'pin_unlock_succeeded' });
    } else {
      const state = getState() as RootState;
      analytics.track({
        name: 'pin_unlock_failed',
        params: { attempts: state.auth.failedAttempts + 1 },
      });
    }

    return { success };
  },
);
