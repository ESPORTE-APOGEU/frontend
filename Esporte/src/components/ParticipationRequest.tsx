// Em: components/ParticipationRequest.js

import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';

// Ícones de ação (pode substituir por ícones de uma biblioteca)
const CheckIcon = () => <Text className="text-green-500 text-2xl">✓</Text>;
const RedCloseIcon = () => <Text className="text-red-500 text-2xl">✕</Text>;

interface ParticipationRequestProps {
  userImage: ImageSourcePropType;
  userName: string;
  timestamp: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ParticipationRequest({ userImage, userName, timestamp, onAccept, onDecline }: ParticipationRequestProps): React.ReactElement {
  return (
    <View className="flex-row items-center mb-6">
      {/* Imagem do Perfil */}
      <Image 
        source={userImage}
        className="w-12 h-12 rounded-full mr-4"
      />
      
      {/* Conteúdo */}
      <View className="flex-1">
        <Text className="text-base text-black">
            <Text className="font-bold">{userName}</Text> quer participar do evento
        </Text>
        <Text className="text-sm text-gray-500">{timestamp}</Text>
      </View>
      
      {/* Ações */}
      <TouchableOpacity onPress={onAccept} className="p-2">
        <CheckIcon />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDecline} className="p-2">
        <RedCloseIcon />
      </TouchableOpacity>
    </View>
  );
}