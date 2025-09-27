import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

// Imagem placeholder, caso o usuário não tenha foto
const DEFAULT_AVATAR = require('../assets/images/alexandre_silva.png');

type Props = {
  name: string;
  imageUrl?: string | null;
  onPress?: () => void;
};

export function ProfileRow({ name, imageUrl, onPress }: Props) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="flex-row items-center mb-3"
      disabled={!onPress}
    >
      <Image
        source={imageUrl ? { uri: imageUrl } : DEFAULT_AVATAR}
        className="w-11 h-11 rounded-full bg-gray-200 shadow-md"
      />
      <Text className="ml-4 text-base text-black">{name}</Text>
    </TouchableOpacity>
  );
}