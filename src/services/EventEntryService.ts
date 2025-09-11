import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.10:8080";

export async function requestEventEntry(eventId: number, userId: number) {
  const res = await axios.post(`${API}/api/v1/event-entries`, { eventId, userId });
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