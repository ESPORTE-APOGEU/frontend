// src/components/profile/FriendCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  id: string;
  name: string;
  city: string;
  avatarSrc: ImageSourcePropType;            // <— agora é um ImageSource genérico
  mutualAvatarSrcs?: ImageSourcePropType[];  // <— até 3 overlays
  mutualCount: number;
  onPressAvatar?: () => void;
  onPressMutual?: () => void;
  onPressAdd?: () => void;
};

export function FriendCard({
  id,
  name,
  city,
  avatarSrc,
  mutualAvatarSrcs = [],
  mutualCount,
  onPressAvatar,
  onPressMutual,
  onPressAdd,
}: Props) {
  return (
    <View
      className="flex-row items-center rounded-2xl mb-3 py-3 bg-white px-3 shadow-md"
      style={{ elevation: 3 }} // Android
    >
      {/* Avatar principal (sombra no wrapper, borda arredondada no inner) */}
      <TouchableOpacity onPress={onPressAvatar} className="mr-4">
        <View className="shadow-md rounded-full">
          <View className="rounded-full overflow-hidden">
            <Image source={avatarSrc} className="w-[54px] h-[54px]" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Nome + cidade */}
      <View className="flex-1">
        <Text
          className="text-black text-[17px] font-semibold leading-[20px]"
          numberOfLines={1}
        >
          {name}
        </Text>

        <View className="flex-row items-center mt-1">
          <View className="w-[19px] h-[19px] rounded bg-[#10CF65] items-center justify-center mr-2">
            <Ionicons name="location-outline" size={12} color="#fff" />
          </View>
          <Text
            className="text-black text-[14px] leading-[17px]"
            numberOfLines={1}
          >
            {city}
          </Text>
        </View>
      </View>

      {/* Avatares mútuos sobrepostos + número */}
      <View className="flex-row items-end mr-1">
        <View className="flex-row items-center mb-1">
          {mutualAvatars.slice(0, 3).map((src, i) => (
            <TouchableOpacity key={`${id}-m-${i}`} onPress={onPressMutual}>
              <Image
                source={src}
                className={[
                  "w-[27px] h-[27px] rounded-full border border-white",
                  i ? "-ml-2" : "",
                  i === 0 ? "z-30" : i === 1 ? "z-20" : "z-10", // garante ordem no Android
                ].join(" ")}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-black text-[20px] leading-6 ml-2">
          {mutualCount}
        </Text>
      </View>
    </View>
  );
}
