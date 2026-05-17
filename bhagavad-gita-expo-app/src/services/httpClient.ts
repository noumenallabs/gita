export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  getHeaders?: () => Promise<Record<string, string>>;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
  skipRetry?: boolean;
}

const activeRequests = new Map<string, Promise<unknown>>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status >= 500 || error.status === 429;
  }
  if (error instanceof TimeoutError || error instanceof NetworkError) {
    return true;
  }
  return false;
}

export function createHttpClient(config: HttpClientConfig) {
  const {
    baseUrl,
    timeout = 15000,
    retries = 2,
    getHeaders,
  } = config;

  async function request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers: extraHeaders,
      timeout: requestTimeout = timeout,
      signal,
      skipRetry = false,
    } = options;

    const url = `${baseUrl}${path}`;
    const requestKey = `${method}:${url}:${JSON.stringify(body) ?? ''}`;

    if (method === 'GET' && activeRequests.has(requestKey)) {
      return activeRequests.get(requestKey) as Promise<T>;
    }

    const maxAttempts = skipRetry ? 1 : retries + 1;
    let lastError: unknown;

    const requestPromise = (async () => {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (attempt > 0 && isRetryableError(lastError)) {
          const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          const jitter = Math.random() * 200;
          await sleep(backoff + jitter);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

        if (signal) {
          signal.addEventListener('abort', () => controller.abort());
        }

        try {
          const baseHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
          };

          if (getHeaders) {
            const dynamicHeaders = await getHeaders();
            Object.assign(baseHeaders, dynamicHeaders);
          }

          const response = await fetch(url, {
            method,
            headers: {
              ...baseHeaders,
              ...extraHeaders,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const waitMs = retryAfter
              ? parseInt(retryAfter, 10) * 1000
              : 5000;
            lastError = new ApiError('Rate limited', 429, 'RATE_LIMITED');
            if (attempt < maxAttempts - 1) {
              await sleep(waitMs);
              continue;
            }
            throw lastError;
          }

          if (!response.ok) {
            let errorBody: { error?: { code?: string; message?: string } } = {};
            try {
              errorBody = await response.json();
            } catch {
              // Response may not be JSON
            }

            throw new ApiError(
              errorBody?.error?.message ?? `HTTP ${response.status}`,
              response.status,
              errorBody?.error?.code ?? 'UNKNOWN'
            );
          }

          return (await response.json()) as T;
        } catch (error: unknown) {
          clearTimeout(timeoutId);

          if (error instanceof ApiError) {
            lastError = error;
            if (!isRetryableError(error) || skipRetry) {
              throw error;
            }
            continue;
          }

          if (
            error instanceof DOMException &&
            error.name === 'AbortError'
          ) {
            lastError = new TimeoutError();
            if (skipRetry) throw lastError;
            continue;
          }

          if (
            error instanceof TypeError &&
            (error.message.includes('Network request failed') ||
              error.message.includes('fetch'))
          ) {
            lastError = new NetworkError('Network request failed');
            if (skipRetry) throw lastError;
            continue;
          }

          throw error;
        }
      }

      throw lastError ?? new Error('Request failed');
    })();

    if (method === 'GET') {
      activeRequests.set(requestKey, requestPromise);
      requestPromise.finally(() => {
        activeRequests.delete(requestKey);
      });
    }

    return requestPromise as Promise<T>;
  }

  return {
    get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
      return request<T>(path, { ...options, method: 'GET' });
    },
    post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
      return request<T>(path, { ...options, method: 'POST', body });
    },
    put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
      return request<T>(path, { ...options, method: 'PUT', body });
    },
    delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
      return request<T>(path, { ...options, method: 'DELETE' });
    },
  };
}
