import { WALLET_SNAPSHOT_CACHE_KEY } from '../../utils/constants/constants';
import { getCache, setCache } from '../cache/cacheStorage';
import type { WalletSnapshot } from '../../store/wallet/slice/walletSlice';

export async function saveWalletSnapshot(snapshot: WalletSnapshot) {
  await setCache(WALLET_SNAPSHOT_CACHE_KEY, snapshot);
}

export async function loadWalletSnapshot() {
  return getCache<WalletSnapshot>(WALLET_SNAPSHOT_CACHE_KEY);
}
