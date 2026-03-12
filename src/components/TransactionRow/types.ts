import type { TransactionItem } from '../../store/wallet/slice/walletSlice';

export type TransactionRowProps = {
  item: TransactionItem;
  onPress: () => void;
};

export type TransactionType = TransactionItem['type'];
export type TransactionStatus = TransactionItem['status'];
