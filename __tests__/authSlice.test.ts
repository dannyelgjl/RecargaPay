import { bootstrapAuth, createPin, lockSession, unlockWithPin } from '../src/services/auth/authService';
import {
  authReducer,
  setPendingPin,
  touchSession,
} from '../src/store/auth/slice/authSlice';

describe('authSlice', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-11T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('stores the pending PIN during setup', () => {
    const state = authReducer(undefined, setPendingPin('1234'));

    expect(state.pendingPin).toBe('1234');
  });

  it('touches the session only when the wallet is unlocked', () => {
    const initial = authReducer(undefined, { type: '@@INIT' });
    const lockedState = authReducer(initial, touchSession());
    const unlockedState = authReducer(
      {
        ...initial,
        isUnlocked: true,
      },
      touchSession(),
    );

    expect(lockedState.lastActiveAt).toBeNull();
    expect(unlockedState.lastActiveAt).toBe(Date.now());
  });

  it('handles bootstrap rejection by marking auth as bootstrapped and locked', () => {
    const state = authReducer(
      {
        ...authReducer(undefined, { type: '@@INIT' }),
        hasPin: true,
        isUnlocked: true,
      },
      bootstrapAuth.rejected(new Error('fail'), 'req'),
    );

    expect(state.isBootstrapped).toBe(true);
    expect(state.hasPin).toBe(false);
    expect(state.isUnlocked).toBe(false);
  });

  it('clears setup state after a successful PIN creation', () => {
    const state = authReducer(
      {
        ...authReducer(undefined, { type: '@@INIT' }),
        pendingPin: '1234',
        failedAttempts: 3,
        lockReason: 'manual',
      },
      createPin.fulfilled(true, 'req', '1234'),
    );

    expect(state.hasPin).toBe(true);
    expect(state.isUnlocked).toBe(true);
    expect(state.pendingPin).toBeNull();
    expect(state.failedAttempts).toBe(0);
    expect(state.lockReason).toBeNull();
    expect(state.lastActiveAt).toBe(Date.now());
  });

  it('increments failed attempts when unlock fails and resets them when it succeeds', () => {
    const failedState = authReducer(
      {
        ...authReducer(undefined, { type: '@@INIT' }),
        failedAttempts: 1,
        lastActiveAt: 10,
        lockReason: 'manual',
      },
      unlockWithPin.fulfilled({ success: false }, 'req', '0000'),
    );
    const succeededState = authReducer(
      {
        ...failedState,
        failedAttempts: 2,
      },
      unlockWithPin.fulfilled({ success: true }, 'req', '1234'),
    );

    expect(failedState.isUnlocked).toBe(false);
    expect(failedState.failedAttempts).toBe(2);
    expect(failedState.lastActiveAt).toBe(10);
    expect(failedState.lockReason).toBe('manual');

    expect(succeededState.isUnlocked).toBe(true);
    expect(succeededState.failedAttempts).toBe(0);
    expect(succeededState.lockReason).toBeNull();
    expect(succeededState.lastActiveAt).toBe(Date.now());
  });

  it('locks the session with the provided reason', () => {
    const state = authReducer(
      {
        ...authReducer(undefined, { type: '@@INIT' }),
        isUnlocked: true,
      },
      lockSession('background'),
    );

    expect(state.isUnlocked).toBe(false);
    expect(state.lockReason).toBe('background');
  });
});
