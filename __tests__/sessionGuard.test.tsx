import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { AppState } from 'react-native';

import { authReducer } from '../src/store/auth/slice/authSlice';
import { connectivityReducer } from '../src/store/connectivity/slice/connectivitySlice';
import { useSessionGuard } from '../src/services/auth/useSessionGuard';
import { walletReducer } from '../src/store/wallet/slice/walletSlice';
import {
  SESSION_CHECK_INTERVAL_MS,
  SESSION_TIMEOUT_MS,
} from '../src/utils/constants/constants';

jest.mock('react-native', () => ({
  AppState: {
    addEventListener: jest.fn(),
  },
  Platform: {
    select: (options: Record<string, string>) =>
      options.ios ?? options.default,
  },
}));

function SessionGuardHarness() {
  useSessionGuard();
  return null;
}

function createTestStore(authOverrides: Record<string, unknown> = {}) {
  const reducer = {
    auth: authReducer,
    wallet: walletReducer,
    connectivity: connectivityReducer,
  };
  const baseStore = configureStore({ reducer });
  const baseState = baseStore.getState();

  return configureStore({
    reducer,
    preloadedState: {
      ...baseState,
      auth: {
        ...baseState.auth,
        isBootstrapped: true,
        hasPin: true,
        isUnlocked: true,
        lastActiveAt: Date.now(),
        lockReason: null,
        sessionTimeoutMs: SESSION_TIMEOUT_MS,
        ...authOverrides,
      },
    },
  });
}

describe('useSessionGuard', () => {
  let appStateListener: ((state: string) => void) | null = null;
  let renderer: ReactTestRenderer | null = null;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-11T12:00:00.000Z'));
    appStateListener = null;

    (AppState.addEventListener as jest.Mock).mockImplementation(
      (_event: string, listener: (state: string) => void) => {
        appStateListener = listener;

        return {
          remove: jest.fn(),
        };
      },
    );
  });

  afterEach(() => {
    if (renderer) {
      act(() => {
        renderer?.unmount();
      });
    }

    renderer = null;
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('locks the session after the inactivity timeout elapses', () => {
    const now = Date.now();
    const store = createTestStore({
      lastActiveAt: now - SESSION_TIMEOUT_MS - 1,
    });

    act(() => {
      renderer = create(
        <Provider store={store}>
          <SessionGuardHarness />
        </Provider>,
      );
    });

    act(() => {
      jest.advanceTimersByTime(SESSION_CHECK_INTERVAL_MS);
    });

    expect(store.getState().auth.isUnlocked).toBe(false);
    expect(store.getState().auth.lockReason).toBe('timeout');
  });

  it('locks the session when the app goes to the background', () => {
    const store = createTestStore();

    act(() => {
      renderer = create(
        <Provider store={store}>
          <SessionGuardHarness />
        </Provider>,
      );
    });

    act(() => {
      appStateListener?.('background');
    });

    expect(store.getState().auth.isUnlocked).toBe(false);
    expect(store.getState().auth.lockReason).toBe('background');
  });

  it('does not lock on the interval when there is no last activity timestamp', () => {
    const store = createTestStore({
      lastActiveAt: null,
    });

    act(() => {
      renderer = create(
        <Provider store={store}>
          <SessionGuardHarness />
        </Provider>,
      );
    });

    act(() => {
      jest.advanceTimersByTime(SESSION_CHECK_INTERVAL_MS);
    });

    expect(store.getState().auth.isUnlocked).toBe(true);
    expect(store.getState().auth.lockReason).toBeNull();
  });

  it('locks the session when the app becomes active after the timeout already expired', () => {
    const store = createTestStore({
      lastActiveAt: Date.now() - SESSION_TIMEOUT_MS - 1,
    });

    act(() => {
      renderer = create(
        <Provider store={store}>
          <SessionGuardHarness />
        </Provider>,
      );
    });

    act(() => {
      appStateListener?.('active');
    });

    expect(store.getState().auth.isUnlocked).toBe(false);
    expect(store.getState().auth.lockReason).toBe('timeout');
  });

  it('does not lock when the user is already locked and the app state changes', () => {
    const store = createTestStore({
      isUnlocked: false,
    });

    act(() => {
      renderer = create(
        <Provider store={store}>
          <SessionGuardHarness />
        </Provider>,
      );
    });

    act(() => {
      appStateListener?.('background');
      appStateListener?.('active');
      jest.advanceTimersByTime(SESSION_CHECK_INTERVAL_MS);
    });

    expect(store.getState().auth.isUnlocked).toBe(false);
    expect(store.getState().auth.lockReason).toBeNull();
  });
});
