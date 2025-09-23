import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.10:8080";

/**
 * Busca notificações para um usuário.
 * Backend esperado: GET /api/v1/users/{userId}/notifications
 */
export async function getNotifications(userId: number) {
    const token = await SecureStore.getItemAsync("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    // 1) agora usa userId dinâmico
    const resp = await axios.get(`${API}/api/v1/users/${userId}/notifications`, { headers });
    return resp.data;
}

export async function acceptEventEntry(entryId: number) {
    const token = await SecureStore.getItemAsync("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return await axios.post(
        `${API}/api/v1/event-entries/${entryId}/accept`,
        {},
        { headers }
    );
}

export async function declineEventEntry(entryId: number) {
    const token = await SecureStore.getItemAsync("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return await axios.post(
        `${API}/api/v1/event-entries/${entryId}/decline`,
        {},
        { headers }
    );
}