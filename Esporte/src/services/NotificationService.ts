import axios from 'axios';

const API = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.10:8080";

export async function getNotifications(userId: number) {
    const response = await axios.get(`${API}/api/v1/users/${userId}/notifications`);
    return response.data;
}