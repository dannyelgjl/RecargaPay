import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';

import { analytics } from '../../feature/analytics/analytics';
import { useI18n } from '../../i18n';
import { useWalletSync } from '../../services/wallet/useWalletSync';
import { touchSession } from '../../store/auth/slice/authSlice';
import { selectIsConnected } from '../../store/connectivity/selector/connectivitySelector';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  refreshWallet,
  type TransactionItem,
} from '../../store/wallet/slice/walletSlice';

export const useContainer = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { deviceLanguage, t } = useI18n();
  const isConnected = useAppSelector(selectIsConnected);
  const {
    balance,
    transactions,
    isLoading,
    isRefreshing,
    error,
    lastSyncedAt,
    isOfflineSnapshot,
  } = useAppSelector(state => state.wallet);
  useWalletSync();

  useEffect(() => {
    analytics.track({ name: 'wallet_opened' });
  }, []);

  const handleRefresh = useCallback(() => {
    dispatch(touchSession());
    analytics.track({ name: 'wallet_refresh' });
    dispatch(refreshWallet());
  }, [dispatch]);

  const handlePressTransaction = useCallback(
    (item: TransactionItem) => {
      dispatch(touchSession());
      analytics.track({
        name: 'transaction_opened',
        params: { transactionId: item.id },
      });
      navigation.navigate('TransactionDetail', { transactionId: item.id });
    },
    [dispatch, navigation],
  );

  const handleListScroll = useCallback(() => {
    dispatch(touchSession());
  }, [dispatch]);

  return {
    balance,
    deviceLanguage:
      deviceLanguage === 'unavailable' || deviceLanguage === 'unknown'
        ? t('common.unavailable')
        : deviceLanguage,
    error,
    handleListScroll,
    handlePressTransaction,
    handleRefresh,
    isConnected,
    isInitialLoading:
      isLoading && transactions.length === 0 && balance === null && !error,
    isOfflineSnapshot,
    isRefreshing,
    lastSyncedAt,
    shouldShowRetry:
      Boolean(error) && transactions.length === 0 && balance === null,
    transactions,
  };
};
