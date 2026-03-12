import { Platform } from 'react-native';

const API_PORT = 3000;
const LOCALHOST = Platform.select({
  android: '10.0.2.2',
  default: 'localhost',
});

export const API_BASE_URL = `http://${LOCALHOST}:${API_PORT}`;

export const API_ENDPOINTS = {
  balance: '/balance',
  transactionsHistory: '/transactions-history',
  transactionDetail: (id: string) => `/transactions/${id}`,
} as const;

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}
