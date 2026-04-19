import { API_BASE_URL, TOKEN_STORAGE_KEY } from './config';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;
  payload?: unknown;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
    payload?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.payload = payload;
  }
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  skipAuth?: boolean;
  responseType?: 'json' | 'blob' | 'text';
}

type Listener = (event: 'unauthorized') => void;
const listeners = new Set<Listener>();

export function onAuthEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitUnauthorized() {
  listeners.forEach((fn) => fn('unauthorized'));
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`, window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      url.searchParams.append(key, String(value));
    }
  }
  return url.toString();
}

async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.params);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers ?? {}),
  };

  if (opts.body !== undefined && !(opts.body instanceof FormData)) {
    headers['Content-Type'] ??= 'application/json';
  }

  if (!opts.skipAuth) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      signal: opts.signal,
      body:
        opts.body === undefined
          ? undefined
          : opts.body instanceof FormData
            ? opts.body
            : JSON.stringify(opts.body),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    const msg =
      err instanceof TypeError
        ? `Cannot reach the API at ${API_BASE_URL || '(unset)'}. Is the backend running?`
        : (err as Error).message;
    throw new ApiError(msg, 0);
  }

  if (response.status === 401 && !opts.skipAuth) {
    emitUnauthorized();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (opts.responseType === 'blob') {
    if (!response.ok) await throwFromResponse(response);
    return (await response.blob()) as T;
  }
  if (opts.responseType === 'text') {
    const text = await response.text();
    if (!response.ok) throw new ApiError(text || response.statusText, response.status);
    return text as T;
  }

  const text = await response.text();
  const data = text ? safeJson(text) : undefined;

  if (!response.ok) {
    const message =
      (isProblem(data) && (data.detail || data.title)) ||
      (isRecord(data) && typeof data.message === 'string' && data.message) ||
      response.statusText ||
      `Request failed (${response.status})`;

    const fieldErrors =
      isProblem(data) && isRecord(data.errors)
        ? (data.errors as Record<string, string[]>)
        : undefined;

    throw new ApiError(message, response.status, fieldErrors, data);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isProblem(v: unknown): v is Record<string, unknown> & { title?: string; detail?: string } {
  return isRecord(v) && (typeof v.title === 'string' || typeof v.detail === 'string');
}

async function throwFromResponse(response: Response): Promise<never> {
  let message = response.statusText;
  try {
    const text = await response.text();
    if (text) message = text;
  } catch {
    /* ignore */
  }
  throw new ApiError(message, response.status);
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>('GET', path, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('POST', path, { ...opts, body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PUT', path, { ...opts, body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PATCH', path, { ...opts, body }),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, opts),
};
