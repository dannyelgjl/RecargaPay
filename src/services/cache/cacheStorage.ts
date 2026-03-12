import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setCache<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as T;
}

export async function removeCache(key: string) {
  await AsyncStorage.removeItem(key);
}
