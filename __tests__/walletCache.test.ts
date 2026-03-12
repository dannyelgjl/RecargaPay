const mockGetCache = jest.fn();
const mockSetCache = jest.fn();

jest.mock('../src/services/cache/cacheStorage', () => ({
  getCache: (...args: unknown[]) => mockGetCache(...args),
  setCache: (...args: unknown[]) => mockSetCache(...args),
}));

import {
  loadWalletSnapshot,
  saveWalletSnapshot,
} from '../src/services/wallet/walletCache';

describe('walletCache', () => {
  beforeEach(() => {
    mockGetCache.mockReset();
    mockSetCache.mockReset();
  });

  it('persists the wallet snapshot under the expected key', async () => {
    const snapshot = {
      balance: 100,
      transactions: [],
      transactionDetailsById: {},
      lastSyncedAt: '2026-03-11T10:00:00.000Z',
    };

    await saveWalletSnapshot(snapshot);

    expect(mockSetCache).toHaveBeenCalledWith('@wallet/snapshot', snapshot);
  });

  it('loads the wallet snapshot from the expected key', async () => {
    const snapshot = {
      balance: 10,
      transactions: [{ id: 'txn-001' }],
      transactionDetailsById: {},
      lastSyncedAt: null,
    };
    mockGetCache.mockResolvedValue(snapshot);

    await expect(loadWalletSnapshot()).resolves.toEqual(snapshot);
    expect(mockGetCache).toHaveBeenCalledWith('@wallet/snapshot');
  });
});
