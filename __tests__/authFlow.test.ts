import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../src/store/auth/slice/authSlice';
import { connectivityReducer } from '../src/store/connectivity/slice/connectivitySlice';
import {
  bootstrapAuth,
  createPin,
  lockSession,
  unlockWithPin,
} from '../src/services/auth/authService';
import { walletReducer } from '../src/store/wallet/slice/walletSlice';

const mockSecureGetItem = jest.fn();
const mockSecureSetItem = jest.fn();
const mockAnalyticsTrack = jest.fn();

jest.mock('../src/services/secure/secureStorage', () => ({
  secureGetItem: (...args: unknown[]) => mockSecureGetItem(...args),
  secureSetItem: (...args: unknown[]) => mockSecureSetItem(...args),
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

describe('auth flow', () => {
  beforeEach(() => {
    mockSecureGetItem.mockReset();
    mockSecureSetItem.mockReset();
    mockAnalyticsTrack.mockReset();
  });

  it('creates a PIN and unlocks with the correct value', async () => {
    const store = createTestStore();

    mockSecureSetItem.mockResolvedValue(undefined);
    await store.dispatch(createPin('1234'));

    expect(mockSecureSetItem).toHaveBeenCalledWith('wallet_pin_value', '1234');
    expect(store.getState().auth.hasPin).toBe(true);
    expect(store.getState().auth.isUnlocked).toBe(true);

    store.dispatch(lockSession('manual'));
    mockSecureGetItem.mockResolvedValue('1234');

    await store.dispatch(unlockWithPin('1234'));

    expect(store.getState().auth.isUnlocked).toBe(true);
    expect(store.getState().auth.failedAttempts).toBe(0);
    expect(mockAnalyticsTrack).toHaveBeenCalledWith({
      name: 'pin_unlock_succeeded',
    });
  });

  it('bootstraps auth based on whether a PIN is already stored', async () => {
    const store = createTestStore();

    mockSecureGetItem.mockResolvedValueOnce('1234');
    await store.dispatch(bootstrapAuth());

    expect(store.getState().auth.isBootstrapped).toBe(true);
    expect(store.getState().auth.hasPin).toBe(true);

    mockSecureGetItem.mockResolvedValueOnce(null);
    await store.dispatch(bootstrapAuth());

    expect(store.getState().auth.hasPin).toBe(false);
  });

  it('tracks failed unlock attempts without exposing the PIN', async () => {
    const store = createTestStore();

    mockSecureGetItem.mockResolvedValue('1234');
    await store.dispatch(unlockWithPin('0000'));

    expect(store.getState().auth.isUnlocked).toBe(false);
    expect(store.getState().auth.failedAttempts).toBe(1);
    expect(mockAnalyticsTrack).toHaveBeenCalledWith({
      name: 'pin_unlock_failed',
      params: { attempts: 1 },
    });
  });
});
