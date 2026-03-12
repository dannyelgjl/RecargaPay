import { useEffect } from 'react';

import { touchSession } from '../../store/auth/slice/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectTransactionById } from '../../store/wallet/selector/walletSelector';
import {
  clearTransactionDetailError,
  fetchTransactionDetail,
} from '../../store/wallet/slice/walletSlice';
import type { TransactionDetailScreenProps } from './types';

export const useContainer = ({ route }: TransactionDetailScreenProps) => {
  const dispatch = useAppDispatch();
  const { transactionId } = route.params;
  const transaction = useAppSelector(selectTransactionById(transactionId));
  const { detailError, isDetailLoading } = useAppSelector(state => state.wallet);

  useEffect(() => {
    dispatch(fetchTransactionDetail(transactionId));

    return () => {
      dispatch(clearTransactionDetailError());
    };
  }, [dispatch, transactionId]);

  const handleTouchStart = () => {
    dispatch(touchSession());
  };

  return {
    detailError,
    handleTouchStart,
    isDetailLoading,
    transaction,
  };
};
