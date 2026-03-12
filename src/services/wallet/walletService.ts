import { API_ENDPOINTS, fetchJson } from '../../config/api';

export type BalanceResponse = {
  balance: number;
};

export type TransactionHistoryItem = {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
};

export type TransactionDetailResponse = TransactionHistoryItem & {
  reference: string;
  category: string;
  recipient: string;
};

export function fetchBalanceRequest() {
  return fetchJson<BalanceResponse>(API_ENDPOINTS.balance);
}

export function fetchTransactionsHistoryRequest() {
  return fetchJson<TransactionHistoryItem[]>(API_ENDPOINTS.transactionsHistory);
}

export function fetchTransactionByIdRequest(id: string) {
  return fetchJson<TransactionDetailResponse>(
    API_ENDPOINTS.transactionDetail(id),
  );
}
