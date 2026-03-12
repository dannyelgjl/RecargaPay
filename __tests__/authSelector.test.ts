import {
  selectAuth,
  selectFailedAttempts,
  selectHasPin,
  selectIsBootstrapped,
  selectIsUnlocked,
  selectLastActiveAt,
  selectPendingPin,
  selectSessionTimeoutMs,
} from '../src/store/auth/selector/authSelector';

describe('auth selectors', () => {
  const state = {
    auth: {
      isBootstrapped: true,
      hasPin: true,
      isUnlocked: false,
      failedAttempts: 2,
      pendingPin: '1234',
      lastActiveAt: 123456,
      lockReason: 'manual',
      sessionTimeoutMs: 120000,
    },
  } as any;

  it('selects the full auth state', () => {
    expect(selectAuth(state)).toBe(state.auth);
  });

  it('selects each auth field used by the app', () => {
    expect(selectHasPin(state)).toBe(true);
    expect(selectIsUnlocked(state)).toBe(false);
    expect(selectIsBootstrapped(state)).toBe(true);
    expect(selectPendingPin(state)).toBe('1234');
    expect(selectFailedAttempts(state)).toBe(2);
    expect(selectLastActiveAt(state)).toBe(123456);
    expect(selectSessionTimeoutMs(state)).toBe(120000);
  });
});
