// src/services/api.ts
import axios from "axios";

let tokenGetter: null | (() => Promise<string | null>) = null;
// src/services/api.ts
export function attachAuth(getTokenFn: () => Promise<string | null>) {
  tokenGetter = getTokenFn;
}

const RAW_BASE =
  process.env.EXPO_PUBLIC_BACKEND_URL ??
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

// remove barras finais duplicadas

export const api = axios.create({
  // NÃO force https; seu back roda em http
  baseURL: `${RAW_BASE}/api/v1`,
  timeout: 15000,
});

// injeta o Bearer do Clerk automaticamente
api.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
