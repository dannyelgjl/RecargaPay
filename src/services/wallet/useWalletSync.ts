import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { touchSession } from '../../store/auth/slice/authSlice';
import { selectIsUnlocked } from '../../store/auth/selector/authSelector';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  bootstrapWallet,
  refreshWallet,
} from '../../store/wallet/slice/walletSlice';
import { WALLET_SYNC_INTERVAL_MS } from '../../utils/constants/constants';

export function useWalletSync() {
  const dispatch = useAppDispatch();
  const isUnlocked = useAppSelector(selectIsUnlocked);
  const didBootstrapRef = useRef(false);

  useEffect(() => {
    if (!isUnlocked || didBootstrapRef.current) {
      return;
    }

    didBootstrapRef.current = true;
    dispatch(bootstrapWallet());
    dispatch(refreshWallet());
  }, [dispatch, isUnlocked]);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    const intervalId = setInterval(() => {
      dispatch(refreshWallet({ silent: true }));
    }, WALLET_SYNC_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [dispatch, isUnlocked]);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        dispatch(touchSession());
        dispatch(refreshWallet({ silent: true }));
      }
    });

    return () => subscription.remove();
  }, [dispatch, isUnlocked]);
}
