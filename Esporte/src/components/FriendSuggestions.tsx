// src/components/FriendSuggestions.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "../assets/images";
import { useRouter } from "expo-router";

export type Suggestion = {
  id: string;
  name: string;
  avatar: keyof typeof images;
  mutualCount: number;
  mutualAvatars?: (keyof typeof images)[];
};

interface Props {
  suggestions: Suggestion[];
}

// ✅ 1. Objeto de mock COMPLETO e BEM TIPADO
// Ele agora contém todos os usuários que podem ser referenciados.
const MOCK_ALL_USERS: Record<string, Suggestion> = {
  amigo1: {
    id: "101",
    name: "Diego Alcantara",
    avatar: "amigo1",
    mutualCount: 5,
    mutualAvatars: ["amigo2", "amigo3"],
  },
  amigo2: {
    id: "102",
    name: "Lucas Andrade",
    avatar: "amigo2",
    mutualCount: 3,
    mutualAvatars: ["amigo1"],
  },
  amigo3: {
    id: "103",
    name: "Beatriz Lima",
    avatar: "amigo3",
    mutualCount: 8,
    mutualAvatars: ["amigo1", "amigo2"],
  },
  // Adicione outros usuários se necessário para cobrir todas as chaves de avatar
  iconedocaba: {
    id: "999",
    name: "Usuário Teste",
    avatar: "iconedocaba",
    mutualCount: 0,
    mutualAvatars: [],
  },
};

export function FriendSuggestions({ suggestions }: Props) {
  const router = useRouter();

  const handleMutualFriendPress = (avatarKey: keyof typeof images) => {
    // A chave agora deve existir no objeto MOCK_ALL_USERS
    const friendData = MOCK_ALL_USERS[avatarKey];
    if (friendData) {
      router.push({
        // ✅ 2. Rota CORRIGIDA (sem /public)
        pathname: "/MutualFriendsScreen",
        params: {
          id: friendData.id,
          name: friendData.name,
          mutualCount: friendData.mutualCount,
          friends: JSON.stringify(friendData.mutualAvatars ?? []),
        },
      });
    }
  };

  return (
    <View>
      <Text className="text-black font-extrabold text-[24px] px-4 mb-4">
        Sugestão de amigos
      </Text>

      {suggestions.map((s) => (
        <View
          key={s.id}
          className="flex-row items-center rounded-lg px-4 py-3 mx-4 mb-3">
          <TouchableOpacity
            onPress={() =>
              router.push({
                // ✅ 2. Rota CORRIGIDA (sem /public)
                pathname: "/MutualFriendsScreen",
                params: {
                  id: s.id,
                  name: s.name,
                  mutualCount: s.mutualCount,
                  friends: JSON.stringify(s.mutualAvatars ?? []),
                },
              })
            }>
            <Image
              source={images[s.avatar]}
              className="w-8 h-8 rounded-full mr-4"
            />
          </TouchableOpacity>

          <Text className="flex-1 text-black font-semibold text-[16px]">
            {s.name}
          </Text>

          <View className="flex-row items-center mr-2">
            {(s.mutualAvatars ?? []).slice(0, 3).map((m, i) => (
              <TouchableOpacity
                key={`${s.id}-${m}-${i}`}
                onPress={() => handleMutualFriendPress(m)}>
                <Image
                  source={images[m]}
                  className={`w-6 h-6 rounded-full ${i ? "-ml-2" : ""}`}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-black text-[18px] mr-2">{s.mutualCount}</Text>

          <TouchableOpacity className="w-24 h-7 bg-[#43A047] rounded-lg justify-center items-center">
            <Text className="text-white font-bold text-[12px]">Adicionar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
