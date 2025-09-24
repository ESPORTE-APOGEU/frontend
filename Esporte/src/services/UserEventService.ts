// src/services/events.service.ts
import { api } from "./Api";

export type EventItem = {
  id: number;
  name: string;
  location: string;
  sport: string;
  level: string;
  gender: string;
  date: string;
  startTime: string;
  endTime: string;
  price?: number | string | null;
  description?: string | null;
  coverImageUrl?: string | null;
};

export async function getMyRegisteredEvents(): Promise<EventItem[]> {
  const { data } = await api.get("/events/me/registered");
  return data;
}

export async function getMyParticipatedEvents(): Promise<EventItem[]> {
  const { data } = await api.get("/events/me/participated");
  return data;
}
