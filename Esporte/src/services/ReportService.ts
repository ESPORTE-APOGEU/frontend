import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API = process.env.EXPO_PUBLIC_BACKEND_URL;

export type CreateReportPayload = {
  type: string;
  description?: string;
  reportedUserId?: string;
  eventId?: string | number;
};

export async function createReport(payload: CreateReportPayload) {
  const token = await SecureStore.getItemAsync('token');
  const res = await axios.post(`${API}/api/v1/reports`, payload, {
    headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
  });
  return res;
}