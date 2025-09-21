// src/services/NotificationService.ts
import { api } from "@/src/services/Api";

export type NotificationDTO = {
  id: number;
  type: string;
  iconName?: "whatsapp" | "calendar" | "info" | string | null;
  title: string;
  description: string;
  timestamp: string; // ISO_LOCAL_DATE_TIME vindo do backend
  tagText?: string | null;
  tagIcon?: "whatsapp" | "calendar" | "info" | string | null;
  relatedEventId?: number | null;
  entryId?: number | null;

  actorId?: string | null;
  actorName?: string | null;
  actorPhoto?: string | null;
};

/** Lista minhas notificações (usa JWT do Clerk via interceptor). */
export async function getMyNotifications(): Promise<NotificationDTO[]> {
  const { data } = await api.get("/notifications");
  return data;
}

export async function acceptEventEntry(entryId: number) {
  return api.post(`/event-entries/${entryId}/accept`, {});
}

export async function declineEventEntry(entryId: number) {
  return api.post(`/event-entries/${entryId}/decline`, {});
}
