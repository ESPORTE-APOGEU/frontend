import React from "react";
import { View, Text, Image } from "react-native";

export const SportCard = ({
  title,
  level,
  highlight,
  iconPath,
}: {
  title: string;
  level: string;
  highlight?: boolean;
  iconPath: any;
}) => (
  <View
    className={`w-[64px] h-[79px] rounded-[10px] mr-3 ${
      highlight ? "border border-[#358838]" : "border-b-2 border-b-[#43A047]"
    }`}
  >
    <View className="flex-1 bg-[#F7F7F7BF] rounded-[10px] shadow-xl items-center justify-center">
      <Image
        source={iconPath}
        style={{ width: 20, height: 20, marginBottom: 4 }}
        resizeMode="contain"
      />
      <Text className="text-[10px] font-semibold text-[#292D32]">{title}</Text>
      <Text className="text-[11px] mt-1 text-[#292D32]">{level}</Text>
    </View>
  </View>
);
