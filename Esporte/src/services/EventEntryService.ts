import axios from 'axios';

export async function requestEventEntry(eventId: number, userId: number) {
  const response = await axios.post('http://192.168.100.10:8080/api/v1/event-entries', { eventId, userId });
  return response.data;
}