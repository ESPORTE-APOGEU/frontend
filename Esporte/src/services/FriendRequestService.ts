import axios from "axios";

const API_URL = "http://192.168.100.10:8080/api/v1/friend-requests";

export const createFriendRequest = async (senderId: number, receiverId: number) => {
    const response = await axios.post(`${API_URL}`, null, {
        params: { senderId, receiverId },
    });
    return response.data;
};

export const getPendingRequests = async (receiverId: number) => {
    const response = await axios.get(`${API_URL}/pending/${receiverId}`);
    return response.data;
};

export const respondToRequest = async (requestId: number, status: "ACCEPTED" | "REJECTED") => {
    const response = await axios.post(`${API_URL}/${requestId}/respond`, null, {
        params: { status },
    });
    return response.data;
};