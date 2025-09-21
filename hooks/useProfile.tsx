import { useEffect, useState, useCallback } from "react";
import {
  getUser,
  updateUser,
  updateUserSports,
  User,
  UpdateUserDTO,
} from "../src/services/UserService";

export function useProfile(userId?: string) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setErr(null);
    try {
      const u = await getUser(userId);
      setData(u);
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const save = useCallback(
    async (payload: UpdateUserDTO) => {
      if (!userId) return;
      const u = await updateUser(userId, payload);
      setData(u);
    },
    [userId]
  );

  const saveSports = useCallback(
    async (sports: string[]) => {
      if (!userId) return;
      const u = await updateUserSports(userId, sports);
      setData(u);
    },
    [userId]
  );

  return { data, loading, err, refetch: fetch, save, saveSports };
}
