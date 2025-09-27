import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  hasArrow?: boolean;
};

export function InfoRow({ icon, title, subtitle, onPress, hasArrow = false }: Props) {
  const content = (
    <View className="flex-row items-center flex-1">
      {/* Ícone com fundo verde */}
      <View className="w-10 h-10 bg-[#7ABD7A] rounded-lg items-center justify-center shadow-md">
        <Ionicons name={icon} size={22} color="white" />
      </View>
      
      {/* Textos */}
      <View className="ml-4 flex-1">
        <Text className="text-[16px] font-bold text-black" numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text className="text-[14px] text-gray-500 mt-1">{subtitle}</Text>
        )}
      </View>
      
      {/* Seta (se aplicável) */}
      {hasArrow && <Ionicons name="chevron-forward" size={24} color="gray" />}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} className="mb-4">{content}</TouchableOpacity>;
  }

  return <View className="mb-4">{content}</View>;
}