// src/components/profile/MutualFriends.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

type Props = {
  avatars: ImageSourcePropType[];
  primaryNames: string[];
  othersCount?: number;
  onPressAvatars?: () => void;
  onPressText?: () => void;
};

export default function MutualFriends({
  avatars = [],
  primaryNames = [],
  othersCount = 0,
  onPressAvatars,
  onPressText,
}: Props) {
  const namesText =
    primaryNames.length === 0
      ? ""
      : primaryNames.length === 1
      ? primaryNames[0]
      : `${primaryNames[0]} , ${primaryNames[1]}`;

  const suffix = othersCount > 0 ? ` e outras ${othersCount} pessoas` : "";

  return (
    <View className="flex-row items-center px-7 mt-3">
      {/* Avatares sobrepostos (27x27) */}
      <TouchableOpacity
        onPress={onPressAvatars}
        className="flex-row items-center mr-2"
      >
        {avatars.slice(0, 3).map((src, i) => (
          <Image
            key={i}
            source={src}
            className={`w-[27px] h-[27px] rounded-full ${i ? "-ml-3" : ""}`}
            resizeMode="cover"
          />
        ))}
      </TouchableOpacity>

      {/* Texto */}
      <TouchableOpacity onPress={onPressText} className="flex-1">
        <Text className="text-black text-[12px] leading-[15px] font-semibold tracking-[0.5]">
          Amigo(a) de {namesText}
          <Text className="text-[#43A047]">{suffix}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
