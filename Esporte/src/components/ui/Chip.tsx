import React from "react";
import { View, Text } from "react-native";

export const Chip = ({ label }: { label: string }) => (
  <View className="w-16 py-1 bg-[#10CF65] text-center rounded-lg">
    <Text className="text-[#F2F2F2] text-xs text-center font-semibold">
      {label}
    </Text>
  </View>
);
