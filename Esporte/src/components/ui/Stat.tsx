import React from "react";
import { View, Text } from "react-native";

export const Stat = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <View className="items-center mx-2">
    <Text className="text-base font-medium text-black">{value}</Text>
    <Text className="text-[13px] text-black/80 text-center">{label}</Text>
  </View>
);
