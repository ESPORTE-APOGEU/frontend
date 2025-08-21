// src/components/ui/FriendRow.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "../../assets/images";

export type FriendRowData = {
  id: string;
  name: string;
  avatar: keyof typeof images;
  statusLabel?: string;
};

type Props = {
  data: FriendRowData;
  onPress?: () => void;
  onStatusPress?: () => void;
};

export default function FriendRow({ data, onPress, onStatusPress }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <TouchableOpacity
        className="flex-row items-center flex-1 mr-4"
        activeOpacity={0.8}
        onPress={onPress}>
        <Image
          source={images[data.avatar]}
          className="w-9 h-9 rounded-full mr-3"
        />
        <Text className="text-black text-[16px]">{data.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="px-3 h-7 bg-[#43A047] rounded-[10.5px] items-center justify-center"
        onPress={onStatusPress}
        activeOpacity={0.8}>
        <Text className="text-white text-[12px] font-medium">
          {data.statusLabel ?? "Amigos"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
