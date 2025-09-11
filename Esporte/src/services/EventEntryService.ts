import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.10:8080";
async function token() { return await SecureStore.getItemAsync("token"); }

export type EventRequest = {
  name:string, location:string, sport:string, level:string,
  gender:string, date:string, startTime:string,endTime:string,
  price:number, description:string, organizerId:number, organizerPhoto:string
};

export async function createEvent(req: EventRequest) {
  const t = await token();
  const headers = t ? { Authorization:`Bearer ${t}` } : {};
  const res = await axios.post(`${API}/api/v1/events`, req, { headers });
  return res.data;
}

export async function listEvents() {
  const t = await token();
  const headers = t ? { Authorization:`Bearer ${t}` } : {};
  const res = await axios.get(`${API}/api/v1/events`, { headers });
  return res.data;
}

export async function requestEventEntry(eventId: number, userId: number) {
  const t = await token();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  const res = await axios.post(
    `${API}/api/v1/event-entries`,
    { eventId, userId },
    { headers }           // agora envia token
  );
  return res.data;
}

export async function acceptEventEntry(entryId: number) {
  const res = await axios.post(`${API}/api/v1/event-entries/${entryId}/accept`);
  return res.data;
}

export async function declineEventEntry(entryId: number) {
  const res = await axios.post(`${API}/api/v1/event-entries/${entryId}/decline`);
  return res.data;
}