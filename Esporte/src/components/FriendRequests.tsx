// src/components/FriendRequests.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { images } from "../assets/images";
// ❌ REMOVA a importação do useNavigation
// import { useNavigation } from "@react-navigation/native";
// ✅ ADICIONE a importação do useRouter
import { useRouter } from "expo-router";

export type Request = {
  id: string;
  name: string;
  avatar: keyof typeof images;
  mutualCount: number;
  mutualAvatars?: (keyof typeof images)[];
};

interface Props {
  requests: Request[];
}

export function FriendRequests({ requests }: Props) {
  // ❌ REMOVA o hook useNavigation
  // const navigation = useNavigation<any>();
  // ✅ ADICIONE o hook useRouter
  const router = useRouter();

  return (
    <View className="px-4">
      {requests.map((r) => (
        <View key={r.id} className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1 mr-4">
            <Image
              source={images[r.avatar]}
              className="w-11 h-11 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-black text-[16px] font-semibold">
                {r.name}
              </Text>

              <TouchableOpacity
                className="flex-row items-center mt-1"
                onPress={() =>
                  // ✅ CORRIJA a chamada de navegação
                  router.push({
                    pathname: "/MutualFriendsScreen", // Use o caminho da rota
                    params: {
                      id: r.id,
                      name: r.name,
                      mutualCount: r.mutualCount,
                      // Parâmetros de URL precisam ser strings. Arrays devem ser convertidos.
                      friends: JSON.stringify(r.mutualAvatars ?? []),
                    },
                  })
                }>
                <Image source={images.amizade} className="w-4 h-4 mr-1" />
                <Text className="text-[#292D32B3] text-[14px]">
                  {r.mutualCount} amigos em comum
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="w-8 h-8 rounded-xl border border-[#10CF65] items-center justify-center mr-3">
              <Feather name="x" size={12} color="#10CF65" />
            </TouchableOpacity>
            <TouchableOpacity className="w-8 h-8 rounded-xl border border-[#10CF65] items-center justify-center">
              <Feather name="check" size={12} color="#10CF65" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
