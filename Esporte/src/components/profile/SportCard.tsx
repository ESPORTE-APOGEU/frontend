import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const SportCard = ({
  title,
  level,
  highlight,
  iconName,
}: {
  title: string;
  level: string;
  highlight?: boolean;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
}) => (
  <View
    className={`w-[64px] h-[79px] rounded-[10px] mr-3 ${
      highlight ? "border border-[#358838]" : "border-b-2 border-b-[#43A047]"
    }`}
  >
    <View className="flex-1 bg-[#F7F7F7BF] rounded-[10px] shadow-xl items-center justify-center px-1">
      <MaterialCommunityIcons name={iconName} size={22} color="#292D32" />
      <Text
        className="text-[10px] font-semibold text-[#292D32] mt-1"
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text
        className="text-[10px] text-[#292D32] mt-[2px]"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {level}
      </Text>
    </View>
  </View>
);