import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.10:8080";

/**
 * Busca notificações para um usuário.
 * Backend esperado: GET /api/v1/users/{userId}/notifications
 */
export async function getNotifications(userId: number) {
  const resp = await axios.get(`${API}/api/v1/users/${userId}/notifications`);
  return resp.data; // ajustar conforme o formato retornado pelo backend
}

export async function acceptEventEntry(entryId: number) {
  const res = await axios.post(`${API}/api/v1/event-entries/${entryId}/accept`);
  return res.data;
}

export async function declineEventEntry(entryId: number) {
  const res = await axios.post(`${API}/api/v1/event-entries/${entryId}/decline`);
  return res.data;
}