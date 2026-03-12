const mockFetchJson = jest.fn();

jest.mock('../src/config/api', () => ({
  API_ENDPOINTS: {
    balance: '/balance',
    transactionsHistory: '/transactions-history',
    transactionDetail: (id: string) => `/transactions/${id}`,
  },
  fetchJson: (...args: unknown[]) => mockFetchJson(...args),
}));

import {
  fetchBalanceRequest,
  fetchTransactionByIdRequest,
  fetchTransactionsHistoryRequest,
} from '../src/services/wallet/walletService';

describe('walletService', () => {
  beforeEach(() => {
    mockFetchJson.mockReset();
  });

  it('requests the wallet balance contract', async () => {
    mockFetchJson.mockResolvedValue({ balance: 50 });

    await expect(fetchBalanceRequest()).resolves.toEqual({ balance: 50 });
    expect(mockFetchJson).toHaveBeenCalledWith('/balance');
  });

  it('requests the transactions history contract', async () => {
    const history = [{ id: 'txn-001' }];
    mockFetchJson.mockResolvedValue(history);

    await expect(fetchTransactionsHistoryRequest()).resolves.toEqual(history);
    expect(mockFetchJson).toHaveBeenCalledWith('/transactions-history');
  });

  it('requests a transaction detail by id', async () => {
    const detail = { id: 'txn-002' };
    mockFetchJson.mockResolvedValue(detail);

    await expect(fetchTransactionByIdRequest('txn-002')).resolves.toEqual(
      detail,
    );
    expect(mockFetchJson).toHaveBeenCalledWith('/transactions/txn-002');
  });
});
