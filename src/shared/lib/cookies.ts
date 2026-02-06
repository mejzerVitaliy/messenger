const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_MINUTES = 15;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const ACCESS_TOKEN_DAYS =
  ACCESS_TOKEN_MINUTES / (HOURS_PER_DAY * MINUTES_PER_HOUR);
const REFRESH_TOKEN_DAYS = 7;
const MS_PER_DAY = 864e5;

export const getAccessToken = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  return getCookie(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  return getCookie(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  setCookie(ACCESS_TOKEN_KEY, accessToken, ACCESS_TOKEN_DAYS);
  setCookie(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_DAYS);
};

export const removeTokens = (): void => {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date(Date.now() + days * MS_PER_DAY).toUTCString();

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};
