import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export function ParticipantCounter({ label, value, setValue }: Props) {
  return (
    <View className="mb-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-black font-medium text-[15px]">{label}</Text>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => setValue((v) => Math.max(0, v - 1))}>
            <Text className="text-[#43A047] text-2xl mx-2">-</Text>
          </TouchableOpacity>
          <View className="w-[51px] h-[41px] rounded-lg border border-[#43A047] items-center justify-center shadow">
            <Text className="text-[#43A047] text-base">{value}</Text>
          </View>
          <TouchableOpacity onPress={() => setValue((v) => v + 1)}>
            <Text className="text-[#43A047] text-2xl mx-2">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
