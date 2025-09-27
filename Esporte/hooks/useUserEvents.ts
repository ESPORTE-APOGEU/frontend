import { useCallback, useEffect, useState } from "react";
import {
  EventItem,
  getUserRegisteredEvents,
  getUserParticipatedEvents,
} from "@/src/services/UserEventService"; // ajuste o caminho se necessário

export function useUserEvents(userId?: string) {
  const [registered, setRegistered] = useState<EventItem[]>([]);
  const [participated, setParticipated] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setErr(null);
    try {
      const [r, p] = await Promise.all([
        getUserRegisteredEvents(userId),
        getUserParticipatedEvents(userId),
      ]);
      setRegistered(r);
      setParticipated(p);
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { registered, participated, loading, err, refetch: fetchAll };
}
