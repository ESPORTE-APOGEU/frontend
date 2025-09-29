// app/auth/user/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, ActivityIndicator, Text, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { attachAuth } from "@/src/services/Api";
import { useAuth } from "@clerk/clerk-expo";
import { getUserById, User } from "@/src/services/UserService";
import { getUserFriends, FriendLite } from "@/src/services/FriendService";

import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileInfo } from "@/src/components/profile/ProfileInfo";
import { SportsSection } from "@/src/components/profile/SportsSection";
import BottomNavigation from "@/src/components/FutterBar";

import { ActionTabs, ActionTabKey } from "@/src/components/profile/ActionTabs";
import { RegisteredEvents } from "@/src/components/profile/RegisteredEvents";
import { ActivitiesSection } from "@/src/components/profile/ActivitiesSection";
import { Activity } from "@/src/components/profile/ActivityItem";
import { Friends } from "@/src/components/profile/Friends";
import MutualFriends from "@/src/components/profile/MutualFriends";
import { getMutualFriends, MutualFriendsDTO } from "@/src/services/FriendService";
import { useUserEvents } from "@/hooks/useUserEvents";
import { useUser } from "@clerk/clerk-expo";
import { createFriendRequest } from "@/src/services/FriendRequestService"; // 👈
export default function OtherProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToken } = useAuth();
  const { user: me } = useUser();                  // +++ eu (logado)
  const meId = me?.id;


  const [tab, setTab] = useState<ActionTabKey>("participados");

  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [friends, setFriends] = useState<FriendLite[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(true);

  // depois de carregar `friends`, monte o array com mutuals e fotos:
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [mutual, setMutual] = useState<MutualFriendsDTO | null>(null);

    const [isFriend, setIsFriend] = useState<boolean>(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  // injeta JWT
  useEffect(() => {
    attachAuth(() => getToken({ template: "backend", skipCache: true }));
  }, [getToken]);

useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const m = await getMutualFriends(String(id));
        console.log("mutual:" + m)
        if (mounted) setMutual(m);
      } catch (e) {
        console.warn("Erro ao buscar amigos em comum:", (e as any)?.message);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // helpers para montar o componente do Figma
  const mutualAvatars = (mutual?.users ?? [])
    .slice(0, 3)
    .map(u => u.photo ? { uri: u.photo } : require("../../../assets/images/Criador.png"));
  const names = (mutual?.users ?? []).map(u => u.name ?? "—");
  const primaryNames = names.slice(0, 2);               // “João Hélio , Fagner Martins”
  const othersCount = Math.max(0, (mutual?.total ?? 0) - 2);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const u = await getUserById(String(id));
        if (mounted) setData(u);
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? "Erro ao carregar perfil");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // carrega amigos
useEffect(() => {
  let mounted = true;
  (async () => {
    if (!meId || !id) return;
    try {
      const mine = await getUserFriends(meId);
      const amFriend = !!(mine ?? []).find((f) => f.id === String(id));
      if (mounted) setIsFriend(amFriend);
    } catch (e) {
      console.warn("Erro ao checar amizade:", (e as any)?.message);
      if (mounted) setIsFriend(false);
    }
  })();
  return () => { mounted = false; };
}, [meId, id]);

  useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      setFriendsLoading(true);
      const raw = await getUserFriends(String(id)); // amigos do perfil visitado
      const withMutuals = await Promise.all(raw.map(async (f:any) => {
        try {
          const m = await getMutualFriends(f.id); // mutual EU x AMIGO
          return {
            id: f.id,
            name: f.name ?? "—",
            city: f.city ?? "—",
            avatarSrc: f.photo ? { uri: f.photo } : require("../../../assets/images/Criador.png"),
            mutualAvatarSrcs: (m.users ?? []).slice(0,3).map((u:any) =>
              u.photo ? { uri: u.photo } : require("../../../assets/images/Criador.png")
            ),
            mutualCount: m.total ?? 0,
          };
        } catch {
          return {
            id: f.id,
            name: f.name ?? "—",
            city: f.city ?? "—",
            avatarSrc: f.photo ? { uri: f.photo } : require("../../../assets/images/Criador.png"),
            mutualAvatarSrcs: [],
            mutualCount: 0,
          };
        }
      }));
      if (mounted) setFriendsList(withMutuals);
    } finally {
      if (mounted) setFriendsLoading(false);
    }
  })();
  return () => { mounted = false; };
}, [id]);
  // eventos do usuário visto
  const { registered, participated, loading: loadingEvents, err: errEvents } = useUserEvents(String(id));




