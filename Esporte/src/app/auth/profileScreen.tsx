// screens/profile/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";

import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { SportsSection } from "../../components/profile/SportsSection";
import BottomNavigation from "../../components/FutterBar";
import { ActionTabs, ActionTabKey } from "../../components/profile/ActionTabs";
import { RegisteredEvents } from "@/src/components/profile/RegisteredEvents";
import { Friends } from "@/src/components/profile/Friends";
import { useProfile } from "@/hooks/useProfile";
import { attachAuth } from "@/src/services/Api";
import { Sport } from "@/src/services/UserService";

// 👉 imports da versão “tela-perfil”
import { useMyEvents } from "@/hooks/useMyEvents";
import { Activity } from "@/src/components/profile/ActivityItem";
import { ActivitiesSection } from "@/src/components/profile/ActivitiesSection";
import { useRouter } from "expo-router";
import MutualFriends from "@/src/components/profile/MutualFriends";
import { images as friendImages } from "@/src/components/profile/FriendCard";

// 👉 constante que estava no outro branch (dev-with-form-fixes)
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ProfileScreen() {
  const router = useRouter();

  const [tab, setTab] = useState<ActionTabKey>("participados");

  const { getToken, isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  const userId = user?.id as string | undefined;

  // Injeta JWT do Clerk com template 'backend'
  useEffect(() => {
    attachAuth(() => getToken({ template: "backend", skipCache: true }));
  }, [getToken]);

  // Dados do perfil
  const { data, loading, err, saveSports } = useProfile(userId);

  // Eventos do usuário (inscritos/participados)
  const {
    registered = [],
    participated = [],
    loading: loadingEvents,
    err: errEvents,
  } = useMyEvents();

  // ---- NOVO: stats por esporte (média 0..3 por nome do esporte) ----
  const [sportStats, setSportStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!userId || !BASE_URL) return;
    (async () => {
      try {
        const token =
          (await getToken({ template: "backend", skipCache: true })) ||
          (await getToken({ template: "backend" }));
        if (!token) return;
        const res = await fetch(
          `${BASE_URL}/api/v1/users/${encodeURIComponent(userId)}/sport-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const list: { sport: string; averageSkill?: number | null }[] =
          await res.json();
        const map: Record<string, number> = {};
        list.forEach((s) => {
          if (s.averageSkill != null) map[s.sport] = s.averageSkill as number;
        });
        setSportStats(map);
      } catch {
        // silencioso — a seção de esportes só não mostrará níveis
      }
    })();
  }, [userId]);

  // util simples para "há X dias/semanas"
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

  const mutualAvatarsKeys: (keyof typeof friendImages)[] = ["user1", "user2", "user3"];
  const mutualAvatars = mutualAvatarsKeys.map((k) => friendImages[k]);
  const mutualCount = 7;

  const onPressMutual = () => {
    console.log("ver amigos em comum");
  };

  const handleAddSport = async (sport: string) => {
    const current = (data?.sports ?? []);
    const sportsAsStrings = current.map((s: Sport | string) =>
      typeof s === "string" ? s : s.name
    );
    if (sportsAsStrings.includes(sport)) return;
    try {
      await saveSports([...sportsAsStrings, sport]);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível adicionar o esporte");
    }
  };

  const handleRemoveSport = async (sport: string) => {
    const current = (data?.sports ?? []);
    try {
      const sportsAsStrings = current.map((s: Sport | string) =>
        typeof s === "string" ? s : s.name
      );
      await saveSports(sportsAsStrings.filter((s: string) => s !== sport));
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível remover o esporte");
    }
  };

  const openEvent = (eventId: number) => {
    router.push({
      pathname: "/auth/event/[id]",
      params: { id: String(eventId) },
    });
  };

  // Mapeia “participated” para ActivitiesSection
  const participatedActivities: Activity[] = (participated ?? []).map((ev) => ({
    id: String(ev.id),
    title: ev.name,
    timeAgo: toTimeAgo(ev.date),
    tag: ev.sport,
    icon: ev.sport?.toLowerCase().includes("yoga") ? "yoga" : "soccer",
  }));

  const renderTabContent = () => {
    if (loadingEvents) {
      return <Text className="text-black px-7">Carregando…</Text>;
    }
    if (errEvents) {
      return <Text className="text-red-600 px-7">{errEvents}</Text>;
    }

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
              image:
                ev.coverImageUrl && ev.coverImageUrl.trim().length > 0
                  ? { uri: ev.coverImageUrl }
                  : require("../../assets/images/default_card.png"),
              price: ev.price ? String(ev.price) : "Free",
            }))}
            onPressEvent={(ev) => openEvent(ev.id)} // navega para a tela do evento
            emptyText="Você ainda não se inscreveu em eventos"
          />
        );

      case "participados":
        return (
          <ActivitiesSection
            activities={participatedActivities}
            emptyText="Você ainda não participou de atividades"
          />
        );

      case "amigos":
        return (
          <Friends
            friends={[
              {
                id: "1",
                name: "Diego Alcantara",
                city: "São Paulo",
                avatar: "user1",
                mutualAvatars: ["user2", "user3", "user1"],
                mutualCount: 4,
              },
              {
                id: "2",
                name: "Marina Rocha",
                city: "Goiânia",
                avatar: "user3",
                mutualAvatars: ["user1", "user2"],
                mutualCount: 3,
              },
            ]}
            emptyText="Você ainda não adicionou amigos"
          />
        );

      default:
        return null;
    }
  };

  // Média global de rating (se vier do backend no DTO do perfil)
  const avgRating =
    (data as any)?.totalReceivedEvaluations &&
    (data as any)?.totalReceivedEvaluations > 0
      ? ((data as any).totalRating ?? 0) /
        (data as any).totalReceivedEvaluations
      : null;

  // estados “não logado” ou “Clerk ainda carregando”
  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7FFED] items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!isSignedIn || !userId) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7FFED] items-center justify-center px-6">
        <Text className="text-black text-center mb-3">
          Você precisa estar logado para ver o seu perfil.
        </Text>
        <TouchableOpacity
          onPress={() => {}}
          className="bg-[#10CF65] px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-medium">Ir para Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
            name={data?.name ?? user?.fullName ?? "—"}
            photoUrl={data?.photo ?? user?.imageUrl ?? undefined}
            stats={{ friends: 144, activities: 12, createdActivities: 2 }}
            rating={avgRating != null ? avgRating.toFixed(2) : "—"}
          />

          <ProfileInfo
            ageText={
              data?.birthday ? calcAgeText(data.birthday) : "Idade não informada"
            }
            cityText={data?.city ? `${data.city}` : "Cidade não informada"}
            jobText={"Designer"} // troque quando vier do backend
          />

          <MutualFriends
            avatars={mutualAvatars.slice(0, 3)}
            primaryNames={["João Hélio", "Fagner Martins"]}
            othersCount={Math.max(0, mutualCount - 2)}
            onPressAvatars={onPressMutual}
            onPressText={onPressMutual}
          />

          <View className="mb-4">
            <SportsSection
              sports={
                data?.sports
                  ? data.sports.map((s: Sport | string) =>
                      typeof s === "string" ? s : s.name
                    )
                  : []
              }
              perSportLevel={sportStats}
              onAddSport={handleAddSport}
              onRemoveSport={handleRemoveSport}
            />
          </View>

          <ActionTabs value={tab} onChange={setTab} />
          <View className="px-7 mt-4">{renderTabContent()}</View>

          <View className="mt-48">
            <BottomNavigation />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// util local
function calcAgeText(birthdayIso: string) {
  const b = new Date(birthdayIso);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return `${age} anos`;
}
