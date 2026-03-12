import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  selectIsUnlocked,
  selectLastActiveAt,
  selectSessionTimeoutMs,
} from '../../store/auth/selector/authSelector';
import { lockSession } from './authService';
import { SESSION_CHECK_INTERVAL_MS } from '../../utils/constants/constants';

export function useSessionGuard() {
  const dispatch = useAppDispatch();
  const isUnlocked = useAppSelector(selectIsUnlocked);
  const lastActiveAt = useAppSelector(selectLastActiveAt);
  const sessionTimeoutMs = useAppSelector(selectSessionTimeoutMs);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    const intervalId = setInterval(() => {
      if (!lastActiveAt) {
        return;
      }

      if (Date.now() - lastActiveAt > sessionTimeoutMs) {
        dispatch(lockSession('timeout'));
      }
    }, SESSION_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [dispatch, isUnlocked, lastActiveAt, sessionTimeoutMs]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState !== 'active' && isUnlocked) {
        dispatch(lockSession('background'));
        return;
      }

      if (
        nextState === 'active' &&
        isUnlocked &&
        lastActiveAt &&
        Date.now() - lastActiveAt > sessionTimeoutMs
      ) {
        dispatch(lockSession('timeout'));
      }
    });

    return () => sub.remove();
  }, [dispatch, isUnlocked, lastActiveAt, sessionTimeoutMs]);
}
