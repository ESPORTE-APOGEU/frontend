// hooks/useMyEvents.ts
import { useCallback, useEffect, useState } from "react";
import {
  EventItem,
  getMyRegisteredEvents,
  getMyParticipatedEvents,
} from "@/src/services/UserEventService";

export function useMyEvents() {
  const [registered, setRegistered] = useState<EventItem[]>([]);
  const [participated, setParticipated] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [r, p] = await Promise.all([
        getMyRegisteredEvents(),
        getMyParticipatedEvents(),
      ]);
      setRegistered(r);
      setParticipated(p);
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { registered, participated, loading, err, refetch: fetchAll };
}
