// Caminho: src/components/ui/ScreenHeader.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  title: string;
};

export function ScreenHeader({ title }: Props) {
  return (
    <View className="flex-row items-center mb-3">
      <Feather name="chevron-left" size={28} color="#1E1E1E" />
      <Text className="flex-1 text-center text-black font-medium text-[30px] leading-[45px]">
        {title}
      </Text>
      <View style={{ width: 28 }} />
    </View>
  );
}
