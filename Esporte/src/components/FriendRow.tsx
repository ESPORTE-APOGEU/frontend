import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "../assets/images";

export type FriendRowData = {
  id: string;
  name: string;
  avatar: keyof typeof images;
};

interface FriendRowProps {
  data: FriendRowData;
}

export default function FriendRow({ data }: FriendRowProps) {
  return (
    // View principal com margem inferior aumentada
    <View className="flex-row items-center justify-between mb-12">
      <View className="flex-row items-center">
        <Image
          source={images[data.avatar] || images.iconedocaba}
          className="w-9 h-9 rounded-full mr-4"
        />
        <Text className="text-black text-base font-normal">{data.name}</Text>
      </View>
      <TouchableOpacity className="bg-[#43A047] rounded-[10.5px] w-24 h-7 justify-center items-center">
        <Text className="text-white text-xs font-medium">Amigos</Text>
      </TouchableOpacity>
    </View>
  );
}
