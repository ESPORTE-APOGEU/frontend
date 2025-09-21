// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: `https://${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1`, // ajuste
  timeout: 15000,
});

let tokenGetter: null | (() => Promise<string | null>) = null;
export function attachAuth(getTokenFn: () => Promise<string | null>) {
  tokenGetter = getTokenFn;
}

export const setAuthToken = (token?: string) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};
