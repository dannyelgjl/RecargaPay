import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getCache,
  removeCache,
  setCache,
} from '../src/services/cache/cacheStorage';

describe('cacheStorage', () => {
  const storage = AsyncStorage as unknown as {
    setItem: jest.Mock;
    getItem: jest.Mock;
    removeItem: jest.Mock;
  };

  beforeEach(() => {
    storage.setItem.mockClear();
    storage.getItem.mockClear();
    storage.removeItem.mockClear();
  });

  it('serializes values before saving them', async () => {
    const payload = { balance: 100, transactions: [] };

    await setCache('wallet', payload);

    expect(storage.setItem).toHaveBeenCalledWith(
      'wallet',
      JSON.stringify(payload),
    );
  });

  it('returns null when no cached value exists', async () => {
    storage.getItem.mockResolvedValueOnce(null);

    await expect(getCache('wallet')).resolves.toBeNull();
  });

  it('deserializes cached values when they exist', async () => {
    storage.getItem.mockResolvedValueOnce(JSON.stringify({ balance: 42 }));

    await expect(getCache<{ balance: number }>('wallet')).resolves.toEqual({
      balance: 42,
    });
  });

  it('removes a cached key', async () => {
    await removeCache('wallet');

    expect(storage.removeItem).toHaveBeenCalledWith('wallet');
  });
});
