import React from "react";
import { View, Text, Image } from "react-native";
import { Chip } from "../ui/Chip";

export type Activity = {
  id: string;
  title: string;
  timeAgo: string;
  icon: keyof typeof activityIcons;
  tag: string;
};

export const activityIcons = {
  soccer: require("../../assets/images/soccer-icon.png"),
  yoga: require("../../assets/images/yoga-icon.png"),
} as const;

export const ActivityItem = ({ item }: { item: Activity }) => (
  <View className="flex-row items-center px-7 py-3">
    <Image
      source={activityIcons[item.icon]}
      className="w-[20px] h-[20px] rounded-full mr-3"
    />
    <View className="flex-1">
      <Text className="text-[20px] font-medium text-black">{item.title}</Text>
      <Text className="text-[15px] text-[#969696] mt-0.5">{item.timeAgo}</Text>
    </View>
    <Chip label={item.tag} />
  </View>
);
