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
  id, name, city, avatarSrc, mutualAvatarSrcs = [], mutualCount,
  onPressAvatar, onPressMutual, onPressAdd,
}: Props) {
  return (
    <View className="flex-row items-center rounded-2xl mb-3 py-3"
      style={{ shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.15, shadowRadius:6, elevation:2 }}>
      <TouchableOpacity onPress={onPressAvatar}>
        <Image
          source={avatarSrc}
          className="w-[54px] h-[54px] rounded-full mr-4"
          style={{ shadowColor:"#000", shadowOpacity:0.25, shadowRadius:4 }}
        />
      </TouchableOpacity>

      <View className="flex-1">
        <Text className="text-black text-[17px] leading-[20px] font-semibold">{name}</Text>
        <View className="flex-row items-center mt-1">
          <View className="w-[19px] h-[19px] rounded bg-[#10CF65] items-center justify-center mr-2">
            <Ionicons name="location" size={12} color="#fff" />
          </View>
          <Text className="text-black text-[14px] leading-[17px]">{city}</Text>
        </View>
      </View>

      <View className="flex-row justify-center items-end mr-3">
        <View className="flex-row items-center mb-1">
          {mutualAvatarSrcs.slice(0,3).map((src, i) => (
            <TouchableOpacity key={`${id}-m-${i}`} onPress={onPressMutual}>
              <Image source={src} className={`w-[27px] h-[27px] rounded-full ${i ? "-ml-2" : ""}`} />
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-black text-[20px] leading-6">{mutualCount}</Text>
      </View>
    </View>
  );
}
