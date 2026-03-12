import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

type NativeSecureStorageModule = {
  setItem?: (key: string, value: string) => Promise<void>;
  getItem?: (key: string) => Promise<string | null>;
  removeItem?: (key: string) => Promise<void>;
};

const FALLBACK_PREFIX = 'secure:';

function getNativeModule(): NativeSecureStorageModule | null {
  const module = NativeModules.SecureStorageModule as
    | NativeSecureStorageModule
    | undefined;

  if (
    module &&
    typeof module.setItem === 'function' &&
    typeof module.getItem === 'function' &&
    typeof module.removeItem === 'function'
  ) {
    return module;
  }

  return null;
}

function getFallbackKey(key: string) {
  return `${FALLBACK_PREFIX}${key}`;
}

export async function secureSetItem(key: string, value: string) {
  const nativeModule = getNativeModule();

  if (nativeModule) {
    await nativeModule.setItem?.(key, value);
    return;
  }

  await AsyncStorage.setItem(getFallbackKey(key), value);
}

export async function secureGetItem(key: string) {
  const nativeModule = getNativeModule();

  if (nativeModule) {
    return nativeModule.getItem?.(key) ?? null;
  }

  return AsyncStorage.getItem(getFallbackKey(key));
}

export async function secureRemoveItem(key: string) {
  const nativeModule = getNativeModule();

  if (nativeModule) {
    await nativeModule.removeItem?.(key);
    return;
  }

  await AsyncStorage.removeItem(getFallbackKey(key));
}

export function hasNativeSecureStorage() {
  return getNativeModule() !== null;
}
