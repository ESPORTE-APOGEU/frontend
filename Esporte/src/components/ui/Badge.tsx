import React from "react";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export const Badge = ({ label }: { label: string }) => (
  <View className="flex-row items-center px-2 py-0.5 bg-[#10CF65] rounded-md shadow w-[60px] justify-center">
    <FontAwesome
      name="star"
      size={10}
      color="#fff"
      style={{ marginRight: 4 }}
    />
    <Text className="text-white text-xs font-semibold">{label}</Text>
  </View>
);
