import axios from "axios";

export async function fetchNotifications(userId: number) {
  try {
    const response = await axios.get(`http://192.168.100.10:8080/api/v1/users/${userId}/notifications`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    throw error;
  }
}