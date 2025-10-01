import axios from "axios";
import {api} from "@/src/services/Api";

const API_URL = "/friend-requests";

export type FriendRequestStatusDTO = {
  isFriend: boolean;
  pendingOutgoing: boolean;   // eu → outro (já enviei)
  pendingIncoming: boolean;   // outro → eu (ele me enviou)
  requestId?: number | null;  // se houver pendente, id da request
};

export const createFriendRequest = async (receiverId:string) => {
    const response = await api.post(API_URL, null, {
        params: { receiverId },
    });
    return response.data;
};

export const getPendingRequests = async () => {
    console.log(`Buscando em: ${api.defaults.baseURL}${API_URL}/pending`); // Log para depuração
    const response = await api.get(`${API_URL}/pending`);
    return response.data;
};


export const respondToRequest = async (
  requestId: number | string,
  status: "ACCEPTED" | "DECLINED"   
) => {
  const response = await api.post(`/friend-requests/${requestId}/respond`, null, { params: { status } });
  return response.data;
};

export async function getFriendRequestStatus(otherUserId: string): Promise<FriendRequestStatusDTO> {
  const { data } = await api.get(`/friend-requests/between/${encodeURIComponent(otherUserId)}`);
  return data;
}

