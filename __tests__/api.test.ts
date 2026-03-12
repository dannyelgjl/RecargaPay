describe('api config', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.clearAllMocks();
    jest.resetModules();
  });

  function loadApiModule(platform: 'android' | 'ios' = 'ios') {
    jest.resetModules();
    jest.doMock('react-native', () => ({
      Platform: {
        select: (options: { android?: string; default?: string }) =>
          platform === 'android' ? options.android : options.default,
      },
    }));

    return require('../src/config/api') as typeof import('../src/config/api');
  }

  it('builds the Android base URL with the emulator host', () => {
    const { API_BASE_URL } = loadApiModule('android');

    expect(API_BASE_URL).toBe('http://10.0.2.2:3000');
  });

  it('builds the default base URL with localhost', () => {
    const { API_BASE_URL, API_ENDPOINTS } = loadApiModule('ios');

    expect(API_BASE_URL).toBe('http://localhost:3000');
    expect(API_ENDPOINTS.transactionDetail('txn-1')).toBe('/transactions/txn-1');
  });

  it('fetches JSON and merges default headers', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ balance: 123 }),
    };
    globalThis.fetch = jest.fn().mockResolvedValue(mockResponse) as typeof fetch;

    const { fetchJson } = loadApiModule('ios');
    const result = await fetchJson<{ balance: number }>('/balance');

    expect(result).toEqual({ balance: 123 });
    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/balance', {
      headers: {
        Accept: 'application/json',
      },
    });
  });

  it('preserves custom headers and throws on HTTP errors', async () => {
    const mockResponse = {
      ok: false,
      status: 503,
      json: jest.fn(),
    };
    globalThis.fetch = jest.fn().mockResolvedValue(mockResponse) as typeof fetch;

    const { fetchJson } = loadApiModule('ios');

    await expect(
      fetchJson('/balance', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    ).rejects.toThrow('HTTP 503');

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/balance', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer token',
      },
    });
  });
});
