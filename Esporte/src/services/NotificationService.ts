import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.10:8080";

/**
 * Busca notificações para um usuário.
 * Backend real: GET /api/v1/notifications/{userId}/notifications
 */
export async function getNotifications(userId: number) {
  const token = await SecureStore.getItemAsync("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const resp = await axios.get(`${API}/api/v1/notifications/${userId}/notifications`, { headers });
  return resp.data;
}

export async function acceptEventEntry(entryId: number) {
  const token = await SecureStore.getItemAsync("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.post(`${API}/api/v1/event-entries/${entryId}/accept`, {}, { headers });
}

export async function declineEventEntry(entryId: number) {
  const token = await SecureStore.getItemAsync("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return axios.post(`${API}/api/v1/event-entries/${entryId}/decline`, {}, { headers });
}

// Deletar notificação (compatível com o backend)
export async function deleteNotification(notificationId: number) {
  const token = await SecureStore.getItemAsync("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  await axios.delete(`${API}/api/v1/notifications/${notificationId}`, { headers });
}