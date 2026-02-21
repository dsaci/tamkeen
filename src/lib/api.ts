
const env = (import.meta as any).env || {};
const API_BASE = (env.VITE_API_URL as string) || '';

export type GetToken = () => Promise<string | null>;

let getTokenFn: GetToken = async () => null;

export function setAuthTokenGetter(fn: GetToken) {
  getTokenFn = fn;
}

export async function apiFetch(
  path: string,
  opts: RequestInit & { skipAuth?: boolean } = {}
): Promise<Response> {
  const { skipAuth, ...init } = opts;
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  if (!skipAuth && getTokenFn) {
    const token = await getTokenFn();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const base = API_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${base}${p}`;
  return fetch(url, { ...init, headers });
}

export async function apiJson<T = unknown>(
  path: string,
  init?: RequestInit & { skipAuth?: boolean }
): Promise<{ data?: T; success?: boolean; error?: string; code?: string }> {
  const res = await apiFetch(path, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
  return body;
}