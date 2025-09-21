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

export default function ProfileScreen() {
  const [tab, setTab] = useState<ActionTabKey>("participados");

  const { getToken, isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  const userId = user?.id as string | undefined;

  useEffect(() => {
    attachAuth(() => getToken());
  }, [getToken]);

  const { data, loading, err, saveSports } = useProfile(userId);

  const handleAddSport = async (sport: string) => {
    const current = data?.sports ?? [];
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
    const current = data?.sports ?? [];
    try {
      const sportsAsStrings = current.map((s: Sport | string) =>
        typeof s === "string" ? s : s.name
      );
      await saveSports(sportsAsStrings.filter((s: string) => s !== sport));
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível remover o esporte");
    }
  };

  const renderTabContent = () => {
    switch (tab) {
      case "inscrito":
        return (
          <RegisteredEvents
            events={[
              {
                id: 1,
                eventName: "5x5 Soccer Night",
                location: "Marquina Park - Vila Mariana",
                date: "Monday, Feb 15, 2025",
                participants: 8,
                image: require("../../assets/images/tela.png"),
                price: "Free",
              },
              {
                id: 2,
                eventName: "Morning Run",
                location: "Lago das Rosas",
                date: "Tuesday, Feb 18, 2025",
                participants: 12,
                image: require("../../assets/images/tela.png"),
                price: "$5",
              },
            ]}
            onPressEvent={(ev) => console.log("Abrir detalhes:", ev.id)}
          />
        );
      case "participados":
        return (
          <Text className="text-black px-2">Histórico de atividades aqui…</Text>
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
          />
        );
      default:
        return null;
    }
  };

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
          onPress={() => {
            /* router.push('/auth/login') */
          }}
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
            rating="4.80"
          />

          <ProfileInfo
            ageText={
              data?.birthday
                ? calcAgeText(data.birthday)
                : "Idade não informada"
            }
            cityText={data?.city ? `${data.city}` : "Cidade não informada"}
            jobText={"Designer"} // troque quando vier do backend
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
