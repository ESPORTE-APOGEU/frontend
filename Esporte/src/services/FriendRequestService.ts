import axios from "axios";
import {api} from "@/src/services/Api";

const API_URL = "/friend-requests";

export const createFriendRequest = async (receiverId: number | string) => {
    const response = await api.post(API_URL, null, {
        params: { receiverId },
    });
    return response.data;
};

export const getPendingRequests = async () => {
    console.log(`${API_URL}/pending`);
    const response = await api.get(`${API_URL}/pending`);
    return response.data;
};

export const respondToRequest = async (requestId: number | string, status: "ACCEPTED" | "REJECTED") => {
    const response = await api.post(`${API_URL}/${requestId}/respond`, null, {
        params: { status },
    });
    return response.data;
};