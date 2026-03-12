import type { TransactionItem } from '../../store/wallet/slice/walletSlice';

export type WalletScreenProps = Record<string, never>;
export type WalletListData = ArrayLike<TransactionItem> | null | undefined;
