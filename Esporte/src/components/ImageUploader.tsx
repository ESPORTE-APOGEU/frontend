// Caminho: src/components/ui/ImageUploader.tsx
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export function ImageUploader() {
  return (
    <TouchableOpacity className="w-full h-28 opacity-50 border border-black/85 rounded-xl items-center justify-center mb-2 shadow-sm">
      <Text className="text-xs text-black/50 text-center">
        Coloque aqui a imagem{"\n"}do seu evento
      </Text>
    </TouchableOpacity>
  );
}