const handleAddFriend = async () => {
  try {
    setSendingRequest(true);
    await createFriendRequest(String(id));   // 👈 usa o serviço (params)
    Alert.alert("Sucesso", "Solicitação enviada!");
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Falha ao enviar solicitação";
    Alert.alert("Erro", msg);
  } finally {
    setSendingRequest(false);
  }
};


  // util “há X…”
  function toTimeAgo(isoDate: string) {
    const d = new Date(isoDate);
    const now = new Date();
    const diffDays = Math.floor((+now - +d) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Hoje";
    if (diffDays === 1) return "Há 1 dia";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "Há 1 semana" : `Há ${weeks} semanas`;
  }

  // mapeia eventos participados -> ActivitiesSection
  const participatedActivities: Activity[] = (participated ?? []).map((ev) => ({
    id: String(ev.id),
    title: ev.name,
    timeAgo: toTimeAgo(ev.date),
    tag: ev.sport,
    icon: ev.sport?.toLowerCase().includes("yoga") ? "yoga" : "soccer",
  }));

  const openEvent = (eventId: number) => {
    router.push({ pathname: "/auth/event/[id]", params: { id: String(eventId) } });
  };

  const ageText = useMemo(() => {
    if (!data?.birthday) return "Idade não informada";
    const b = new Date(data.birthday);
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return `${age} anos`;
  }, [data?.birthday]);

  const renderTabContent = () => {
    if (loadingEvents) return <Text className="text-black px-7">Carregando…</Text>;
    if (errEvents) return <Text className="text-red-600 px-7">{errEvents}</Text>;

    switch (tab) {
      case "inscrito":
        return (
          <RegisteredEvents
            events={(registered ?? []).map((ev) => ({
              id: ev.id,
              eventName: ev.name,
              location: ev.location,
              date: new Date(ev.date).toDateString(),
              participants: 0,
              image: ev.coverImageUrl && ev.coverImageUrl.trim().length > 0
                ? { uri: ev.coverImageUrl }
                : require("../../../assets/images/default_card.png"),
              price: ev.price ? String(ev.price) : "Free",
            }))}
            onPressEvent={(ev) => openEvent(ev.id)}
            emptyText="Nenhum evento futuro"
          />
        );

      case "participados":
        return (
          <ActivitiesSection
            activities={participatedActivities}
            emptyText="Nenhuma atividade passada"
          />
        );

      case "amigos":
        if (friendsLoading) return <Text className="px-7 text-black">Carregando amigos…</Text>;
          return (
            <Friends
              friends={friendsList}
              emptyText="Sem amigos por enquanto"
            />
          );
      }
    };

// --- JSX principal ---
return (
  <SafeAreaView className="flex-1 bg-[#F7FFED]">
    {loading ? (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    ) : err ? (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-red-600 text-center">{err}</Text>
      </View>
    ) : (
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <ProfileHeader
          name={data?.name ?? "—"}
          photoUrl={data?.photo ?? undefined}
          stats={{
            friends: (friends ?? []).length,
            activities: participated?.length ?? 0,
            createdActivities: 0
          }}
          rating="4.80"
        />

        <ProfileInfo
          ageText={ageText}
          cityText={data?.city ?? "Cidade não informada"}
          jobText={"—"}
        />

        {!!mutual && mutual.total > 0 && (
          <MutualFriends
            avatars={mutualAvatars}
            primaryNames={primaryNames}
            othersCount={othersCount}
            onPressAvatars={() => {}}
            onPressText={() => {}}
          />
        )}

        <View className="mb-4">
          <SportsSection
            sports={(data?.sports ?? []).map((s: any) => (typeof s === "string" ? s : s.name))}
          />
        </View>

        {/* ====== SE É AMIGO: mostra as abas ====== */}
        {isFriend ? (
          <>
            <ActionTabs value={tab} onChange={setTab} />
            <View className="px-7 mt-4">{renderTabContent()}</View>
          </>
        ) : (
          /* ====== NÃO É AMIGO: CTA + mensagem ====== */
          <View className="px-7 mt-4">
            <TouchableOpacity
              onPress={handleAddFriend}
              disabled={sendingRequest}
              className="bg-[#43A047] rounded-2xl items-center justify-center"
              style={{ height: 54, opacity: sendingRequest ? 0.6 : 1 }}
            >
              <Text className="text-white font-semibold" style={{ fontSize: 18 }}>
                Adicionar como amigo
              </Text>
            </TouchableOpacity>

            <Text
              className="text-[#969696] text-center"
              style={{ marginTop: 16, fontSize: 14, lineHeight: 18 }}
            >
              Não é possível ver mais informações{"\n"}pois vocês não estão conectados
            </Text>
          </View>
        )}

        <View className="mt-48">
          <BottomNavigation />
        </View>
      </ScrollView>
    )}
  </SafeAreaView>
);

}
