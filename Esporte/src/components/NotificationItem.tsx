// Em: components/NotificationItem.js

import React from 'react';
import { View, Text, Image } from 'react-native';

// Mapeamento de nomes de ícones para os arquivos de imagem reais
// Isso torna o componente mais flexível.
const iconMap = {
  whatsapp: require('../assets/images/whatsapp_icon.png'),
  calendar: require('../assets/images/calendario.png'),
  info: require('../assets/images/info_icon.png'),
};

interface NotificationItemProps {
  iconName: 'whatsapp' | 'calendar' | 'info';
  title: string;
  description: string | React.ReactNode;
  timestamp: string;
  tag?: { text: string; icon: 'whatsapp' | 'calendar' | 'info' };
}

export default function NotificationItem({
  iconName,
  title,
  description,
  timestamp,
  tag
}: NotificationItemProps) {
  return (
    <View className="flex-row items-start mb-6">
      {/* Ícone */}
      <View className="w-10 h-10 bg-[#25D366] rounded-full items-center justify-center mr-4">
        <Image source={iconMap[iconName]} className="w-6 h-6" resizeMode="contain" />
      </View>
      
      {/* Conteúdo */}
      <View className="flex-1">
        <Text className="text-base font-bold text-black mb-1">{title}</Text>
        <Text className="text-base text-gray-700">{description}</Text>
        
        {/* Rodapé da Notificação */}
        <View className="flex-row justify-between items-center mt-2">
            <Text className="text-sm text-gray-500">{timestamp}</Text>
            
            {/* Tag opcional (só aparece se a prop 'tag' for passada) */}
            {tag && (
                <View className="flex-row items-center bg-gray-200 rounded-full px-3 py-1">
                    <Text className="text-xs text-gray-700 mr-1">{tag.text}</Text>
                    {tag.icon && (
                        <Image source={iconMap[tag.icon as keyof typeof iconMap]} className="w-3 h-3" />
                    )}
                </View>
            )}
        </View>
      </View>
    </View>
  );
}