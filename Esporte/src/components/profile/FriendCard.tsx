import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const images = {
  user1: require("../../assets/images/Criador.png"),
  user2: require("../../assets/images/Criador.png"),
  user3: require("../../assets/images/Criador.png"),
} as const;

type Props = {
  id: string;
  name: string; // "Diego Alcantara"
  city: string; // "São Paulo"
  avatar: keyof typeof images; // chave do mapa 'images' (ex: 'user1')
  mutualAvatars?: (keyof typeof images)[]; // até 3 avatares
  mutualCount: number; // número grande à direita (ex: 4)
  onPressAvatar?: () => void;
  onPressMutual?: () => void;
  onPressAdd?: () => void;
};

export function FriendCard({
  id,
  name,
  city,
  avatar,
  mutualAvatars = [],
  mutualCount,
  onPressAvatar,
  onPressMutual,
  onPressAdd,
}: Props) {
  return (
    <View
      className="flex-row items-center rounded-2xl mb-3 py-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Avatar principal (≈ 54x54) */}
      <TouchableOpacity onPress={onPressAvatar}>
        <Image
          source={images[avatar]}
          className="w-[54px] h-[54px] rounded-full mr-4"
          style={{ shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4 }}
        />
      </TouchableOpacity>

      {/* Nome + (quadrado verde + cidade) */}
      <View className="flex-1">
        <Text className="text-black text-[17px] leading-[20px] font-semibold">
          {name}
        </Text>

        <View className="flex-row items-center mt-1">
          {/* Quadrado verde 19x19 com ícone branco */}
          <View className="w-[19px] h-[19px] rounded bg-[#10CF65] items-center justify-center mr-2">
            {/* use 'checkmark' se quiser um “verificado”; troque para 'location-outline' se preferir */}
            <Ionicons name="location" size={12} color="#fff" />
          </View>
          <Text className="text-black text-[14px] leading-[17px]">{city}</Text>
        </View>
      </View>

      {/* Avatares mútuos (3 sobrepostos) + número grande (ex: 4) */}
      <View className="flex-row justify-center items-end mr-3">
        <View className="flex-row items-center mb-1">
          {mutualAvatars.slice(0, 3).map((m, i) => (
            <TouchableOpacity key={`${id}-${m}-${i}`} onPress={onPressMutual}>
              <Image
                source={images[m]}
                className={`w-[27px] h-[27px] rounded-full ${i ? "-ml-2" : ""}`}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-black text-[20px] leading-6">{mutualCount}</Text>
      </View>
    </View>
  );
}
