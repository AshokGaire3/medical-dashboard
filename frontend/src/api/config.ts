const rawUrl =
 (import.meta.env.VITE_API_URL as string | undefined) ||
 (import.meta.env.PROD
 ? (import.meta.env.VITE_PROD_API_URL as string | undefined) || ''
 : 'http://localhost:5000/api');

function normalize(url: string): string {
 if (!url) return '';
 let u = url.trim();
 if (u.startsWith('https://localhost:5000')) {
 u = u.replace('https://', 'http://');
 }
 while (u.endsWith('/')) u = u.slice(0, -1);
 return u;
}

export const API_BASE_URL = normalize(rawUrl);

if (import.meta.env.DEV) {
 // eslint-disable-next-line no-console
 console.info('[api] base URL:', API_BASE_URL || '(not set)');
}

export const TOKEN_STORAGE_KEY = 'meddash.token';
export const USER_STORAGE_KEY = 'meddash.user';
