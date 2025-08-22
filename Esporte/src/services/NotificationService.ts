import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.10:8080";

/**
 * Busca notificações para um usuário.
 * Backend esperado: GET /api/v1/users/{userId}/notifications
 */
export async function getNotifications(userId: number) {
  const resp = await axios.get(`${API}/api/v1/users/3/notifications`);
  return resp.data; // ajustar conforme o formato retornado pelo backend
}