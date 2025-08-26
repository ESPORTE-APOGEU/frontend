import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.10:8080";

/**
 * Busca notificações para um usuário.
 * Backend esperado: GET /api/v1/users/{userId}/notifications
 */
export async function getNotifications(userId: number) {
  const token = await SecureStore.getItemAsync("token");
  const resp = await axios.get(`${API}/api/v1/users/${userId}/notifications`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  console.log('[NotificationService] GET notifications for userId=', userId, 'resp.data=', resp.data);
  return resp.data;
}

export async function acceptEventEntry(entryId: number) {
  const token = await SecureStore.getItemAsync("token");
  const res = await axios.post(
    `${API}/api/v1/event-entries/${entryId}/accept`,
    {},
    { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
  );
  return res.data;
}

export async function declineEventEntry(entryId: number) {
  const token = await SecureStore.getItemAsync("token");
  const res = await axios.post(
    `${API}/api/v1/event-entries/${entryId}/decline`,
    {},
    { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
  );
  return res.data;
}