// Caminho: src/components/ui/SubmitButton.tsx
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export function SubmitButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full h-14 bg-[#43A047] rounded-[20px] items-center justify-center shadow mt-6">
      <Text className="text-white font-semibold text-2xl">{title}</Text>
    </TouchableOpacity>
  );
}


